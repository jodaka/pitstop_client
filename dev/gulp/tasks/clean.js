var gulp = require( 'gulp' );
var config = require( '../config' );
var del = require( 'del' );

gulp.task( 'clean', function ( cb ) {

    var paths = [
        config.paths.build,
        config.paths.www_site
    ];

    del( paths, cb );

} );
