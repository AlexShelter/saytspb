const {src, dest, watch, series} = require('gulp');
const browserSync = require('browser-sync').create();
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const tinypng = require('gulp-tinypng-compress');
const cleanCSS = require('gulp-clean-css');
const minify = require('gulp-minify');


// Static server
function bs() {
  browserSync.init({
      server: {
          baseDir: "./src"
      }
  });
   watch("./src/**/*.html").on('change', browserSync.reload);
   watch("./src/sass/**/*.sass",serveSass);
   watch("./src/sass/**/*.scss",serveSass);  
   watch("./src/js/**/*.js").on('change', browserSync.reload);
   watch("./src/css/**/*.css").on('change', browserSync.reload);
};

function serveSass() {
  return src("./src/sass/**/*.sass", "./src/sass/**/*.scss")
      .pipe(sass())
      .pipe(autoprefixer({
        cascade: false
    }))
      .pipe(dest("./src/css"))
      .pipe(browserSync.stream());
};

function minifyCSS(done) {
  src('./src/css/**/*.css')
      .pipe(cssmin())
      .pipe(rename({suffix: '.min'}))
      .pipe(dest('./dist/css'));
      done();
};

function minHTML(done)  {
  src('./src/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('./dist'));
    done();
};

function minifyCssClean(done) {
  src('./src/css/**/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(dest('./dist/css'));
    done();
};


function compressJS(done) {
  src('./src/**/*.js')
    .pipe(minify({
      ext:{
        src:'.js',
        min:'.min.js'
    },
      exclude: ['tasks'],
      ignoreFiles: ['.combo.js', '*.min.js']
  }))
    .pipe(dest('./dist'))
    done();
};

function tinyImg(done) {
  src('./src/**/*.{png,jpg,jpeg}')
      .pipe(tinypng({
          key: 'w0KzdvkLx33cs60XKbqPhXWbNqRhK1DR',
          sigFile: 'images/.tinypng-sigs',
          log: true
      }))
      .pipe(dest('./dist'));
  src('./src/**/*.svg')
      .pipe(dest('dist/'));
  done();
};

function php(done) {
  src(['./src/**.php', ])
     .pipe(dest('dist/'));
  src(['./src/phpmailer/**/**'])
     .pipe(dest('dist/phpmailer'));
  done();
}

function fonts(done) {
  src('./src/fonts/**/**')
     .pipe(dest('dist/fonts'));
  done();
}

exports.serve = bs;
exports.minifyCSS = minifyCSS;
exports.minHTML = minHTML;
exports.minCSS = minifyCssClean;
exports.minJS = compressJS;
exports.minImg = tinyImg;
exports.php = php;
exports.fonts = fonts;
exports.build = series(minHTML, minifyCssClean, compressJS, tinyImg, php, fonts);