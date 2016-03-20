var gulp = require( 'gulp' );
var concat = require( 'gulp-concat' );
var config = require( '../config' );
var preprocess = require( 'gulp-preprocess' );
var wrapper = require( 'gulp-wrapper' );
var path = require( 'path' );
var rename = require( 'gulp-rename' );


gulp.task( 'js-concat', [ 'js-angular-concat' ], function () {

    var paths = [
        config.paths.build + '/js/angular-scripts.js',
    ];

    return gulp.src( paths )
        .pipe( concat( 'main.js' ) )
        .pipe( preprocess() ) // this would process @includes
        .pipe( gulp.dest( config.paths.build + '/js/' ) );
} );


gulp.task( 'js-compile-directive-templates', function () {

    var angularTemplateCache = require( 'gulp-angular-templatecache' );
    var htmlClean = require( 'gulp-htmlclean' );

    return gulp.src( config.paths.src + '/js/**/*.tmpl.html' )
        .pipe( htmlClean() )
        .pipe( angularTemplateCache( 'directives-templates.js', {
            'module': 'k.utils',
            'transformUrl': function ( url ) {
                return url.replace( /\.tmpl\.html$/, '' );
            }
        } ) )
        .pipe( gulp.dest( config.paths.build + '/js/' ) );
} );

gulp.task( 'js-include-config', function () {

    return gulp.src( config.paths.root + '/config.json' )
        .pipe(
            wrapper( {
                'header': function() {
                    return 'angular.module( \'k.config\' ).constant( \'AppConfig\',';
                },
                'footer': ');'
            } )
        )
        .pipe( rename( {
            suffix: 'Include',
            extname: '.js'
        } ) )
        .pipe( gulp.dest( config.paths.build + '/js/' ) );
} );


gulp.task( 'js-angular-concat', [ 'js-include-config', 'js-compile-directive-templates' ], function () {

    var paths = [
        config.paths.src + '/js/modulesInit.js',
        config.paths.build + '/js/configInclude.js',
        config.paths.build + '/js/directives-templates.js',
        config.paths.src + '/js/**/*.js',
    ];

    return gulp.src( paths )
        .pipe( concat( 'angular-scripts.js' ) )
        .pipe( gulp.dest( config.paths.build + '/js/' ) );

} );


gulp.task( 'js-deps-concat', function () {

    var paths = [
        config.paths.bower + '/angularjs/angular.js',
        config.paths.bower + '/angular-route/angular-route.js',
        // config.paths.bower + '/Chart.js/Chart.js'
        //config.paths.bower + '/angular-animate/angular-animate.js',
    ];

    return gulp.src( paths )
        .pipe( concat( 'angular-deps.js' ) )
        .pipe( gulp.dest( config.paths.build + '/js/' ) );

} );

gulp.task( 'styles-deps-concat', [ 'styles-compile' ], function () {

    var paths = [
        config.paths.build + '/styles/_styles.css',
        config.paths.build + '/styles/icons.css'
    ];

    return gulp.src( paths )
        .pipe( concat( 'styles.css' ) )
        .pipe( gulp.dest( config.paths.build + '/styles/' ) );


} );

gulp.task( 'styles-concat', function () {

    var paths = [
        config.paths.src + '/styles/*.less',
        config.paths.src + '/styles/**/*.less'
    ];

    return gulp.src( paths )
        .pipe( concat( '_styles.less' ) )
        .pipe( gulp.dest( config.paths.build + '/styles/' ) );
} );


gulp.task( 'concat', [ 'styles-concat', 'js-angular-concat' ] );
