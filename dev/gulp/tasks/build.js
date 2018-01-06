const gulp = require('gulp');
const uglify = require('gulp-uglify-es').default;
const config = require('../config');
const del = require('del');
const runSequence = require('run-sequence');
const moreLess = require('gulp-more-less');
const replace = require('gulp-replace');

gulp.task('build:copy-app', ['copy-prod'], () =>
    gulp.src(`${config.paths.www_site}/**/*`, {
        base: './app/'
    }).pipe(gulp.dest(config.paths.peace)));

gulp.task('build:includesVersion', () => {
    const ver = Date.now();

    return gulp.src([`${config.paths.peace}/index.html`])
        .pipe(replace(/_version_/g, `ver=${ver}`))
        .pipe(gulp.dest(config.paths.peace));
});


gulp.task('build:turnOffDebug', () => gulp.src([`${config.paths.peace}/js/main.js`])
    .pipe(replace(/(.DEBUG.)\s*:\s*true/, '$1:false'))
    .pipe(gulp.dest(`${config.paths.peace}/js/`)));

gulp.task('build:clean-app', () => del([config.paths.www_site]));


gulp.task('build:copy', (cb) => {
    runSequence(
        'build:clean-app',
        'build:copy-app',
        'build:turnOffDebug',
        'build:includesVersion',
        ['build:minify-js', 'build:minify-css'],
        cb
    );
});

gulp.task('build:minify-js', [], () => {
    const paths = [
        `${config.paths.peace}/js/main.js`
    ];

    return gulp.src(paths)
        .pipe(uglify())
        .pipe(gulp.dest(`${config.paths.peace}/js/`))
        .on('error', (err) => {
            console.error('Error in compress task', err.toString());
        });
});

gulp.task('build:minify-css', [], () => {
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

gulp.task('build', ['build:copy']);
