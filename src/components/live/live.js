angular.module( 'k.directives' ).directive( 'live', [
'clubsDict', 'getRace',
function raceFactory( clubsDict, getRace ) {

        var link = function ( $scope ) {

            $scope.loading = true;

            var parseEvent = function( evt ) {

                if (!evt || !evt.data) {
                    return null;
                }

                try {

                    var data = JSON.parse( evt.data );
                    if ( typeof data.eventer !== 'undefined') {

                        return {
                            'type': data.eventer[0],
                            'data': data.eventer[1]
                        };
                    }

                } catch(e) {
                    console.error(e);
                }

                return null;
            };

            var ws = new WebSocket( 'ws://localhost:8882' );
            ws.onopen = function () {
                ws.send('RACE_STATE');
            };

            ws.onmessage = function ( evt ) {

                var e = parseEvent( evt.data );
                if ( e === null ) {
                    console.warn( 'Got null event', evt );
                    return;
                }

                switch( e.type ) {
                    case 'event-race-state':
                        console.log('wow, got race state!', e.data );
                        break;
                    case 'event-heat-data':
                        console.log('wow got heat', e.data );
                        break;

                    default:
                        console.warn('got unknown event', e );
                }

            };

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

                    var posChanges = {};
                    posChanges[ 0 ] = {};
                    var changesCount = 0;

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

                                    driverData.kartChanges = [ {
                                        'kart': driverData.kart,
                                        'lap': 0,
                                        'distance': 0
                                    } ];

                                    driverData.segmentTime = 0;
                                    driverData.kart = lapData[ driverId ] && lapData[ driverId ].k || null;
                                    driverData.lapsFinished = 0;

                                    // posChanges[ lapCounter ][ driverId ] = lapData[ driverId ].p;
                                    driverData.p = driverData.startPos;
                                }

                                var time = ( typeof lapData[ driverId ] !== 'undefined' ) ? lapData[ driverId ].t : null;

                                if ( time !== null ) {

                                    driverData.lapsFinished++;
                                    driverData.segmentTime += time;

                                    if ( driverData.kart !== lapData[ driverId ].k ) {
                                        // if ( typeof kartChanges[ lapNum + 1 ] === 'undefined' ) {
                                        //     kartChanges[ lapNum + 1 ] = {};
                                        // }
                                        //
                                        var distance = lapNum - driverData.kartChanges[ driverData.kartChanges.length - 1 ].lap;

                                        driverData.kartChanges.push( {
                                            'lap': lapNum + 1,
                                            'distance': distance,
                                            'kart': lapData[ driverId ].k,
                                            'perc': distance * 100 / len,
                                            'retired': lapData[ driverId ].k === 0,
                                            'avg': Number( driverData.segmentTime / distance ).toFixed( 3 )
                                        } );

                                        driverData.segmentTime = 0;

                                        if ( driverData.kartChanges.length > changesCount ) {
                                            changesCount = driverData.kartChanges.length;
                                        }

                                        // kartChanges[ lapNum + 1 ][ driverId ] = driverData.kart + '→' + lapData[ driverId ].k;
                                        driverData.kart = lapData[ driverId ].k;
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

                    // last segment
                    for ( driverId in data.drivers ) {
                        if ( data.drivers.hasOwnProperty( driverId ) ) {

                            driverData = data.drivers[ driverId ];
                            driverData.best = round( driverData.best );

                            var prevSegment = driverData.kartChanges[ driverData.kartChanges.length - 1 ];

                            if ( !prevSegment.retired ) {

                                distance = driverData.lapsFinished - prevSegment.lap;

                                driverData.kartChanges.push( {
                                    'distance': distance,
                                    'kart': '🏁',
                                    'lap': driverData.lapsFinished,
                                    'perc': distance * 100 / len,
                                    'avg': Number( driverData.segmentTime / distance ).toFixed( 3 )

                                } );
                            } else {
                                prevSegment.kart = '🏁';
                            }
                        }
                    }

                    $scope.posChanges = posChanges;
                    $scope.race = data;
                    $scope.driversCount = Object.keys( data.drivers ).length;
                    $scope.changesCount = changesCount;

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
            templateUrl: 'partials/live/live.tmpl.html'
        };
} ] );
