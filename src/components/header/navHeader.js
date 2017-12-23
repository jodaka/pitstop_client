class NavigationHeader {
    constructor (clubsDict, $stateParams, $state) {
        console.log(776);
        this.$state = $state;
        this.clubs = clubsDict.getClubs();
        this.clubName = $stateParams.club;


        if (this.clubName) {
            this.clubName = this.clubName.toLowerCase();
        }

        console.log(345, $stateParams, $state);
        // this.section = $stateParams.
        this.clubId = clubsDict.getIdByName(this.clubName);
        this.stateName = $state.current.name;
    }

    changeClub (club, stateName = this.stateName) {
        const params = {
            club,
            period: stateName === 'app.races' ? 'all' : 'week'
        };
        if (stateName === 'app.races') {
            params.page = 1;
        }

        this.$state.go(stateName, params);
    }

    icanhas (chzbrgr) {
        switch (chzbrgr) {
        case 'dataFilter':
            return (this.stateName === 'app.races' || this.stateName === 'app.club' || this.stateName === 'app.live');
        case 'back':
            return (this.section === 'pilot' || this.section === 'race');
        default:
            return false;
        }
    }
}

angular.module('k.components').component('navHeader', {
    transclude: true,
    templateUrl: 'partials/header/navHeader.tmpl.html',
    controller: ['clubsDict', '$stateParams', '$state', NavigationHeader]
});
