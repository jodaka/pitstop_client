angular.module( 'k.controllers' ).controller( 'RacesCtrl', [
'$scope', '$routeParams',
function RaceCtrlFactory( $scope, $routeParams ) {
        'use strict';

        $scope.clubs = {
            'Пулково': '586',
            'Драйв': '686',
            'Нарвская': '786'
        };

        $scope.selectedClubs = [ '586', '686', '786' ];
        $scope.page = $routeParams.page || 1;

        $scope.selectClub = function ( id ) {
            var idx = $scope.selectedClubs.indexOf( id );
            if ( idx > -1 ) {
                $scope.selectedClubs.splice( idx, 1 );
            } else {
                $scope.selectedClubs.push( id );
            }
        };

} ] );
