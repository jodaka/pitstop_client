/*global require*/
let gulp = require( 'gulp' );
let uglify = require( 'gulp-uglify' );
let config = require( '../config' );
let del = require( 'del' );
let runSequence = require( 'run-sequence' );
let moreLess = require( 'gulp-more-less' );
let replace = require( 'gulp-replace' );

let handleErrors = ( err ) => {
    console.error( err );
};

gulp.task( 'build:copy-app', [ 'copy' ], () => {

    return gulp.src( config.paths.www_site + '/**/*', {
            base: './app/'
        } )
        .pipe( gulp.dest( config.paths.peace ) );

} );

gulp.task( 'build:includesVersion', () => {

    let ver = Date.now();

    gulp.src( [ config.paths.peace + '/index.html' ] )
        .pipe( replace( /_version_/g, 'ver=' + ver ) )
        .pipe( gulp.dest( config.paths.peace ) );
} );


gulp.task( 'build:turnOffDebug', () => {

    gulp.src( [ config.paths.peace + '/js/main.js' ] )
        .pipe( replace( /(.DEBUG.)\s*:\s*true/, '$1:false' ) )
        .pipe( gulp.dest( config.paths.peace + '/js/' ) );

} );

gulp.task( 'build:clean-app', () => {
    return del( [ config.paths.www_site ] );
} );


gulp.task( 'build:copy', ( cb ) => {

    runSequence(
        'build:clean-app',
        'build:copy-app',
        'build:turnOffDebug',
        'build:includesVersion',
        cb );

} );

gulp.task( 'build:minify-js', [ 'build:copy' ], () => {

    let paths = [
        config.paths.peace + '/js/*.js',
    ];

    return gulp.src( paths )
        .pipe( uglify() ).on( 'error', handleErrors )
        .pipe( gulp.dest( config.paths.peace + '/js/' ) );

} );

gulp.task( 'build:minify-css', [ 'build:copy' ], () => {

    let paths = [
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

gulp.task( 'build', [ 'build:minify' ] );
