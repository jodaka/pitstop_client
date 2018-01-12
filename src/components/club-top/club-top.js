import * as angular from 'angular';
import template from './club-top.html';

class ClubTop {
    constructor (clubsDict, $stateParams, $state, getClub) {
        this.clubsDict = clubsDict;
        this.$state = $state;
        this.loading = true;
        this.getClub = getClub;

        this.clubName = $stateParams.club;
        if (this.clubName) {
            this.clubName = this.clubName.toLowerCase();
        }

        if (clubsDict.getClubs().hasOwnProperty(this.clubName)) {
            this.clubId = clubsDict.getIdByName(this.clubName);
        } else {
            $state.go('app.club', { club: 'pulkovo', period: 'week' });
            return;
        }

        this.period = $stateParams.period;
        if (!this.period) {
            this.period = 'week';
        }

        const today = new Date();
        this.today = today.toISOString().slice(0, 10);
        today.setDate(today.getDate() - 1);
        this.yesterday = new Date(today.getTime()).toISOString().slice(0, 10);

        this.loadData();
    }

    changeClub (clubId) {
        clubId = Number(clubId);
        if (this.clubId !== clubId) {
            const name = this.clubsDict.getIdByName(clubId);
            if (name) {
                this.$state.go('app.club', {
                    club: name,
                    period: this.period
                });
            }
        }
    }

    isActive (period) {
        return this.period === period;
    }

    setPeriod (period) {
        if (this.period !== period) {
            this.$state.go('app.club', {
                club: this.clubName,
                period
            });
        }
    }

    processData (data) {
        for (let z = 0; z < data.pilots.length; z++) {
            data.pilots[z].best = (data.pilots[z].best / 1000).toFixed(3);
        }

        for (let z = 0; z < data.karts.length; z++) {
            data.karts[z].best = (data.karts[z].best / 1000).toFixed(3);
        }

        this.karts = data.karts;
        this.pilots = data.pilots;
    }

    loadData () {
        this.loading = true;
        this.getClub(this.clubId, this.period)
            .then(data => this.processData(data))
            .catch((err) => {
                console.error(err);
            })
            .then(() => {
                this.loading = false;
            });
    }
}

angular.module('k.components').component('clubTop', {
    template,
    controller: ['clubsDict', '$stateParams', '$state', 'getClub', ClubTop]
});
