/*global require*/
var gulp = require( 'gulp' );
var uglify = require( 'gulp-uglify' );
var config = require( '../config' );
var del = require( 'del' );
var runSequence = require( 'run-sequence' );
var moreLess = require( 'gulp-more-less' );
var replace = require( 'gulp-replace' );
var concat = require( 'gulp-concat' );

gulp.task( 'build:copy-app', [ 'copy' ], function () {

    return gulp.src( config.paths.www_site + '/**/*', {
            base: './app/'
        } )
        .pipe( gulp.dest( config.paths.peace ) );

} );

gulp.task( 'build:includesVersion', function () {

    var ver = Date.now();

    gulp.src( [ config.paths.peace + '/index.html' ] )
        .pipe( replace( /_version_/g, 'ver=' + ver ) )
        .pipe( gulp.dest( config.paths.peace ) );
} );


gulp.task( 'build:turnOffDebug', function () {

    gulp.src( [ config.paths.peace + '/js/main.js' ] )
        .pipe( replace( /(.DEBUG.)\s*:\s*true/, '$1:false' ) )
        .pipe( gulp.dest( config.paths.peace + '/js/' ) );

} );

gulp.task( 'build:clean-app', function ( cb ) {
    del( [ config.paths.www_site ] ).then( function () {
        cb();
    } );
} );


gulp.task( 'build:copy', [ 'build:clean-app' ], function ( cb ) {

    runSequence(
        'build:copy-app',
        'build:turnOffDebug',
        'build:includesVersion',
        cb );

} );

var handleErrors = function ( err ) {
    console.error( err );
};

gulp.task( 'build:minify-js', [ 'build:copy' ], function () {

    var paths = [
        config.paths.peace + '/js/*.js',
    ];

    return gulp.src( paths )
        .pipe( uglify() ).on( 'error', handleErrors )
        .pipe( gulp.dest( config.paths.peace + '/js/' ) );

} );


gulp.task( 'build:minify-css', [ 'build:copy' ], function () {

    var paths = [
        config.paths.peace + '/css/*.css',
    ];

    return gulp.src( paths )
        .pipe( moreLess( {
            'more': true,
            'less': false
        } ) )
        .pipe( gulp.dest( config.paths.peace + '/css/' ) );

} );


gulp.task( 'build:minify', [ 'build:minify-css', 'build:minify-js' ] );

gulp.task( 'build:concat-polyfills', [ 'build:minify' ], function () {

    // put all polyfills here
    var paths = [
            config.paths.peace + '/js/bootstrap.js'
        ];

    return gulp.src( paths )
        .pipe( concat( 'bootstrap.js' ) )
        .pipe( gulp.dest( config.paths.peace + '/js/' ) );

} );


gulp.task( 'build:clean', [ 'build:concat-polyfills' ], function ( cb ) {

    // setTimeout( function () {
    //     del( [ config.paths.peace ], cb );
    // }, 100 );
} );

gulp.task( 'build', [ 'build:clean' ] );
