
'use strict';

var gulp = require("gulp");
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
let minifyCSS = require('gulp-clean-css');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var htmlmin = require('gulp-htmlmin');
var browserSync = require('browser-sync').create();
var gulpCopy = require('gulp-copy');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var merge = require('merge-stream');
var fs = require('fs');
var dir = './public_development';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

gulp.task("minify-css", function (e) {
    gulp.src('public_development/css/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(minifyCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(concat('main.style.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/stylesheets/'));

});

gulp.task('minify-html', function () {
    return gulp.src('public_development/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('public/'));
});

gulp.task('minify-image', () =>
    gulp.src('public_development/images/**/*.+(png|jpg|jpeg|gif)')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(gulp.dest('public/images'))
);

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    });
});

gulp.task('ng-copy', function () {
    return gulp
        .src('./public_development/*.html')
        .pipe(gulp.dest('./public/'));
});

gulp.task('ng', function () {
    return gulp
        .src('public_development/ng/**/')
        .pipe(gulp.dest('public/ng/'));
});

gulp.task('bower-copy', function () {
    return gulp
        .src('public_development/bower_components/**/')
        .pipe(gulp.dest('public/bower_components/'));
});

gulp.task('minify-js', function () {
    return gulp.src('public_development/javascripts/**/*.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(concat('main.style.js'))
        .pipe(gulp.dest('public/javascripts/'));

});

gulp.task('build-minify-styles', function () {

    var lessStream = gulp.src(['public_development/less/**/*.*'])
        .pipe(less())
        .pipe(concat('less-files.less'));

    var scssStream = gulp.src(['public_development/sass/**/*.*'])
        .pipe(sass())
        .pipe(concat('scss-files.scss'));

    var cssStream = gulp.src(['public_development/css/**/*.*'])
        .pipe(concat('css-files.css'));

    var mergedStream = merge(lessStream, scssStream, cssStream)
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(rename({ suffix: '.min' }))
        .pipe(concat('main.style.css'))
        .pipe(minifyCSS({ compatibility: 'ie8' }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/stylesheets/'));
    return mergedStream;
});

gulp.task('watch', function () {
    gulp.watch("public_development/stylesheets/*.*", ['build-minify-styles']);
    gulp.watch("public_development/css/*.*", ['build-minify-styles']);
    gulp.watch("public_development/sass/*.*", ['build-minify-styles']);
    gulp.watch("public_development/less/*.*", ['build-minify-styles']);
    gulp.watch("public_development/*.html", ['ng-copy']);
    gulp.watch("public_development/bower_components/**/", ['bower-copy']);
    gulp.watch("public_development/ng/**/", ['ng']);
    gulp.watch("public_development/ng/*.js", ['ng']);
    gulp.watch("public_development/images/*.*", ['minify-image']);
    gulp.watch("public_development/javascripts/*.js", ['minify-js']);
    gulp.watch("public_development/**/*.*").on('change', browserSync.reload);
});

gulp.task('build-clean', function () {
    var cleanTask = ['public/stylesheets/**/*.css', 'public/javascripts/**/*.js']
    return del.sync(cleanTask);

});

gulp.task("default", ['build-minify-styles', 'minify-html', 'minify-image', 'minify-js', 'ng-copy', 'ng', 'bower-copy', 'watch', 'browser-sync']);
gulp.task("build");