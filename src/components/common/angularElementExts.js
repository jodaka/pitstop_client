( function () {

    'use strict';
    /**
     * Few basic method that extends angular.element.
     * Since extending foreign object is considered to be bad practice,
     * we oversome it by wrapping all methods inside our own 'tt' namespace
     *
     *
     * So any jqLite element can use methods using simple syntax:
     *     angular.element.k.method_name()
     *
     */

    var NgElementExts = function ( self ) {
        // we need a reference for this inside our own wrapper
        this.el = self;
    };


    NgElementExts.prototype = {

        show: function () {
            this.el.removeClass( 'hidden' );
            return this.el;
        },

        hide: function () {
            this.el.addClass( 'hidden' );
            return this.el;
        },

        querySelector: function ( selector ) {
            return angular.element( this.el[ 0 ].querySelector( selector ) );
        },

    };

    /**
     * There's a trick with saving 'this' reference.
     * Solution based on this article:
     * http://lea.verou.me/2015/04/idea-extending-native-dom-prototypes-without-collisions/
     *
     */
    Object.defineProperty( angular.element.prototype, 'k', {
        get: function () {
            Object.defineProperty( this, 'k', {
                value: new NgElementExts( this )
            } );
            return this.tt;
        },
        configurable: true,
        writeable: false
    } );

}() );
