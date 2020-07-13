const gulp = require('gulp'); 
const nunjucksRender = require('gulp-nunjucks-render');
const sass = require('gulp-sass'); 
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const minify = require('gulp-minify');
const webp = require('gulp-webp');
const del = require('del');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');

function nunjucks() {
    // Gets .html and .nunjucks files in pages
    return gulp.src('src/pages/**/*.+(html|njk)')
        // Renders template with nunjucks
        .pipe(nunjucksRender({
            path: ['src/templates']
        }))
        // output files in app folder
        .pipe(gulp.dest('src'))
}

function styles() {
    // where is my scss
    return gulp.src('src/assets/scss/**/*.scss')
        // pass that through sass compiler
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        // autoprefix for cross browser compatibility
        .pipe(autoprefixer())
        // minify
        .pipe(csso())
        // rename to .min.css
        .pipe(rename({
            suffix: '.min'
        }))
        // where to save
        .pipe(gulp.dest('src/assets/css'))
        // stream changes to all browsers
        .pipe(browserSync.stream())
}

function scripts() {
    return gulp.src('src/assets/js/*.js')
        // minify
        .pipe(minify({
            ext: {
                min: '.min.js'
            }
        }))
        // output
        .pipe(gulp.dest('src/assets/js'))
        // stream changes
        .pipe(browserSync.stream())
}

function images() {
    return gulp.src(['src/assets/images/**/*.jpg', 'src/assets/images/**/*.png'])
        // minify
        .pipe(webp())
        // output
        .pipe(gulp.dest('src/assets/images'))
        // stream changes
        .pipe(browserSync.stream())
}

function clean() {
    return del(['src/*.html']);
}

function watch() {
    browserSync.init({
        server: {
            baseDir: 'src'
        },
        plugins: ['bs-console-qrcode']
    });
    gulp.watch('src/assets/scss/**/*.scss', styles);
    gulp.watch('src/**/*.njk', nunjucks);
    gulp.watch('src/*.html').on('change', browserSync.reload);
    gulp.watch('src/assets/js/**/*.js').on('change', browserSync.reload);
}

exports.nunjucks = nunjucks;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.clean = clean;
exports.watch = watch;

gulp.task('default', gulp.parallel(scripts, styles, images, nunjucks));