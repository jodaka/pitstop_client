const gulp = require('gulp');
const concat = require('gulp-concat');
const config = require('../config');
const wrapper = require('gulp-wrapper');
const rename = require('gulp-rename');
const moreLess = require('gulp-more-less');

gulp.task('js-concat', ['js-include-config'], () => {
    const paths = [
        `${config.paths.src}/components/modulesInit.js`,
        `${config.paths.build}/js/configInclude.js`,
        `${config.paths.build}/js/directives-templates.js`,
        `${config.paths.src}/components/**/*.js`
    ];

    return gulp.src(paths)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(`${config.paths.build}/js/`));
});

gulp.task('js-include-config', () => gulp.src(`${config.paths.root}/config.json`)
    .pipe(wrapper({
        header: () => 'angular.module( \'k.config\' ).constant( \'AppConfig\',',
        footer: ');'
    }))
    .pipe(rename({
        suffix: 'Include',
        extname: '.js'
    }))
    .pipe(gulp.dest(`${config.paths.build}/js/`)));

gulp.task('js-deps-concat-prod', () => {
    const paths = [
        `${config.paths.npm}/angular/angular.min.js`,
        `${config.paths.npm}/@uirouter/core/_bundles/ui-router-core.min.js`,
        `${config.paths.npm}/@uirouter/angularjs/release/ui-router-angularjs.min.js`
    ];

    return gulp.src(paths)
        .pipe(concat('angular-deps.js'))
        .pipe(gulp.dest(`${config.paths.build}/js/`));
});

gulp.task('js-deps-concat', () => {
    const paths = [
        `${config.paths.npm}/angular/angular.js`,
        `${config.paths.npm}/@uirouter/core/_bundles/ui-router-core.js`,
        `${config.paths.npm}/@uirouter/angularjs/release/ui-router-angularjs.js`
    ];

    return gulp.src(paths)
        .pipe(concat('angular-deps.js'))
        .pipe(gulp.dest(`${config.paths.build}/js/`));
});


gulp.task('styles-compile', () => {
    const paths = [
        `${config.paths.src}/components/*.less`
    ];

    return gulp.src(paths)
        .pipe(concat('styles.less'))
        .pipe(moreLess({
            more: false,
            less: true
        }))
        .pipe(gulp.dest(`${config.paths.www_site}/css/`));
});


gulp.task('concat', ['js-concat']);
