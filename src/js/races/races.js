angular.module( 'k.directives' ).directive( 'races', [
'getRaces',
function racesFactory( getRaces ) {

        var link = function ( $scope ) {

            $scope.clubsIds = {};
            for ( var cl in $scope.clubs ) {
                if ( $scope.clubs.hasOwnProperty( cl ) ) {
                    $scope.clubsIds[ $scope.clubs[ cl ] ] = cl;
                }
            }

            $scope.setPage = function ( page ) {
                $scope.changePage( {
                    page: page
                } );
            };

            // requesting data again
            var loadData = function () {

                $scope.races = [];
                var period = ( $scope.date === null ) ? $scope.page -1 : $scope.date;

                getRaces( $scope.selectedClubs, period )
                    .then( function ( response ) {

                        $scope.races = ( angular.isArray( response.data ) ) ? response.data : [ response.data ];

                        // fixing timezone
                        for ( var z = 0; z < $scope.races.length; z++ ) {
                            $scope.races[ z ].best = ( $scope.races[ z ].best / 1000 ).toFixed( 3 );
                        }

                        var paging = [];
                        var perPage = 25;
                        var total = response.total;
                        var i = 1;
                        while ( total > perPage ) {
                            paging.push( i );
                            i++;
                            total -= perPage;
                            if ( i > 10 ) {
                                break;
                            }
                        }

                        $scope.paging = paging;
                    } )
                    .catch( function ( err ) {
                        console.error( err );
                    } );
            };

            // on club change
            $scope.$watch( 'selectedClubs', function ( newVal ) {
                if ( newVal ) {
                    loadData();
                }
            }, true );
        };

        return {
            restrict: 'E',
            replace: false,
            link: link,
            scope: {
                date: '=',
                clubs: '=',
                page: '=',
                selectedClubs: '=',
                changePage: '&'
            },
            templateUrl: 'races/races'
        };
} ] );
