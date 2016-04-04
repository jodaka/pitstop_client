( function ( w, d ) {

    'use strict';

    // global errors handler
    if ( typeof w.onerror === 'undefined' ) {
        w.onerror = function ( msg, url, linenumber ) {
            console.warn( 'Error message: ' + msg + '\nURL: ' + url + '\nLine Number: ' + linenumber );
            return true;
        };
    }

    /**
     * Loads CSS/JS dependencies and init angular application
     */
    var initApplication = function () {

        // this is a main holder
        var node = d.querySelector( '.k-main' );

        // and this is router pager
        var holder = d.createElement( 'div' );
        holder.setAttribute( 'ng-view', '' );
        holder.setAttribute( 'class', 'a-view' );
        node.appendChild( holder );

        // If no errors detected, we initialize Angular
        var app = angular.module( 'k', [
            'ngRoute',
            'k.controllers',
            'k.directives',
            'k.services',
            'k.utils',
            'k.config'
        ] );

        app.config( [ '$routeProvider',
            function ( $routeProvider ) {

                $routeProvider
                    .when( '/race/:id', {
                        templateUrl: 'partials/race/race.html',
                        controller: 'RaceCtrl'
                    } )
                    .when( '/live/:club', {
                        templateUrl: 'partials/live/live.html'
                    } )
                    .when( '/races/:club?/:period?/:page?', {
                        templateUrl: 'partials/races/races.html',
                        controller: 'RacesCtrl'
                    } )
                    .when( '/pilot/:id?/:page?', {
                        templateUrl: 'partials/pilot/pilot.html',
                        controller: 'PilotCtrl'
                    } )
                    .when( '/club/:club?/:period?', {
                        templateUrl: 'partials/club/club.html',
                        controller: 'ClubCtrl'
                    } )
                    .otherwise( {
                        redirectTo: '/races'
                    } );
        } ] );

        app.config( [ '$compileProvider', function ( $compileProvider ) {
            $compileProvider.debugInfoEnabled( false );
        } ] );

        app.run( [ '$rootScope', function ( $rootScope ) {
            $rootScope.$on( '$locationChangeSuccess', function (scope, newState, oldState) {
                if ( newState !== oldState ) {
                    $rootScope.previousPage = oldState;
                }
            } );
        } ] );

        angular.bootstrap( node, [ 'k' ], {
            strictDi: true
        } );


    };

    d.addEventListener( 'DOMContentLoaded', initApplication );

}( window, document ) );
