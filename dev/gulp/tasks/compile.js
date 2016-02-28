var gulp = require( 'gulp' );
var less = require( 'gulp-less' );
var config = require( '../config' );
var wrapper = require( 'gulp-wrapper' );
var path = require( 'path' );
var rename = require( 'gulp-rename' );

gulp.task( 'styles-compile', [ 'styles-concat' ], function () {

    return gulp.src( config.build.less_concat )
        .pipe( less() )
        .pipe( gulp.dest( config.paths.build + '/styles/' ) );
} );

gulp.task( 'compile', [ 'styles-compile' ] );
