class Races {
    constructor (getRaces, clubsDict, $filter, $scope) {
        this.$filter = $filter;
        this.getRaces = getRaces;

        console.log(12345, this);
        // on club change
        $scope.$watch('$ctrl.selectedClub', (newVal) => {
            if (newVal) {
                this.loadData();
            }
        });
    }

    setPage (page) {
        this.changePage({
            page
        });
    }

    // requesting data again
    loadData () {
        this.races = [];
        const period = (this.date === null) ? this.page - 1 : this.date;

        this.getRaces(this.selectedClub, period)
            .then((response) => {
                this.races = (angular.isArray(response.data)) ? response.data : [response.data];

                for (let z = 0; z < this.races.length; z++) {
                    this.races[z].best = this.$filter('lapTime')(this.races[z].best);
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

                this.paging = paging;
            })
            .catch((err) => {
                console.error(err);
            });
    }
}

angular.module('k.components').component('races', {
    bindings: {
        date: '<',
        page: '<',
        selectedClub: '<',
        changePage: '&'
    },
    templateUrl: 'partials/races/races.tmpl.html',
    controller: ['getRaces', 'clubsDict', '$filter', '$scope', Races]
});

