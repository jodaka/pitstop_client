class NavigationHeader {
    constructor (clubsDict, $stateParams, $state) {
        this.$state = $state;
        this.clubs = clubsDict.getClubs();
        this.clubName = $stateParams.club;


        if (this.clubName) {
            this.clubName = this.clubName.toLowerCase();
        }

        this.clubId = clubsDict.getIdByName(this.clubName);
        this.stateName = $state.current.name;

        this.filtersEnabled = (this.section !== 'pilot');
    }

    changeClub (club, stateName = this.stateName) {
        // when in race state, changing club doesn't makes sense
        if (stateName === 'app.race') {
            return;
        }

        const params = {
            club,
            period: stateName === 'app.races' ? 'all' : 'week'
        };
        if (stateName === 'app.races') {
            params.page = 1;
        }

        this.$state.go(stateName, params);
    }
}

angular.module('k.components').component('navHeader', {
    transclude: true,
    templateUrl: 'partials/header/nav-header.html',
    controller: ['clubsDict', '$stateParams', '$state', NavigationHeader]
});
