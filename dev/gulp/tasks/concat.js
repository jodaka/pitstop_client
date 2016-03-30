let gulp = require( 'gulp' );
let concat = require( 'gulp-concat' );
let config = require( '../config' );
let preprocess = require( 'gulp-preprocess' );
let wrapper = require( 'gulp-wrapper' );
let rename = require( 'gulp-rename' );
let moreLess = require( 'gulp-more-less' );

gulp.task( 'js-concat', [ 'js-include-config' ], () => {

    let paths = [
            config.paths.src + '/components/modulesInit.js',
            config.paths.build + '/js/configInclude.js',
            config.paths.build + '/js/directives-templates.js',
            config.paths.src + '/components/**/*.js',
        ];

    return gulp.src( paths )
        .pipe( concat( 'main.js' ) )
        .pipe( preprocess() ) // this would process @includes
        .pipe( gulp.dest( config.paths.build + '/js/' ) );
} );

gulp.task( 'js-include-config', () => {

    return gulp.src( config.paths.root + '/config.json' )
        .pipe(
            wrapper( {
                'header': () => 'angular.module( \'k.config\' ).constant( \'AppConfig\',',
                'footer': ');'
            } )
        )
        .pipe( rename( {
            suffix: 'Include',
            extname: '.js'
        } ) )
        .pipe( gulp.dest( config.paths.build + '/js/' ) );
} );

gulp.task( 'js-deps-concat', () => {

    let paths = [
        config.paths.npm + '/angular/angular.js',
        config.paths.npm + '/angular-route/angular-route.js',
    ];

    return gulp.src( paths )
        .pipe( concat( 'angular-deps.js' ) )
        .pipe( gulp.dest( config.paths.build + '/js/' ) );

} );


gulp.task( 'styles-compile', () => {

    let paths = [
        config.paths.src + '/components/*.less'
    ];

    return gulp.src( paths )
        .pipe( concat( 'styles.less' ) )
        .pipe( moreLess( {
            'more': false,
            'less': true
        } ) )
        .pipe( gulp.dest( config.paths.www_site + '/css/' ) );
} );


gulp.task( 'concat', [ 'js-concat' ] );
