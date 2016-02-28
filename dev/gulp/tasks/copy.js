var gulp = require( 'gulp' );
var gulpfilter = require( 'gulp-filter' );
var config = require( '../config' );

gulp.task( 'js-copy', [ 'js-deps-copy', 'js-bootstrap-copy' ] );


gulp.task( 'js-deps-copy', [ 'js-deps-concat', 'js-concat' ], function () {

    var paths = [
        config.paths.build + '/js/main.js',
        config.paths.build + '/js/bootstrap.js',
        config.paths.build + '/js/angular-deps.js'
    ];

    return gulp.src( paths )
        .pipe( gulp.dest( config.paths.www_site + '/js/' ) );
} );

gulp.task( 'js-bootstrap-copy', function () {
    return gulp.src( config.paths.src + '/js/bootstrap.js' )
        .pipe( gulp.dest( config.paths.www_site + '/js/' ) );
} );


gulp.task( 'html-templates-copy', function () {

    var ignoreDirectiveTemplates = gulpfilter( function ( file ) {
        return ( !/\.tmpl\.html$/.test( file.path ) );
    } );

    return gulp.src( config.paths.src + '/js/**/*.html' )
        .pipe( ignoreDirectiveTemplates )
        .pipe( gulp.dest( config.paths.www_site + '/partials/' ) );
} );

gulp.task( 'styles-copy', [ 'styles-deps-concat' ], function () {
    return gulp.src( config.paths.build + '/styles/styles.css' )
        .pipe( gulp.dest( config.paths.www_site + '/css/' ) );
} );

gulp.task( 'html-copy', function () {
    return gulp.src( config.paths.src + '/html/*.html' )
        .pipe( gulp.dest( config.paths.www_site + '/' ) );
} );

gulp.task( 'copy', [ 'html-templates-copy', 'js-deps-copy', 'js-copy', 'html-copy', 'styles-copy' ] );
