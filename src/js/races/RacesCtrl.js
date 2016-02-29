angular.module( 'k.controllers' ).controller( 'RacesCtrl', [
'$scope', '$routeParams', '$location',
function RaceCtrlFactory( $scope, $routeParams, $location ) {
        'use strict';

        $scope.clubs = {
            'Пулково': '586',
            'Драйв': '686',
            'Нарвская': '786'
        };

        $scope.selectedClubs = [ '586', '686', '786' ];
        $scope.page = $routeParams.page || 1;
        $scope.selectedClubs = $routeParams.clubs;

        var saveUrlParams = function () {
            $location.path( '/races/' + $scope.selectedClubs.join( ',' ) + '/' + $scope.page );
        };

        var redirectToDefault = function() {
            $scope.page = 1;
            $scope.selectedClubs = [ '586', '686', '786' ];
            saveUrlParams();
        };

        // checking page
        if ( typeof $scope.page !== 'number') {
            redirectToDefault();
            return;
        }

        // checking clubs list
        if ( !$scope.selectedClubs || !/^(\d+,?)+$/.test( $scope.selectedClubs ) ) {
            redirectToDefault();
            return;

        } else {
            $scope.selectedClubs = $scope.selectedClubs.split( ',' );
        }


        $scope.selectClub = function ( id ) {
            var idx = $scope.selectedClubs.indexOf( id );
            if ( idx > -1 ) {
                $scope.selectedClubs.splice( idx, 1 );
            } else {
                $scope.selectedClubs.push( id );
            }
            saveUrlParams();
        };

} ] );
