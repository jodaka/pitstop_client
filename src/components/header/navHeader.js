class NavigationHeader {
    constructor (clubsDict, $stateParams, $location, $state) {
        console.log(776);
        this.clubs = clubsDict.getClubs();
        this.clubName = $stateParams.club;


        if (this.clubName) {
            this.clubName = this.clubName.toLowerCase();
        }

        console.log(345, $stateParams, $state);
        // this.section = $stateParams.
        this.clubId = clubsDict.getIdByName(this.clubName);
        this.currentPath = $location.path();
        this.stateName = $state.current.name;
    }

    // getLinkPath (id) {
    //     const name = this.clubsDict.getNameById(id);
    //     if (this.section === 'races' || this.section === 'club' || this.section === 'live') {
    //         const re = new RegExp(this.clubName);
    //         return `/#${this.currentPath.replace(re, name)}`;
    //     }
    //     return `/#/races/${name}/all/1`;
    // }

    // gimmeBackLink () {
    //     return this.$rootScope.previousPage;
    // }

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
    controller: ['clubsDict', '$stateParams', '$location', '$state', NavigationHeader]
});
