angular.module( 'k.services' ).service( 'apiRequest', [
'$http', '$q',
function apiRequestFactory( $http, $q ) {

        /**
         * Wrapper for API calls. It's able to make retries
         *
         * @param {Object} httpPromiseParams params for $http request. Can be Array or Object
         * @param {Function} [formatter] optional function to format data
         *
         * @return {Promise}
         */
        return function ( httpPromiseParams, formatter, options ) {

            var makeHttpRequest = function ( httpParams ) {

                var params = angular.copy( ( typeof httpParams === 'undefined' ) ? httpPromiseParams : httpParams );

                var canceler = $q.defer();
                params.timeout = canceler.promise;
                params.method = 'GET';
                if ( !params.hasOwnProperty( 'cache' ) ) {
                    params.cache = false;
                }

                var httpPromise = $http( params );

                httpPromise.cancel = function ( reason ) {
                    canceler.resolve( reason );
                };

                return httpPromise;
            };

            var defaultOptions = {
                retries: 15,
                timeout: 250,
                timeout_step: 250
            };

            if ( typeof options === 'undefined' ) {
                options = defaultOptions;
            } else {
                for ( var option in defaultOptions ) {
                    if ( !options.hasOwnProperty( option ) ) {
                        options[ option ] = defaultOptions[ option ];
                    }
                };
            }

            var resultDeferred = $q.defer();
            var cancelled = false;
            var httpPromise = null;
            var timeout = options.timeout;

            var defaultResponseChecker = function ( response ) {
                return ( angular.isArray( response.data ) && response.data.length > 0 );
            };

            var defaultRequestIdChecker = function ( response ) {
                return ( response.data && response.data.id );
            };

            var poll = function ( retries ) {

                // cancelling request
                if ( cancelled && httpPromise !== null ) {
                    httpPromise.cancel();
                    return;
                }

                if ( retries > 0 ) {

                    httpPromise = makeHttpRequest();

                    var scheduleRetry = function () {

                        // scheduling retry
                        setTimeout( function () {
                            poll( retries - 1 );
                        }, timeout += options.timeout_step );
                    };

                    // TODO add timeouts
                    httpPromise
                        .then( function success( response ) {

                            var checker = ( httpPromiseParams.hasOwnProperty( 'customChecker' ) ) ? httpPromiseParams.customChecker : defaultResponseChecker;

                            if ( checker( response ) ) {

                                var result = response.data;
                                if ( typeof formatter === 'function' ) {
                                    try {
                                        result = formatter( response.data );
                                    } catch ( e ) {
                                        console.error( 'Couldnt format data', response.data, e );
                                        resultDeferred.reject( e );
                                    }
                                }

                                resultDeferred.resolve( result );

                            } else {
                                scheduleRetry();
                            }

                        } )
                        .catch( function error( err ) {
                            scheduleRetry();
                        } );

                } else {
                    resultDeferred.reject( 'Timeout' );
                }
            };

            /**
             * If httpPromiseParams is Array then we expect that it has 2 elements,
             * first one has parameters to request id, and the second one would poll
             * that request id.
             *
             * If httpPromiseParams isn't an array, then we just poll first params
             * for data
             */
            if ( httpPromiseParams instanceof Array ) {

                makeHttpRequest( httpPromiseParams[ 0 ] )
                    .then( function ( response ) {

                        var checker = ( httpPromiseParams[ 0 ].hasOwnProperty( 'customChecker' ) ) ? httpPromiseParams[ 0 ].customChecker : defaultRequestIdChecker;

                        if ( checker( response ) ) {
                            httpPromiseParams = httpPromiseParams[ 1 ];
                            httpPromiseParams.url = httpPromiseParams.url.replace( /%s/, response.data.id );
                            poll( options.retries );
                        } else {
                            console.error( 'Couldnt get request id', response );
                            resultDeferred.reject( response );
                        }

                    } )
                    .catch( function ( error ) {
                        console.error( 'Couldnt get request id', error );
                        resultDeferred.reject( error );
                    } );

            } else {

                poll( options.retries );
            }

            resultDeferred.promise.cancel = function () {
                console.info( 'cancelling request from ', httpPromiseParams );
                cancelled = true;
            };

            return resultDeferred.promise;

        };

} ] );
