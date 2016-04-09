angular.module( 'k.directives' ).directive( 'pilot', [
'clubsDict', 'getPilot',
function racesFactory( clubsDict, getPilot ) {

        var link = function ( $scope ) {

            $scope.changePage = function ( page ) {
                if ( page && page !== $scope.page ) {
                    $scope.page = page;
                    console.log( 'page set ', page );
                    loadData();
                }
            };

            var clubs = clubsDict.getNames();
            console.log( 222, clubs );

            var loadData = function () {
                $scope.races = [];

                getPilot( $scope.pilotId, $scope.page - 1 )
                    .then( function ( response ) {

                        console.log( 11111, response );

                        $scope.races = response.races;
                        $scope.clubStats = {};
                        $scope.name = response.name;

                        for ( var cl in response.clubs ) {
                            $scope.clubStats[ clubsDict.getTitleById( cl ) ] = {
                                count: response.clubs[ cl ].count,
                                best: ( Number( response.clubs[ cl ].best ) / 1000 ).toFixed( 3 )
                            };
                        }

                        // fixing timezone
                        for ( var z = 0; z < $scope.races.length; z++ ) {
                            $scope.races[ z ].best = ( $scope.races[ z ].best / 1000 ).toFixed( 3 );
                            $scope.races[ z ].average = ( $scope.races[ z ].average / 1000 ).toFixed( 3 );
                            $scope.races[ z ].clubName = clubsDict.getNameById( $scope.races[ z ].clubid );
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
                        setTimeout( function () {
                            $scope.$apply()
                        }, 4 );
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
