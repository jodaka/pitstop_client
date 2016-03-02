/*global ttConfig:true */
angular.module( 'k.services' ).service( 'getPilot', [
'AppConfig', '$http', 'sprintf', '$q',
function getPilotFactory( $AppConfig, $http, sprintf, $q ) {

        return function ( pilotId, page ) {

            var canceler = $q.defer();
            var params = {};

            params.url = $AppConfig.api.url + sprintf( $AppConfig.api.pilot, pilotId, page );
            params.timeout = canceler.promise;
            params.method = 'GET';
            params.cache = true;

            var httpPromise = $http( params );

            httpPromise.cancel = function ( reason ) {
                canceler.resolve( reason );
            };

            return httpPromise.then(function( response ){
                return response.data;
            });
        };

} ] );
