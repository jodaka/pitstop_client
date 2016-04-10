angular.module( 'k.directives' ).directive( 'live', [
'clubsDict', '$routeParams', 'ws', 'eventsList',
function raceFactory( clubsDict, $routeParams, ws, EVENTS ) {

        var link = function ( $scope, $element ) {

            var clubId = clubsDict.getIdByName( $routeParams.club );
            var subId = null;

            var round = function ( val ) {
                if ( typeof val === 'number' ) {
                    return val.toFixed( 3 );
                }
                return 0;
            };

            var remainingHolder = $element.k.querySelector( '.k-live__remaining' )[ 0 ];
            var remainingTimeout = null;

            var tickRemainingTime = function ( time ) {

                if ( remainingTime > 0 ) {

                    time = Math.floor( time / 1000 );
                    var mins = Math.floor( time / 60 );
                    var sec = time - mins * 60;
                    if ( sec < 10 ) {
                        sec = '0' + sec;
                    }
                    var res = mins + ':' + sec;

                    remainingHolder.innerHTML = 'Осталось времени: ' + res;
                    remainingTime = remainingTime - 1000;

                    if ( remainingTimeout ) {
                        clearTimeout( remainingTimeout );
                    }

                    remainingTimeout = setTimeout( function () {
                        tickRemainingTime( remainingTime );
                    }, 1000 );
                } else {
                    remainingHolder.innerHTML = 'Гонка завершена';
                }
            };

            var remainingTime, drivers, laps, raceid, raceLapsData, posChanges, changesCount;

            var resetData = function () {

                drivers = {};
                laps = {};
                raceid = null;
                raceLapsData = {};
                posChanges = {
                    0: {}
                };
                changesCount = 0;
                remainingTime = 0;
            };

            var processHeat = function ( heat ) {

                for ( var driverId in heat ) {

                    if ( heat.hasOwnProperty( driverId ) ) {

                        var driverData = drivers[ driverId ];
                        var lapNum = driverData && driverData.laps || 0;

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

                        var time = ( typeof heat[ driverId ] !== 'undefined' ) ? Number( heat[ driverId ].time / 1000 ) : null;
                        // if ( time > 1000) {
                        //     time = time / 1000;
                        // }

                        if ( time !== null ) {

                            if ( lapNum !== heat[ driverId ].laps ) {
                                driverData.lapsFinished++;
                            }

                            driverData.segmentTime += time;
                            driverData.laps = heat[ driverId ].laps;
                            driverData.best = Number( heat[ driverId ].best / 1000 ).toFixed( 3 );
                            driverData.average = Number( heat[ driverId ].average / 1000 ).toFixed( 3 );

                            if ( driverData.kart !== heat[ driverId ].kart ) {

                                var distance = driverData.laps - driverData.kartChanges[ driverData.kartChanges.length - 1 ].lap;

                                driverData.kartChanges.push( {
                                    'lap': driverData.laps + 1,
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

                        if ( !laps.hasOwnProperty( lapNum ) ) {
                            laps[ lapNum ] = {};
                        }
                        laps[ lapNum ][ driverId ] = heat[ driverId ];
                        console.log( 'saving ', lapNum, driverId, 'data', heat[ driverId ] );

                    }
                }

            };

            var pingAngular = function () {
                $scope.drivers = drivers;
                $scope.driversCount = Object.keys( drivers ).length;
                $scope.laps = laps;
                $scope.posChanges = posChanges;

                tickRemainingTime();
                setTimeout( function () {
                    $scope.$digest();
                }, 4 );
                console.log( 1111, $scope.laps );
            };

            var processRaceState = function () {

                for ( var lap in raceLapsData ) {
                    if ( raceLapsData.hasOwnProperty( lap ) ) {
                        processHeat( raceLapsData[ lap ] );
                    }
                }
                pingAngular();
                // $scope.drivers = drivers;
                // $scope.driversCount = Object.keys( drivers ).length;
                // $scope.laps = laps;
                // $scope.posChanges = posChanges;
                //
                // tickRemainingTime();
                // setTimeout( function () {
                //     $scope.$digest();
                // }, 4 );
            };

            var event_subscribe_club = function () {
                ws.emit( EVENTS.CLUB_SUBSCRIBE, {
                    clubId: clubId
                } );
            };

            var event_race_state = function ( response ) {

                if ( response !== null ) {
                    console.log( 111, response );

                    raceid = response.raceid;
                    raceLapsData = response.data;
                    $scope.raceName = response.name;
                    remainingTime = response.timeLeft;

                    processRaceState();

                } else {
                    event_no_active_race();
                }
            };

            /**
             * Upon detecting new race we need to
             * reset data from previous race
             */
            var requestRaceState = function () {

                resetData();

                ws.emit( EVENTS.RACE_GET_STATE, {
                    clubId: clubId,
                    subId: subId
                } );
            };


            var event_subscribe_id = function ( response ) {
                subId = response;
                requestRaceState();
            };

            var event_heat_data = function ( response ) {

                console.log( ' got HEAT', response );

                if ( response !== null && raceid === response.raceId ) {

                    var heat = response.heat;

                    var heatDrivers = {};
                    for ( let d = 0; d < heat.drivers.length; d++ ) {

                        let dataPortion = heat.drivers[ d ];
                        heatDrivers[ dataPortion.id ] = dataPortion;
                    }
                    //
                    //     // drivers[ dataPortion.id ] = {
                    //     //     id: dataPortion.id,
                    //     //     name: dataPortion.name,
                    //     //     best: dataPortion.best,
                    //     //     average: dataPortion.average,
                    //     //     kart: dataPortion.kart,
                    //     //     pos: dataPortion.position
                    //     // };
                    //
                    //     if ( !raceLapsData.hasOwnProperty( dataPortion.laps ) ) {
                    //         raceLapsData[ dataPortion.laps ] = {};
                    //     }
                    //
                    //     raceLapsData[ dataPortion.laps ][ dataPortion.id ] = dataPortion;
                    // }
                    processHeat( heatDrivers );
                    remainingTime = heat.timeLeft;
                    pingAngular();
                }
            };

            var event_no_active_race = function () {
                console.log( 'RACE FINISHED EVENT !!11' );
                console.log( 'NO ACTIVE RACE' );
            };


            resetData();

            $scope.$on( 'routeChange', function () {
                console.log( 'unsubscribing', ws );

                ws.off( EVENTS.WS_CONNECTED, event_subscribe_club );
                ws.off( EVENTS.RACE_STATE, event_race_state );
                ws.off( EVENTS.RACE_STARTED, requestRaceState );
                ws.off( EVENTS.RACE_FINISHED, event_no_active_race );
                ws.off( EVENTS.RACE_SUBSCRIBED, event_subscribe_id );
                ws.off( EVENTS.HEAT, event_heat_data );

                ws.disconnect();
            } );

            console.log( 'subscribing', ws );
            ws.on( EVENTS.WS_CONNECTED, event_subscribe_club );
            ws.on( EVENTS.RACE_STATE, event_race_state );
            ws.on( EVENTS.RACE_STARTED, requestRaceState );
            ws.on( EVENTS.RACE_FINISHED, event_no_active_race );
            ws.on( EVENTS.RACE_SUBSCRIBED, event_subscribe_id );
            ws.on( EVENTS.HEAT, event_heat_data );

            ws.connect();
            // if ( ws.isConnected() ) {
            //     console.log('connected');
            //     event_subscribe_club();
            // }


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
