/*global ttConfig:true */
angular.module( 'k.services' ).service( 'getRace', [
'AppConfig', '$http', 'sprintf', '$q',
function getRaceFactory( $AppConfig, $http, sprintf, $q ) {

        return function ( raceId ) {

            var canceler = $q.defer();
            var params = {};

            params.url = $AppConfig.api.url + sprintf( $AppConfig.api.race, raceId );
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
