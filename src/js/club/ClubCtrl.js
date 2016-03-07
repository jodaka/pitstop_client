angular.module( 'k.controllers' ).controller( 'ClubCtrl', [
'$scope', '$routeParams', 
function ClubCtrlFactory( $scope, $routeParams ) {

        $scope.clubId = Number( $routeParams.id );
        $scope.period = $routeParams.period;

        // checking pilot id
        if ( isNaN( $scope.clubId ) || !Number.isInteger( $scope.clubId ) ) {
            // $location.path( '/races/' );
            return;
        }

} ] );
