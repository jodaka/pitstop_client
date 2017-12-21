/* global localStorage*/

console.log(8);
class RacesList {

    constructor (clubsDict, $stateParams) {
        console.log(998);
        this.clubs = clubsDict.getClubs();
        this.clubsDict = clubsDict;
        // this.$location = $location;

        let period = $stateParams.period;
        let page = $stateParams.page;
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

        this.clubName = $stateParams.club;
        if (this.clubName) {
            this.clubName = this.clubName.toLowerCase();
        }

        this.selectedClub = clubsDict.getIdByName(this.clubName);

        if (!this.selectedClub) {
            this.redirectToDefault();
            return;
        }
    }

    saveUrlParams () {
        const period = (this.date === null) ? this.page : this.date;
        const path = `/races/${this.clubName}/${this.period}/${period}`;
        console.warn('redirect to ', path);
        // this.$location.path();
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

    changePage (page) {
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

}

angular.module('k.components').component('racesList', {
    templateUrl: 'partials/races/races.html',
    // controller: RacesList
    controller: ['clubsDict', '$stateParams', RacesList]
});
