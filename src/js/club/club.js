angular.module( 'k.directives' ).directive( 'club', [
'AppConfig', 'getClub',
function clubFactory( AppConfig, getClub ) {

        var link = function ( $scope ) {

            $scope.loading = true;

            var loadData = function () {

                $scope.loading = true;

                getClub( $scope.clubId, $scope.period )
                    .then( function ( data ) {

                        for ( var z = 0; z < data.length; z++ ) {
                            data[ z ].best = ( data[ z ].best / 1000 ).toFixed( 3 );
                        }

                        $scope.loading = false;
                        $scope.karts = data;
                    } )
                    .catch( function ( err ) {
                        $scope.loading = false;
                        console.error( err );
                    } );
            };

            loadData();
        };

        return {
            restrict: 'E',
            replace: false,
            link: link,
            scope: {
                clubId: '=',
                period: '='
            },
            templateUrl: 'club/club'
        };
} ] );
