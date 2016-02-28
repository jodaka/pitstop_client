/**
 * Serve the site with live reload
 **/

var gulp = require( 'gulp' );
var browserSync = require( 'browser-sync' );
var config = require( '../config' );

gulp.task( 'serve', [ 'copy' ], function () {

    browserSync.init( {
        server: {
            baseDir: './app/'
        },
        https: false
    } );

    gulp.watch( config.paths.src + '/styles/*.less', [ 'styles-copy' ] )
        .on( 'change', browserSync.reload );

    gulp.watch( config.paths.src + '/styles/**/*.less', [ 'styles-copy' ] )
        .on( 'change', browserSync.reload );

    gulp.watch( config.paths.src + '/js/*.js', [ 'js-copy' ] )
        .on( 'change', browserSync.reload );

    gulp.watch( config.paths.src + '/js/**/*.js', [ 'js-copy' ] )
        .on( 'change', browserSync.reload );

    gulp.watch( config.paths.src + '/html/*.html', [ 'html-copy' ] )
        .on( 'change', browserSync.reload );

    gulp.watch( config.paths.src + '/js/**/*.html', [ 'html-templates-copy' ] )
        .on( 'change', browserSync.reload );

    gulp.watch( config.paths.src + '/js/**/*.tmpl.html', [ 'js-copy' ] )
        .on( 'change', browserSync.reload );
} );
