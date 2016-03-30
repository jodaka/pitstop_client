/**
 * Serve the site with live reload
 **/

let gulp = require( 'gulp' );
let browserSync = require( 'browser-sync' );
let config = require( '../config' );

gulp.task( 'serve', [ 'copy' ], () => {

    browserSync.init( {
        server: {
            baseDir: './app/'
        },
        https: false
    } );

    gulp.watch( config.paths.src + '/components/*.less', [ 'styles-compile' ] )
        .on( 'change', browserSync.reload );

    gulp.watch( config.paths.src + '/components/**/*.less', [ 'styles-compile' ] )
        .on( 'change', browserSync.reload );

    gulp.watch( config.paths.src + '/components/*.js', [ 'js-copy' ] )
        .on( 'change', browserSync.reload );

    gulp.watch( config.paths.src + '/components/**/*.js', [ 'js-copy' ] )
        .on( 'change', browserSync.reload );

    gulp.watch( config.paths.src + '/html/*.html', [ 'html-copy' ] )
        .on( 'change', browserSync.reload );

    gulp.watch( config.paths.src + '/components/**/*.html', [ 'html-templates-copy' ] )
        .on( 'change', browserSync.reload );

    gulp.watch( config.paths.src + '/components/**/*.tmpl.html', [ 'js-copy' ] )
        .on( 'change', browserSync.reload );
} );
