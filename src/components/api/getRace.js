angular.module('k.services').service('getRace', [
    'AppConfig', 'request', 'sprintf',
    function getRaceFactory ($AppConfig, $request, sprintf) {
        return function(raceId) {
            const url = $AppConfig.api.url + sprintf($AppConfig.api.race, raceId);
            return $request(url);
        };
    }]);
