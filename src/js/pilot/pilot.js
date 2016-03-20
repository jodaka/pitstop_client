angular.module( 'k.directives' ).directive( 'pilot', [
'AppConfig', 'getPilot',
function racesFactory( AppConfig, getPilot ) {

        var link = function ( $scope ) {

            $scope.clubs = AppConfig.clubs;
            $scope.clubsIds = {};
            for ( var cl in $scope.clubs ) {
                if ( $scope.clubs.hasOwnProperty( cl ) ) {
                    $scope.clubsIds[ $scope.clubs[ cl ] ] = cl;
                }
            }

            var loadData = function () {
                $scope.races = [];

                getPilot( $scope.pilotId, $scope.page - 1 )
                    .then( function ( response ) {
                        $scope.races = response.races;
                        $scope.clubStats = {};
                        $scope.name = response.name;

                        for ( var cl in $scope.clubsIds ) {
                            if ( $scope.clubsIds.hasOwnProperty( cl ) ) {
                                if ( response.clubs.hasOwnProperty( cl ) ) {
                                    $scope.clubStats[ cl ] = response.clubs[ cl ];
                                    $scope.clubStats[ cl ].best = ( Number( response.clubs[ cl ].best ) / 1000 ).toFixed( 3 );
                                } else {
                                    $scope.clubStats[ cl ] = {
                                        count: 0,
                                        best: 0
                                    };
                                }
                            }
                        }

                        // fixing timezone
                        for ( var z = 0; z < $scope.races.length; z++ ) {
                            $scope.races[ z ].date = $scope.races[ z ].date.replace( /Z$/, '+0300' );
                            $scope.races[ z ].best = ( $scope.races[ z ].best / 1000 ).toFixed( 3 );
                            $scope.races[ z ].average = ( $scope.races[ z ].average / 1000 ).toFixed( 3 );
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
            templateUrl: 'partials/pilot/pilot.tmpl.html'
        };
} ] );
