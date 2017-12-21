const gulp = require('gulp');
const config = require('../config');
const del = require('del');

gulp.task('clean', () => del([
    config.paths.build,
    config.paths.www_site
]));
