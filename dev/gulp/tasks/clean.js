var gulp = require( 'gulp' );
var config = require( '../config' );
var del = require( 'del' );

gulp.task( 'clean', () => {

    return del( [
        config.paths.build,
        config.paths.www_site
    ] );

} );
