import * as angular from 'angular';
import headerTemplate from './nav-header.html';

class NavigationHeader {
    constructor (clubsDict, $stateParams, $state) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.clubsDict = clubsDict;

        this.clubs = this.clubsDict.getClubs();
        this.clubId = this.clubsDict.getIdByName(this.clubName);
    }

    $onInit () {
        this.clubName = this.$stateParams.club;
        this.stateName = this.$state.current.name;

        if (this.clubName) {
            this.clubName = this.clubName.toLowerCase();
        }

        this.filtersEnabled = (this.stateName !== 'app.pilot');
    }

    changeClub (club, stateName = this.stateName) {
        if (['app.races', 'app.club'].indexOf(stateName) === -1) {
            stateName = 'app.races';
        }

        const params = {
            club,
            period: stateName === 'app.races' ? 'all' : 'week'
        };

        if (this.period) {
            params.period = this.period;
        }

        if (stateName === 'app.races') {
            params.page = 1;
        }

        this.$state.go(stateName, params);
    }
}

angular.module('k.components').component('navHeader', {
    transclude: true,
    bindings: {
        period: '<?'
    },
    template: headerTemplate,
    controller: ['clubsDict', '$stateParams', '$state', NavigationHeader]
});
