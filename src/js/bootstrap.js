/*global angular document window */
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
            'ngAnimate',
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
                    .when( '/races/:clubs/:page', {
                        templateUrl: 'partials/races/races.html',
                        controller: 'RacesCtrl'
                    } )
                    .otherwise( {
                        redirectTo: '/races'
                    } );
        } ] );

        app.config( [ '$compileProvider', function ( $compileProvider ) {
            $compileProvider.debugInfoEnabled( false );
        } ] );

        angular.bootstrap( node, [ 'k' ], {
            strictDi: true
        } );
    };

    d.addEventListener( 'DOMContentLoaded', initApplication );

}( window, document ) );
