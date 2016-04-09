angular.module( 'k.directives' ).directive( 'club', [
'clubsDict', 'getClub',
function clubFactory( clubsDict, getClub ) {

        var link = function ( $scope ) {

            $scope.loading = true;
            $scope.clubName = clubsDict.getNameById( $scope.clubId );

            var loadData = function () {

                $scope.loading = true;

                getClub( $scope.clubId, $scope.period )
                    .then( function ( data ) {

                        for ( var z = 0; z < data.pilots.length; z++ ) {
                            data.pilots[ z ].best = ( data.pilots[ z ].best / 1000 ).toFixed( 3 );
                        }

                        for ( z = 0; z < data.karts.length; z++ ) {
                            data.karts[ z ].best = ( data.karts[ z ].best / 1000 ).toFixed( 3 );
                        }

                        $scope.karts = data.karts;
                        $scope.pilots = data.pilots;
                        $scope.loading = false;
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
            templateUrl: 'partials/club/club.tmpl.html'
        };
} ] );
