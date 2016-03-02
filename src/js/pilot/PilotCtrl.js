angular.module( 'k.controllers' ).controller( 'PilotCtrl', [
'$scope', '$routeParams', '$location',
function PilotCtrlFactory( $scope, $routeParams, $location ) {
        'use strict';

        $scope.pilotId = Number( $routeParams.id );
        $scope.page = $routeParams.page;

        // var saveUrlParams = function () {
        //     console.log( '--->', '/races/' + $scope.selectedClubs.join( ',' ) + '/' + $scope.page );
        //     $location.path( '/races/' + $scope.selectedClubs.join( ',' ) + '/' + $scope.page );
        // };
        // checking page
        if ( isNaN( $scope.page ) || !Number.isInteger( $scope.page ) ) {
            $scope.page = 1;
        }

        // checking pilot id
        if ( isNaN( $scope.pilotId ) || !Number.isInteger( $scope.pilotId ) ) {
            $location.path( '/races/' );
            return;
        }

} ] );
