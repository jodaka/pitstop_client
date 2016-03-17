angular.module( 'k.directives' ).directive( 'race', [
'clubsDict', 'getRace',
function raceFactory( clubsDict, getRace ) {

        var link = function ( $scope, $element ) {

            $scope.loading = true;

            var round = function ( val ) {
                if ( typeof val === 'number' ) {
                    return val.toFixed( 3 );
                }
                return 0;
            };

            getRace( $scope.raceId )
                .then( function ( data ) {

                    $scope.clubTitle = clubsDict.getTitleById( data.basic.clubid );
                    $scope.clubName = clubsDict.getNameById( data.basic.clubid );

                    data.basic.best = data.basic.best / 1000;
                    data.basic.dateShort = new Date( data.basic.date ).toISOString().slice( 0, 10 );

                    var kartChanges = {};

                    var labels = new Array( data.laps.length );
                    for ( var i = 0; i < data.laps.length; i++ ) {
                        labels[ i ] = i + 1;
                    }

                    var series = [];
                    var colors = [
                        'rgba(172, 207, 204, 0.8)',
                        'rgba(184, 174, 156, 0.8)',
                        'rgba(255, 255, 255, 0.8)',
                        'rgba(138, 9, 23, 0.8)',
                        'rgba(41, 217, 194, 0.8)',
                        'rgba(255, 255, 166, 0.8)',
                        'rgba(174, 238, 0, 0.8)',
                        'rgba(89, 82, 65, 0.8)',
                        'rgba(255, 53, 139, 0.8)'
                    ];

                    kartChanges[ 0 ] = {};
                    for ( var d in data.drivers ) {

                        if ( data.drivers.hasOwnProperty( d ) ) {

                            kartChanges[ 0 ][ d ] = data.drivers[ d ].kart;
                            var serie = [];
                            data.drivers[ d ].average = data.drivers[ d ].average.toFixed( 3 );

                            for ( i = 0; i < data.laps.length; i++ ) {
                                var value = ( typeof data.laps[ i ][ d ] !== 'undefined' ) ? data.laps[ i ][ d ].t : null;

                                if ( value !== null ) {
                                    data.laps[ i ][ d ].t = round( value );

                                    if ( data.laps[ i ][ d ].k !== data.drivers[ d ].kart ) {

                                        if ( typeof kartChanges[ i ] === 'undefined') {
                                            kartChanges[ i ] = {};
                                        }
                                        kartChanges[ i ][ d ] = data.drivers[ d ].kart + '→' + data.laps[ i ][ d ].k;
                                        data.drivers[ d ].kart = data.laps[ i ][ d ].k;
                                    }

                                    // pos
                                    data.drivers[ d ].pos = data.laps[ i ][ d ].p;
                                }
                                serie.push( value );
                            }

                            series.push( {
                                fill: true,
                                tension: 0.25,
                                borderColor: colors[ series.length ],
                                label: data.drivers[ d ].name,
                                data: serie
                            } );
                        }
                    }

                    $scope.kartChanges = kartChanges;
                    $scope.race = data;
                    $scope.driversCount = Object.keys( data.drivers ).length;
                    $scope.changesCount = Object.keys( kartChanges ).length;
                    
                    /*global Chart */
                    var ctx = $element[ 0 ].querySelector( '.k-race-chart' ).getContext( '2d' );

                    var myChart = new Chart( ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: series
                        }
                    } );
                    $scope.loading = false;
                } )
                .catch( function () {
                    $scope.fail = true;
                } );

        };

        return {
            restrict: 'E',
            replace: false,
            link: link,
            scope: {
                raceId: '='
            },
            templateUrl: 'race/race'
        };
} ] );
