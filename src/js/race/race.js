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

                    // var series = [];
                    // var colors = [
                    //     'rgba(172, 207, 204, 0.8)',
                    //     'rgba(184, 174, 156, 0.8)',
                    //     'rgba(255, 255, 255, 0.8)',
                    //     'rgba(138, 9, 23, 0.8)',
                    //     'rgba(41, 217, 194, 0.8)',
                    //     'rgba(255, 255, 166, 0.8)',
                    //     'rgba(174, 238, 0, 0.8)',
                    //     'rgba(89, 82, 65, 0.8)',
                    //     'rgba(255, 53, 139, 0.8)'
                    // ];

                    var kartChanges = {};
                    var posChanges = {};
                    kartChanges[ 0 ] = {};
                    posChanges[ 0 ] = {};

                    // var labels = new Array( data.laps.length );
                    for ( var lapCounter = 0, len = data.laps.length; lapCounter < len; lapCounter++ ) {

                        // labels[ lapCounter ] = lapCounter + 1;
                        var lapData = data.laps[ lapCounter ];
                        var lapNum = lapData.num;

                        for ( var driverId in data.drivers ) {
                            if ( data.drivers.hasOwnProperty( driverId ) ) {

                                var driverData = data.drivers[ driverId ];

                                if ( lapCounter === 0 ) {
                                    driverData.average = driverData.average.toFixed( 3 );
                                    kartChanges[ 0 ][ driverId ] = driverData.kart;
                                    driverData.kart = lapData[ driverId ] && lapData[ driverId ].k || null;
                                    driverData.kartChanges = 0;
                                    driverData.lapsFinished = 0;

                                    // posChanges[ lapCounter ][ driverId ] = lapData[ driverId ].p;
                                    driverData.p = driverData.startPos;
                                }

                                var time = ( typeof lapData[ driverId ] !== 'undefined' ) ? lapData[ driverId ].t : null;

                                if ( time !== null ) {

                                    driverData.lapsFinished++;

                                    if ( driverData.kart !== lapData[ driverId ].k ) {

                                        if ( typeof kartChanges[ lapNum + 1 ] === 'undefined' ) {
                                            kartChanges[ lapNum + 1 ] = {};
                                        }

                                        kartChanges[ lapNum + 1 ][ driverId ] = driverData.kart + '→' + lapData[ driverId ].k;
                                        driverData.kart = lapData[ driverId ].k;

                                        driverData.kartChanges++;
                                    }

                                    if ( driverData.p !== lapData[ driverId ].p ) {
                                        if ( typeof posChanges[ lapNum + 1 ] === 'undefined' ) {
                                            posChanges[ lapNum + 1 ] = {};
                                        }
                                        posChanges[ lapNum + 1 ][ driverId ] = ( driverData.p > lapData[ driverId ].p ) ? driverData.p + '↑' + lapData[ driverId ].p : driverData.p + '↓' + lapData[ driverId ].p;
                                        driverData.p = lapData[ driverId ].p;
                                    }

                                    driverData.pos = lapData[ driverId ].p;
                                    lapData[ driverId ].t = round( time );
                                } else {
                                    // serie.push( value );
                                }
                            }
                        }
                    }

                    $scope.posChanges = posChanges;
                    $scope.startKarts = kartChanges[ 0 ];
                    delete kartChanges[ 0 ];
                    $scope.kartChanges = kartChanges;

                    $scope.race = data;
                    $scope.driversCount = Object.keys( data.drivers ).length;
                    $scope.changesCount = Object.keys( kartChanges ).length;

                    // var ctx = $element[ 0 ].querySelector( '.k-race-chart' ).getContext( '2d' );
                    //
                    // var myChart = new Chart( ctx, {
                    //     type: 'line',
                    //     data: {
                    //         labels: labels,
                    //         datasets: series
                    //     }
                    // } );
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
            templateUrl: 'partials/race/race.tmpl.html'
        };
} ] );
