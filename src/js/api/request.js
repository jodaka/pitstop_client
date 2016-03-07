angular.module( 'k.services' ).service( 'request', [
'$http', '$q',
function getRaceFactory( $http, $q ) {

        return function ( url ) {

            var canceler = $q.defer();
            var params = {};

            params.url = url;
            params.timeout = canceler.promise;
            params.method = 'GET';
            params.cache = true;

            var httpPromise = $http( params );

            httpPromise.cancel = function ( reason ) {
                canceler.resolve( reason );
            };

            return httpPromise.then( function ( response ) {
                return response.data;
            } );
        };

} ] );
