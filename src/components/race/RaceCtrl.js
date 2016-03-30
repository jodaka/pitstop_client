angular.module( 'k.controllers' ).controller( 'RaceCtrl', [
'$scope', '$routeParams',
function RaceCtrlFactory( $scope, $routeParams ) {
        $scope.raceId = $routeParams.id;
} ] );
