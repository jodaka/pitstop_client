angular.module('k.services').service('getPilot', [
    'AppConfig', 'request', 'sprintf',
    function getPilotFactory ($AppConfig, $request, sprintf) {
        return function(pilotId, page) {
            const url = $AppConfig.api.url + sprintf($AppConfig.api.pilot, pilotId, page);
            return $request(url);
        };
    }]);
