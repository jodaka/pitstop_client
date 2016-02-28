angular.module( 'k.controllers' ).controller( 'RaceCtrl', [
'$scope', '$routeParams',
function RaceCtrlFactory( $scope, $routeParams ) {
        'use strict';

        $scope.raceId = $routeParams.id;

        /**
         * When user changes language, we would reset locations
         */
        // $scope.$on( 'languageChange', function ( evt, lang ) {
        //     $bookingData.save( {
        //         'type': $scope.booking.type,
        //         'arrival': {},
        //         'departure': {},
        //         'date': $scope.booking.date
        //     } );
        // } );

} ] );
