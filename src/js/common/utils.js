angular.module( 'k.utils' ).factory( 'debounce', [
function debounceFactory() {

        /**
         * Makes sure that function is fired only once during specified timeout
         *
         * @param  {Function} fn
         * @param  {Number}   threshold timeout in ms
         * @return {Function}           debounced function
         */
        return function ( fn, threshold ) {

            var timeout = null;

            return function () {

                var self = this;
                var args = arguments;

                var delayed = function () {
                    fn.apply( self, args );
                    timeout = null;
                };

                if ( timeout ) {
                    clearTimeout( timeout );
                }

                timeout = setTimeout( delayed, threshold );
            };
        };

} ] );

angular.module( 'k.utils' ).factory( 'sprintf', [
function sprintfFactory() {

    return function () {
            var args = Array.prototype.slice.call( arguments, 0 );
            var str = args.shift();
            var parts = str.split( '%s' );

            if ( parts.length - 1 !== args.length ) {
                console.warn( 'Sprintf arguments mismatch! Expected number of arguments: ', parts.length - 1, ', but found ', args );
            }

            var res = parts.shift();
            for ( var i = 0; i < parts.length; i++ ) {
                res += args[ i ] + parts[ i ];
            }
            return res;
        };
}]);
