/*global confirm:true */
angular.module( 'k.directives' ).directive( 'races', [
'getRaces', '$location',
function racesFactory( getRaces, $location ) {

        var link = function ( $scope ) {

            $scope.clubsIds = {};
            for ( var cl in $scope.clubs ) {
                if ( $scope.clubs.hasOwnProperty( cl ) ) {
                    $scope.clubsIds[ $scope.clubs[ cl ] ] = cl;
                }
            }

            $scope.changePage = function ( p ) {
                if ( p !== $scope.page ) {
                    $location.path( '/races/' + $scope.selectedClubs.join( ',' ) + '/' + p );
                }
            };

            var loadData = function () {
                $scope.races = [];

                getRaces( $scope.selectedClubs, $scope.page - 1 )
                    .then( function ( response ) {
                        $scope.races = response.data;

                        var paging = [];
                        var perPage = 10;
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

            $scope.$watch( 'selectedClubs', function ( newVal ) {

                console.log( 111, newVal );

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
                clubs: '=',
                page: '=',
                selectedClubs: '='
            },
            templateUrl: 'races/races'
        };
} ] );
