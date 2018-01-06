const gulp = require('gulp');
const config = require('../config');

const copyPaths = [
    `${config.paths.build}/js/main.js`,
    `${config.paths.src}/components/bootstrap.js`,
    `${config.paths.build}/js/angular-deps.js`
];

gulp.task('js-copy', ['js-deps-concat', 'js-concat'], () => gulp.src(copyPaths)
    .pipe(gulp.dest(`${config.paths.www_site}/js/`)));
gulp.task('js-copy-prod', ['js-deps-concat-prod', 'js-concat'], () => gulp.src(copyPaths)
    .pipe(gulp.dest(`${config.paths.www_site}/js/`)));

gulp.task('html-templates-copy', () => gulp.src(`${config.paths.src}/components/**/*.html`)
    .pipe(gulp.dest(`${config.paths.www_site}/partials/`)));

gulp.task('html-copy', () => gulp.src(`${config.paths.src}/html/*.html`)
    .pipe(gulp.dest(`${config.paths.www_site}/`)));

gulp.task('copy', ['html-templates-copy', 'js-copy', 'html-copy', 'styles-compile']);
gulp.task('copy-prod', ['html-templates-copy', 'js-copy-prod', 'html-copy', 'styles-compile']);
