const gulp = require('gulp');
const config = require('../config');

gulp.task('js-copy', ['js-deps-concat', 'js-concat'], () => {
    const paths = [
        `${config.paths.build}/js/main.js`,
        `${config.paths.src}/components/bootstrap.js`,
        `${config.paths.build}/js/angular-deps.js`
    ];

    return gulp.src(paths)
        .pipe(gulp.dest(`${config.paths.www_site}/js/`));
});

gulp.task('html-templates-copy', () => gulp.src(`${config.paths.src}/components/**/*.html`)
        .pipe(gulp.dest(`${config.paths.www_site}/partials/`)));

gulp.task('html-copy', () => gulp.src(`${config.paths.src}/html/*.html`)
        .pipe(gulp.dest(`${config.paths.www_site}/`)));

gulp.task('copy', ['html-templates-copy', 'js-copy', 'js-copy', 'html-copy', 'styles-compile']);
