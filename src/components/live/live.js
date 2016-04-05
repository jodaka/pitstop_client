angular.module( 'k.directives' ).directive( 'live', [
'clubsDict', '$routeParams', 'ws', 'eventsList',
function raceFactory( clubsDict, $routeParams, ws, EVENTS ) {

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

        var event_connect = function () {
            ws.emit( EVENTS.CLUB_SUBSCRIBE, {
                clubId: clubId
            });
        };

        var event_race_state = function ( response ) {
            processRaceState( response );
        };

        var event_subscribe_id = function ( response ) {

            subId = response;

            ws.emit( EVENTS.RACE_GET_STATE, {
                clubId: clubId,
                subId: subId
            });
        };

        var event_heat_data = function ( response ) {

            console.log( ' got HEAT', response );

            if ( raceid === response.raceId ) {

                console.log( 'got our heat ' );

                var lapNum = Number( response.heat[ Object.keys( response.heat )[ 0 ] ].laps );
                console.log( 'wow got heat', response, ' current race', raceid, 'lap ', lapNum );

                processHeat( response.heat, lapNum );
                
                setTimeout( function () {
                    $scope.$digest();
                }, 0 );
            }
        };

        ws.on( EVENTS.WS_CONNECTED, event_connect );
        ws.on( EVENTS.RACE_STATE, event_race_state );
        ws.on( EVENTS.RACE_SUBSCRIBED, event_subscribe_id );
        ws.on( EVENTS.HEAT, event_heat_data );

        if (ws.isConnected()) {
            event_connect();
        }

        // TODO on destroy unsubscribe from all WS events
    };


    return {
        restrict: 'E',
        replace: false,
        link: link,
        scope: {},
        templateUrl: 'partials/live/live.tmpl.html'
    };

} ] );
