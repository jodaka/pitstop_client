angular.module('k.directives').directive('race', [
    'clubsDict', 'getRace', '$filter',
    (clubsDict, getRace, $filter) => {
        const link = function($scope) {
            $scope.loading = true;

            getRace($scope.raceId)
                .then((data) => {
                    $scope.clubTitle = clubsDict.getTitleById(data.basic.clubid);
                    $scope.clubName = clubsDict.getNameById(data.basic.clubid);
                    data.basic.dateShort = new Date(data.basic.date).toISOString().slice(0, 10);

                    const posChanges = {};
                    posChanges[0] = {};
                    let changesCount = 0;
                    const len = data.laps.length;

                    for (let lapCounter = 0; lapCounter < len; lapCounter++) {
                        const lapData = data.laps[lapCounter];
                        const lapNum = lapData.num;

                        for (const driverId in data.drivers) {
                            if (data.drivers.hasOwnProperty(driverId)) {
                                const driverData = data.drivers[driverId];

                                if (lapCounter === 0) {
                                    driverData.average = driverData.average.toFixed(3);

                                    driverData.kartChanges = [{
                                        kart: driverData.kart,
                                        lap: 0,
                                        distance: 0
                                    }];

                                    driverData.segmentTime = 0;
                                    driverData.kart = lapData[driverId] && lapData[driverId].k || null;
                                    driverData.lapsFinished = 0;

                                    // posChanges[ lapCounter ][ driverId ] = lapData[ driverId ].p;
                                    driverData.p = driverData.startPos;
                                }

                                const time = (typeof lapData[driverId] !== 'undefined') ? lapData[driverId].t : null;

                                if (time !== null) {
                                    driverData.lapsFinished += 1;
                                    driverData.segmentTime += time;

                                    if (driverData.kart !== lapData[driverId].k) {
                                        const distance = lapNum - driverData.kartChanges[driverData.kartChanges.length - 1].lap;

                                        driverData.kartChanges.push({
                                            lap: lapNum + 1,
                                            distance,
                                            kart: lapData[driverId].k,
                                            perc: distance * 100 / len,
                                            retired: lapData[driverId].k === 0,
                                            avg: Number(driverData.segmentTime / distance).toFixed(3)
                                        });

                                        driverData.segmentTime = 0;

                                        if (driverData.kartChanges.length > changesCount) {
                                            changesCount = driverData.kartChanges.length;
                                        }

                                        driverData.kart = lapData[driverId].k;
                                    }

                                    if (driverData.p !== lapData[driverId].p) {
                                        if (typeof posChanges[lapNum + 1] === 'undefined') {
                                            posChanges[lapNum + 1] = {};
                                        }
                                        posChanges[lapNum + 1][driverId] = (driverData.p > lapData[driverId].p) ? `${driverData.p}↑${lapData[driverId].p}` : `${driverData.p}↓${lapData[driverId].p}`;
                                        driverData.p = lapData[driverId].p;
                                    }

                                    driverData.pos = lapData[driverId].p;

                                    lapData[driverId].t = $filter('lapTime')(parseFloat(time) * 1000);
                                }
                            }
                        }
                    }

                    const totalDrivers = [];

                    Object.keys(data.drivers).forEach((driverId) => {
                        const driverData = data.drivers[driverId];

                        totalDrivers.push({
                            pos: driverData.pos,
                            best: $filter('lapTime')(driverData.best * 1000),
                            average: $filter('lapTime')(driverData.average * 1000),
                            lapsFinished: driverData.lapsFinished,
                            kart: driverData.kart,
                            name: driverData.name
                        });

                        const prevSegment = driverData.kartChanges[driverData.kartChanges.length - 1];

                        if (!prevSegment.retired) {
                            const distance = driverData.lapsFinished - prevSegment.lap;

                            driverData.kartChanges.push({
                                distance,
                                kart: '🏁',
                                lap: driverData.lapsFinished,
                                perc: distance * 100 / len,
                                avg: Number(driverData.segmentTime / distance).toFixed(3)

                            });
                        } else {
                            prevSegment.kart = '🏁';
                        }
                    });

                    $scope.overallInfo = totalDrivers.sort((a, b) => a.pos - b.pos);
                    $scope.posChanges = posChanges;

                    $scope.race = data;
                    $scope.driversCount = Object.keys(data.drivers).length;
                    $scope.changesCount = changesCount;

                    $scope.loading = false;
                })
                .catch(() => {
                    $scope.fail = true;
                });
        };

        return {
            restrict: 'E',
            replace: false,
            link,
            scope: {
                raceId: '='
            },
            templateUrl: 'partials/race/race.tmpl.html'
        };
    }]);
