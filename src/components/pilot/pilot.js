class PilotDetails {
    constructor (clubsDict, $stateParams, $state, $scope, getPilot) {
        this.clubsDict = clubsDict;
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.$scope = $scope;
        this.getPilot = getPilot;

        this.pilotId = Number($stateParams.pilotId);
        this.page = Number($stateParams.page);

        // checking page
        if (isNaN(this.page) || !Number.isInteger(this.page)) {
            this.page = 1;
        }

        console.log(123, this.page);


        // checking pilot id
        if (isNaN(this.pilotId) || !Number.isInteger(this.pilotId)) {
            $state.go('/');
            return;
        }

        this.loadData();
    }

    changePage (pageObject) {
        const page = pageObject.page ? pageObject.page : pageObject;

        if (page && page !== this.page) {
            this.$state.go('app.pilot', {
                pilotId: this.pilotId,
                page
            });
        }
    }

    processPilotData (response) {
        this.races = response.races;
        this.clubStats = {};
        this.name = response.name;

        Object.keys(response.clubs).forEach((clubId) => {
            console.log(1, clubId);
            this.clubStats[this.clubsDict.getTitleById(clubId)] = {
                count: response.clubs[clubId].count,
                best: (Number(response.clubs[clubId].best) / 1000).toFixed(3)
            };
        });

        // fixing timezone
        for (let z = 0; z < this.races.length; z++) {
            this.races[z].best = (this.races[z].best / 1000).toFixed(3);
            this.races[z].average = (this.races[z].average / 1000).toFixed(3);
            this.races[z].clubName = this.clubsDict.getNameById(this.races[z].clubid);
            this.races[z].clubTitle = this.clubsDict.getTitleById(this.races[z].clubid);
        }

        this.pagination = {
            total: response.total,
            page: this.page
        };
    }

    loadData () {
        this.loading = true;
        this.getPilot(this.pilotId, this.page - 1)
            .then(response => this.processPilotData(response))
            .catch((err) => {
                console.error(err);
            })
            .then(() => {
                this.loading = false;
            });
    }
}

angular.module('k.components').component('pilotDetails', {
    templateUrl: 'partials/pilot/pilot.html',
    controller: ['clubsDict', '$stateParams', '$state', '$scope', 'getPilot', PilotDetails]
});
