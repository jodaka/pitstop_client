/*global localStorage*/
angular.module( 'k.controllers' ).controller( 'RacesCtrl', [
'AppConfig', '$scope', '$routeParams', '$location',
function RaceCtrlFactory( AppConfig, $scope, $routeParams, $location ) {
        'use strict';

        $scope.clubs = AppConfig.clubs;
        $scope.clubsIds = {};

        for ( var cl in AppConfig.clubsEn ) {
            if ( AppConfig.clubsEn.hasOwnProperty( cl ) ) {
                $scope.clubsIds[ AppConfig.clubsEn[ cl ] ] = cl;
            }
        }

        $scope.setPeriod = function ( period ) {

            if ( period === 'all' ) {
                $scope.period = period;
            } else {
                $scope.period = 'date';
                $scope.date = period;
            }

            saveUrlParams();
        };

        $scope.periodIsActive = function ( period ) {
            if ( $scope.period === 'all' && period === 'all' ) {
                return true;
            }
            if ( $scope.period === 'date' && period === $scope.date ) {
                return true;
            }

            return false;
        };

        $scope.selectClub = function ( id ) {
            var idx = $scope.selectedClubs.indexOf( id );
            if ( idx > -1 ) {
                $scope.selectedClubs.splice( idx, 1 );
            } else {
                $scope.selectedClubs.push( id );
            }
            saveUrlParams();
        };

        $scope.changePage = function ( page ) {
            if ( page && page !== $scope.page ) {
                $scope.page = page;
                saveUrlParams();
            }
        };

        var saveUrlParams = function () {

            localStorage.setItem( 'selectedClubs', JSON.stringify( $scope.selectedClubs ) );
            var clubs = [];

            for ( var i = 0; i < $scope.selectedClubs.length; i++ ) {
                clubs.push( $scope.clubsIds[ $scope.selectedClubs[ i ] ] );
            }

            var period = ( $scope.date === null ) ? $scope.page : $scope.date;
            $location.path( '/races/' + clubs.join( ',' ) + '/' + $scope.period + '/' + period );
        };

        var redirectToDefault = function () {

            $scope.page = 1;
            $scope.date = null;
            $scope.period = 'all';

            var savedClubsList = localStorage.getItem( 'selectedClubs' );
            if ( savedClubsList ) {
                try {
                    $scope.selectedClubs = JSON.parse( savedClubsList );
                } catch ( e ) {
                    $scope.selectedClubs = [ '586', '686', '786' ];
                }
            }
            saveUrlParams();
        };

        var period = $routeParams.period;
        var page = $routeParams.page;
        var date = null;

        if ( !( period === 'all' || period === 'date' ) ) {
            period = 'all';
        }

        var today = new Date();
        $scope.today = today.toISOString().slice( 0, 10 );
        today.setDate( today.getDate() - 1 );
        $scope.yesterday = new Date( today.getTime() ).toISOString().slice( 0, 10 );

        // check if page is actually a day
        if ( period === 'date' && /\d\d\d\d-\d\d-\d\d/.test( page ) ) {

            try {
                date = new Date( page );
                date = page;
            } catch ( err ) {
                page = 1;
                date = null;
                period = 'all';
            }

        } else {

            period = 'all';
            page = Number( page );
            if ( isNaN( page ) || !Number.isInteger( page ) ) {
                redirectToDefault();
                return;
            }
        }

        $scope.period = period;
        $scope.date = date;
        $scope.page = page;

        $scope.selectedClubs = [];
        var clubsParam = $routeParams.clubs;
        if ( !clubsParam ) {
            redirectToDefault();
            return;
        }

        clubsParam = clubsParam.split( ',' );
        for ( var i = 0; i < clubsParam.length; i++ ) {
            if ( AppConfig.clubsEn.hasOwnProperty( clubsParam[ i ] ) ) {
                $scope.selectedClubs.push( String( AppConfig.clubsEn[ clubsParam[ i ] ] ) );
            }
        }

        console.log( 5555, $scope.selectedClubs );

} ] );
