import * as angular from 'angular';
import racesTemplate from './races-list.html';

/* global localStorage:true, isNaN:true */
class RacesList {
    constructor (clubsDict, $stateParams, $state, $scope, getRaces, $filter) {
        this.clubs = clubsDict.getClubs();
        this.clubsDict = clubsDict;
        this.$state = $state;
        this.getRaces = getRaces;
        this.$filter = $filter;
        this.$stateParams = $stateParams;

        this.checkParams();

        // on club change
        $scope.$watch('$ctrl.selectedClub', (newVal) => {
            if (newVal) {
                this.loadData();
            }
        });
    }

    checkParams () {
        let period = this.$stateParams.period;
        let page = this.$stateParams.page;
        let date = null;

        if (!(period === 'all' || period === 'date')) {
            period = 'all';
        }

        const today = new Date();
        this.today = today.toISOString().slice(0, 10);
        today.setDate(today.getDate() - 1);
        this.yesterday = new Date(today.getTime()).toISOString().slice(0, 10);

        // check if page is actually a day
        if (period === 'date' && (/\d\d\d\d-\d\d-\d\d/).test(page)) {
            try {
                date = new Date(page);
                date = page;
            } catch (err) {
                page = 1;
                date = null;
                period = 'all';
            }
        } else {
            period = 'all';
            page = Number(page);
            if (isNaN(page) || !Number.isInteger(page)) {
                this.redirectToDefault();
                return;
            }
        }

        this.period = period;
        this.date = date;
        this.page = page;

        this.clubName = this.$stateParams.club;
        if (this.clubName) {
            this.clubName = this.clubName.toLowerCase();
        }

        this.selectedClub = this.clubsDict.getIdByName(this.clubName);

        if (!this.selectedClub) {
            this.redirectToDefault();
        }
    }

    saveUrlParams () {
        const page = (this.date === null) ? this.page : this.date;
        this.$state.go('app.races', {
            club: this.clubName,
            period: this.period,
            page
        });
    }

    setPeriod (period) {
        if (period === 'all') {
            this.period = period;
        } else {
            this.period = 'date';

            switch (period) {
            case 'today':
                this.date = this.today;
                break;
            case 'yesterday':
                this.date = this.yesterday;
                break;
            default:
                this.date = period;
                break;
            }
        }
        this.saveUrlParams();
    }

    periodIsActive (period) {
        if (this.period === 'all' && period === 'all') {
            return true;
        }
        if (this.period === 'date' && period === this.date) {
            return true;
        }

        return false;
    }

    changePage (pageObject) {
        const page = pageObject.page ? pageObject.page : pageObject;

        if (page && page !== this.page) {
            this.page = page;
            this.saveUrlParams();
        }
    }

    redirectToDefault () {
        this.page = 1;
        this.date = null;
        this.period = 'all';

        this.clubName = 'pulkovo';
        this.clubId = this.clubsDict.getIdByName(this.clubName);
        this.saveUrlParams();
    }

    processResponse (response) {
        this.races = (angular.isArray(response.data)) ? response.data : [response.data];

        for (let z = 0; z < this.races.length; z++) {
            this.races[z].best = this.$filter('lapTime')(this.races[z].best);
        }

        this.pagination = {
            total: response.total,
            page: this.page
        };
    }


    // requesting data again
    loadData () {
        this.loading = true;
        this.races = [];
        const period = (this.date === null) ? this.page - 1 : this.date;

        this.getRaces(this.selectedClub, period)
            .then(response => this.processResponse(response))
            .catch((err) => {
                console.error(err);
            })
            .then(() => {
                this.loading = false;
            });
    }
}

angular.module('k.components').component('racesList', {
    controller: ['clubsDict', '$stateParams', '$state', '$scope', 'getRaces', '$filter', RacesList],
    template: racesTemplate
});
