angular.module('k.services').service('request', [
    '$http', '$q',
    function getRaceFactory ($http, $q) {
        return function(url) {
            const canceler = $q.defer();
            const params = {};

            params.url = url;
            params.timeout = canceler.promise;
            params.method = 'GET';
            params.cache = true;

            const httpPromise = $http(params);

            httpPromise.cancel = function(reason) {
                canceler.resolve(reason);
            };

            return httpPromise.then(response => response.data);
        };
    }]);
