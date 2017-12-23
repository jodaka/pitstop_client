angular.module('k.directives').directive('live', [
    'clubsDict', '$routeParams', 'ws', 'eventsList',
    function raceFactory (clubsDict, $routeParams, ws, EVENTS) {
        const link = function($scope, $element) {
            const clubId = clubsDict.getIdByName($routeParams.club);
            let subId = null;

            const round = function(val) {
                if (typeof val === 'number') {
                    return val.toFixed(3);
                }
                return 0;
            };

            const remainingHolder = $element.k.querySelector('.k-live__remaining')[0];
            let remainingTimeout = null;
            let remainingTime = null;
            let drivers,
                laps,
                raceid,
                raceLapsData,
                posChanges,
                changesCount;

            var tickRemainingTime = function(time) {
                if (remainingTime > 0) {
                    time = Math.floor(time / 1000);
                    const mins = Math.floor(time / 60);
                    let sec = time - mins * 60;
                    if (sec < 10) {
                        sec = `0${sec}`;
                    }
                    const res = `${mins}:${sec}`;

                    remainingHolder.innerHTML = `Осталось времени: ${res}`;
                    remainingTime -= 1000;

                    if (remainingTimeout) {
                        clearTimeout(remainingTimeout);
                    }

                    remainingTimeout = setTimeout(() => {
                        tickRemainingTime(remainingTime);
                    }, 1000);
                } else {
                    remainingHolder.innerHTML = 'Гонка завершена';
                }
            };


            const resetData = function() {
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

            const processHeat = function(heat) {
                for (const driverId in heat) {
                    if (heat.hasOwnProperty(driverId)) {
                        let driverData = drivers[driverId];
                        const lapNum = driverData && driverData.laps || 0;

                        if (lapNum === 0 || typeof driverData === 'undefined') {
                            drivers[driverId] = heat[driverId];
                            driverData = drivers[driverId];

                            driverData.kartChanges = [{
                                kart: driverData.kart,
                                lap: 0,
                                distance: 0
                            }];

                            driverData.segmentTime = 0;
                            driverData.kart = heat[driverId] && heat[driverId].kart || null;
                            driverData.lapsFinished = 0;
                            driverData.average = Number(driverData.average / 1000).toFixed(3);
                            driverData.p = driverData.position;
                            driverData.startPos = driverData.position;
                        }

                        const time = (typeof heat[driverId] !== 'undefined') ? Number(heat[driverId].time / 1000) : null;
                        // if ( time > 1000) {
                        //     time = time / 1000;
                        // }

                        if (time !== null) {
                            if (lapNum !== heat[driverId].laps) {
                                driverData.lapsFinished++;
                            }

                            driverData.segmentTime += time;
                            driverData.laps = heat[driverId].laps;
                            driverData.best = Number(heat[driverId].best / 1000).toFixed(3);
                            driverData.average = Number(heat[driverId].average / 1000).toFixed(3);

                            if (driverData.kart !== heat[driverId].kart) {
                                const distance = driverData.laps - driverData.kartChanges[driverData.kartChanges.length - 1].lap;

                                driverData.kartChanges.push({
                                    lap: driverData.laps + 1,
                                    distance,
                                    kart: heat[driverId].kart,
                                    perc: distance * 100 / driverData.lapsFinished,
                                    retired: heat[driverId].kart === 0,
                                    average: Number(driverData.segmentTime / distance).toFixed(3)
                                });

                                driverData.segmentTime = 0;

                                if (driverData.kartChanges.length > changesCount) {
                                    changesCount = driverData.kartChanges.length;
                                }

                                driverData.kart = heat[driverId].kart;
                            }

                            if (driverData.p !== heat[driverId].position) {
                                if (typeof posChanges[lapNum + 1] === 'undefined') {
                                    posChanges[lapNum + 1] = {};
                                }
                                posChanges[lapNum + 1][driverId] = (driverData.p > heat[driverId].position) ? `${driverData.p}↑${heat[driverId].position}` : `${driverData.p}↓${heat[driverId].position}`;
                                driverData.p = heat[driverId].position;
                            }

                            driverData.pos = heat[driverId].position;
                            heat[driverId].time = round(time);
                        }

                        if (!laps.hasOwnProperty(lapNum)) {
                            laps[lapNum] = {};
                        }
                        laps[lapNum][driverId] = heat[driverId];
                    }
                }
            };

            const pingAngular = function() {
                $scope.drivers = drivers;
                $scope.driversCount = Object.keys(drivers).length;
                $scope.laps = laps;
                $scope.posChanges = posChanges;

                tickRemainingTime();
                setTimeout(() => {
                    $scope.$digest();
                }, 4);
            };

            const processRaceState = function() {
                for (const lap in raceLapsData) {
                    if (raceLapsData.hasOwnProperty(lap)) {
                        processHeat(raceLapsData[lap]);
                    }
                }
                pingAngular();
            };

            const event_subscribe_club = function() {
                ws.emit(EVENTS.CLUB_SUBSCRIBE, {
                    clubId
                });
            };

            const event_race_state = function(response) {
                if (response !== null) {
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
            const requestRaceState = function() {
                resetData();

                ws.emit(EVENTS.RACE_GET_STATE, {
                    clubId,
                    subId
                });
            };


            const event_subscribe_id = function(response) {
                subId = response;
                requestRaceState();
            };

            const event_heat_data = function(response) {
                if (response !== null && raceid === response.raceId) {
                    const heat = response.heat;

                    const heatDrivers = {};
                    for (let d = 0; d < heat.drivers.length; d++) {
                        const dataPortion = heat.drivers[d];
                        heatDrivers[dataPortion.id] = dataPortion;
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
                    processHeat(heatDrivers);
                    remainingTime = heat.timeLeft;
                    pingAngular();
                }
            };

            var event_no_active_race = function() {
                console.log('RACE FINISHED EVENT !!11');
                console.log('NO ACTIVE RACE');
            };

            resetData();

            $scope.$on('routeChange', () => {
                console.log('unsubscribing', ws);

                ws.off(EVENTS.WS_CONNECTED, event_subscribe_club);
                ws.off(EVENTS.RACE_STATE, event_race_state);
                ws.off(EVENTS.RACE_STARTED, requestRaceState);
                ws.off(EVENTS.RACE_FINISHED, event_no_active_race);
                ws.off(EVENTS.RACE_SUBSCRIBED, event_subscribe_id);
                ws.off(EVENTS.HEAT, event_heat_data);

                ws.disconnect();
            });

            console.log('subscribing', ws);
            ws.on(EVENTS.WS_CONNECTED, event_subscribe_club);
            ws.on(EVENTS.RACE_STATE, event_race_state);
            ws.on(EVENTS.RACE_STARTED, requestRaceState);
            ws.on(EVENTS.RACE_FINISHED, event_no_active_race);
            ws.on(EVENTS.RACE_SUBSCRIBED, event_subscribe_id);
            ws.on(EVENTS.HEAT, event_heat_data);

            ws.connect();
        };


        return {
            restrict: 'E',
            replace: false,
            link,
            scope: {},
            templateUrl: 'partials/live/live.tmpl.html'
        };
    }]);
