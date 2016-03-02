/*global confirm:true */
angular.module( 'k.directives' ).directive( 'pilot', [
'getPilot', '$location', 'AppConfig',
function racesFactory( getPilot, $location, AppConfig ) {

        var link = function ( $scope ) {

            $scope.clubs = AppConfig.clubs;
            $scope.clubsIds = {};
            for ( var cl in $scope.clubs ) {
                if ( $scope.clubs.hasOwnProperty( cl ) ) {
                    $scope.clubsIds[ $scope.clubs[ cl ] ] = cl;
                }
            }

            $scope.showRace = function ( race ) {
                $location.path( '/race/' + race.id );
            };

            // $scope.changePage = function ( p ) {
            //     if ( p !== $scope.page ) {
            //         $location.path( '/races/' + $scope.selectedClubs.join( ',' ) + '/' + p );
            //     }
            // };

            var loadData = function () {
                $scope.races = [];

                getPilot( $scope.pilotId, $scope.page - 1 )
                    .then( function ( response ) {
                        $scope.races = response.data;

                        console.log( 222333, response );
                        // // fixing timezone
                        // for ( var z = 0; z < $scope.races.length; z++ ) {
                        //     $scope.races[ z ].date = $scope.races[ z ].date.replace( /Z$/, '+0300' );
                        // }

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

            loadData();

        };

        return {
            restrict: 'E',
            replace: false,
            link: link,
            scope: {
                pilotId: '=',
                page: '='
            },
            templateUrl: 'pilot/pilot'
        };
} ] );
