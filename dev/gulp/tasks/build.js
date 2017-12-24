const gulp = require('gulp');
const uglify = require('gulp-uglify');
const config = require('../config');
const del = require('del');
const runSequence = require('run-sequence');
const moreLess = require('gulp-more-less');
const replace = require('gulp-replace');
const babel = require('gulp-babel');

const handleErrors = (err) => {
    console.error(err);
};

gulp.task('build:copy-app', ['copy'], () =>
    gulp.src(`${config.paths.www_site}/**/*`, {
        base: './app/'
    }).pipe(gulp.dest(config.paths.peace)));

gulp.task('build:includesVersion', () => {
    const ver = Date.now();

    gulp.src([`${config.paths.peace}/index.html`])
        .pipe(replace(/_version_/g, `ver=${ver}`))
        .pipe(gulp.dest(config.paths.peace));
});


gulp.task('build:turnOffDebug', () => {
    gulp.src([`${config.paths.peace}/js/main.js`])
        .pipe(replace(/(.DEBUG.)\s*:\s*true/, '$1:false'))
        .pipe(gulp.dest(`${config.paths.peace}/js/`));
});

gulp.task('build:clean-app', () => del([config.paths.www_site]));


gulp.task('build:copy', (cb) => {
    runSequence(
        'build:clean-app',
        'build:copy-app',
        'build:turnOffDebug',
        'build:includesVersion',
        cb
    );
});

gulp.task('build:minify-js', ['build:copy'], () => {
    const paths = [
        `${config.paths.peace}/js/*.js`
    ];

    return gulp.src(paths)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify()).on('error', handleErrors)
        .pipe(gulp.dest(`${config.paths.peace}/js/`));
});

gulp.task('build:minify-css', ['build:copy'], () => {
    const paths = [
        `${config.paths.peace}/css/*.css`
    ];

    return gulp.src(paths)
        .pipe(moreLess({
            more: true,
            less: false
        }))
        .pipe(gulp.dest(`${config.paths.peace}/css/`));
});

gulp.task('build:minify', ['build:minify-css', 'build:minify-js']);

gulp.task('build', ['build:minify']);
