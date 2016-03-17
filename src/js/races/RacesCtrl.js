/*global localStorage*/
angular.module( 'k.controllers' ).controller( 'RacesCtrl', [
'clubsDict', '$scope', '$routeParams', '$location',
function RaceCtrlFactory( clubsDict, $scope, $routeParams, $location ) {
        'use strict';

        $scope.clubs = clubsDict.getTitles();

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

        $scope.changePage = function ( page ) {
            if ( page && page !== $scope.page ) {
                $scope.page = page;
                saveUrlParams();
            }
        };

        var saveUrlParams = function () {
            var period = ( $scope.date === null ) ? $scope.page : $scope.date;
            $location.path( '/races/' + $scope.clubName + '/' + $scope.period + '/' + period );
        };

        var redirectToDefault = function () {

            $scope.page = 1;
            $scope.date = null;
            $scope.period = 'all';

            $scope.clubName = 'pulkovo';
            $scope.clubId = clubsDict.getIdByName( $scope.clubName );
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

        $scope.clubName = $routeParams.club;
        if ( $scope.clubName ) {
            $scope.clubName = $scope.clubName.toLowerCase();
        }

        $scope.selectedClub = clubsDict.getIdByName( $scope.clubName );

        if ( !$scope.selectedClub ) {
            redirectToDefault();
            return;
        }

} ] );
