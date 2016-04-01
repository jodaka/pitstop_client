angular.module( 'k.controllers' ).controller( 'LiveCtrl', [
'$scope', '$routeParams',
function LiveCtrlFactory( $scope, $routeParams ) {
        $scope.raceId = $routeParams.id;
} ] );
