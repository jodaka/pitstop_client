angular.module( 'k.directives' ).directive( 'live', [
'clubsDict', '$routeParams',
function raceFactory( clubsDict, $routeParams ) {

        var link = function ( $scope ) {

            var clubId = clubsDict.getIdByName( $routeParams.club );
            var subId = null;


            var round = function ( val ) {
                if ( typeof val === 'number' ) {
                    return val.toFixed( 3 );
                }
                return 0;
            };

            var drivers = {};
            var laps = {};
            var raceid = null;

            var posChanges = {
                0: {}
            };
            var changesCount = 0;

            var processHeat = function ( heat, lapNum ) {

                for ( var driverId in heat ) {

                    if ( heat.hasOwnProperty( driverId ) ) {

                        var driverData = drivers[ driverId ];

                        if ( lapNum === 0 || typeof driverData === 'undefined' ) {

                            drivers[ driverId ] = heat[ driverId ];
                            driverData = drivers[ driverId ];

                            driverData.kartChanges = [ {
                                'kart': driverData.kart,
                                'lap': 0,
                                'distance': 0
                            } ];

                            driverData.segmentTime = 0;
                            driverData.kart = heat[ driverId ] && heat[ driverId ].kart || null;
                            driverData.lapsFinished = 0;
                            driverData.average = Number( driverData.average / 1000 ).toFixed( 3 );
                            driverData.p = driverData.position;
                            driverData.startPos = driverData.position;
                        }

                        var time = ( typeof heat[ driverId ] !== 'undefined' ) ? Number( heat[ driverId ].time ) / 1000 : null;

                        if ( time !== null ) {

                            if ( driverData.laps !== heat[ driverId ].laps ) {
                                driverData.lapsFinished++;
                            }

                            driverData.segmentTime += time;
                            driverData.laps = heat[ driverId ].laps;
                            driverData.best = Number( heat[ driverId ].best / 1000 ).toFixed( 3 );
                            driverData.average = Number( heat[ driverId ].average / 1000 ).toFixed( 3 );

                            if ( driverData.kart !== heat[ driverId ].kart ) {

                                var distance = lapNum - driverData.kartChanges[ driverData.kartChanges.length - 1 ].lap;

                                driverData.kartChanges.push( {
                                    'lap': lapNum + 1,
                                    'distance': distance,
                                    'kart': heat[ driverId ].kart,
                                    'perc': distance * 100 / driverData.lapsFinished,
                                    'retired': heat[ driverId ].kart === 0,
                                    'average': Number( driverData.segmentTime / distance ).toFixed( 3 )
                                } );

                                driverData.segmentTime = 0;

                                if ( driverData.kartChanges.length > changesCount ) {
                                    changesCount = driverData.kartChanges.length;
                                }

                                driverData.kart = heat[ driverId ].kart;
                            }

                            if ( driverData.p !== heat[ driverId ].position ) {
                                if ( typeof posChanges[ lapNum + 1 ] === 'undefined' ) {
                                    posChanges[ lapNum + 1 ] = {};
                                }
                                posChanges[ lapNum + 1 ][ driverId ] = ( driverData.p > heat[ driverId ].position ) ? driverData.p + '↑' + heat[ driverId ].position : driverData.p + '↓' + heat[ driverId ].position;
                                driverData.p = heat[ driverId ].position;
                            }

                            driverData.pos = heat[ driverId ].position;
                            heat[ driverId ].time = round( time );

                        }
                    }
                }

                if ( lapNum > 0 ) {
                    laps[ lapNum ] = heat;
                }
            };

            var processRaceState = function ( raceData ) {

                raceid = raceData.raceid;
                var rawData = raceData.laps;

                for ( var lap in rawData ) {
                    if ( rawData.hasOwnProperty( lap ) ) {
                        processHeat( rawData[ lap ], Number( lap ) );
                    }
                }

                $scope.drivers = drivers;
                $scope.driversCount = Object.keys( drivers ).length;
                $scope.laps = laps;
                $scope.posChanges = posChanges;

                setTimeout( function () {
                    $scope.$digest();
                } );
            };

            var parseEvent = function ( evt ) {

                if ( !evt || !evt.data ) {
                    return null;
                }

                try {

                    var data = JSON.parse( evt.data );
                    return {
                        'type': data[ 0 ],
                        'data': data[ 1 ]
                    };

                } catch ( e ) {
                    console.error( e );
                }

                return null;
            };

            var ws = new WebSocket( 'ws://localhost:8882' );

            ws.onopen = function () {

                ws.send( JSON.stringify( {
                    event: 'event-subscribe',
                    clubId: clubId
                } ) );
                console.log( 'sent subscribe event ' );

            };

            ws.onmessage = function ( evt ) {


                var e = parseEvent( evt );
                if ( e === null ) {
                    console.warn( 'Got null event', evt );
                    return;
                }

                switch ( e.type ) {

                    case 'event-race-state':
                        console.log( 'wow, got race state!', e.data );
                        processRaceState( e.data );
                        break;

                    case 'event-subscribe-id':
                        console.log( ' got subscription ID', e.data );

                        subId = e.data;

                        ws.send( JSON.stringify( {
                            event: 'event-get-race-state',
                            clubId: clubId,
                            subId: subId
                        } ) );

                        console.log( 'race-state-requested' );

                        break;

                    case 'event-heat-data':

                        if ( raceid === e.data.raceId ) {

                            console.log('got heat ', e.data );

                            var lapNum = Number( e.data.heat[ Object.keys( e.data.heat )[ 0 ] ].laps );
                            console.log( 'wow got heat', e.data, ' current race', raceid, 'lap ', lapNum );

                            processHeat( e.data.heat, lapNum );
                            setTimeout( function () {
                                $scope.$digest();
                            }, 0 );
                        }

                        break;

                    default:
                        console.warn( 'got unknown event', e );
                }
            };
        };

        return {
            restrict: 'E',
            replace: false,
            link: link,
            scope: {},
            templateUrl: 'partials/live/live.tmpl.html'
        };
} ] );
