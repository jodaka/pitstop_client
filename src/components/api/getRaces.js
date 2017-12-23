angular.module('k.services').service('getRaces', [
    'AppConfig', 'request', 'sprintf',
    function getRacesFactory ($AppConfig, $request, sprintf) {
        return function(selectedClubs, page) {
            const url = $AppConfig.api.url + sprintf($AppConfig.api.races, selectedClubs, page);
            return $request(url);
        };
    }]);
