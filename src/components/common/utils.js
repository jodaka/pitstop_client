import * as angular from 'angular';

angular.module('k.utils').factory('debounce', [
    function debounceFactory () {
        /**
         * Makes sure that function is fired only once during specified timeout
         *
         * @param  {Function} fn
         * @param  {Number}   threshold timeout in ms
         * @return {Function}           debounced function
         */
        return function(fn, threshold) {
            let timeout = null;

            return function() {
                const self = this;
                const args = arguments;

                const delayed = function() {
                    fn.apply(self, args);
                    timeout = null;
                };

                if (timeout) {
                    clearTimeout(timeout);
                }

                timeout = setTimeout(delayed, threshold);
            };
        };
    }]);

angular.module('k.utils').factory('sprintf', [
    function sprintfFactory () {
        return function() {
            const args = Array.prototype.slice.call(arguments, 0);
            const str = args.shift();
            const parts = str.split('%s');

            if (parts.length - 1 !== args.length) {
                console.warn('Sprintf arguments mismatch! Expected number of arguments: ', parts.length - 1, ', but found ', args);
            }

            let res = parts.shift();
            for (let i = 0; i < parts.length; i++) {
                res += args[i] + parts[i];
            }
            return res;
        };
    }]);
