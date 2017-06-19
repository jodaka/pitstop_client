angular.module('k.directives').directive('races', [
    'getRaces', 'clubsDict', '$filter',
    (getRaces, clubsDict, $filter) => {
        const link = ($scope) => {
            $scope.clubName = clubsDict.getNameById($scope.selectedClubs);

            $scope.setPage = (page) => {
                $scope.changePage({
                    page
                });
            };

            // requesting data again
            const loadData = () => {
                $scope.races = [];
                const period = ($scope.date === null) ? $scope.page - 1 : $scope.date;

                getRaces($scope.selectedClubs, period)
                    .then((response) => {
                        $scope.races = (angular.isArray(response.data)) ? response.data : [response.data];

                        for (let z = 0; z < $scope.races.length; z++) {
                            $scope.races[z].best = $filter('lapTime')($scope.races[z].best);
                        }

                        const paging = [];
                        const perPage = 25;
                        let total = response.total;
                        let i = 1;
                        while (total > perPage) {
                            paging.push(i);
                            i += 1;
                            total -= perPage;
                            if (i > 25) {
                                break;
                            }
                        }

                        $scope.paging = paging;
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            };

            // on club change
            $scope.$watch('selectedClubs', (newVal) => {
                if (newVal) {
                    loadData();
                }
            }, true);
        };

        return {
            restrict: 'E',
            replace: false,
            link,
            scope: {
                date: '=',
                clubs: '=',
                page: '=',
                selectedClubs: '=',
                changePage: '&'
            },
            templateUrl: 'partials/races/races.tmpl.html'
        };
    }]);
