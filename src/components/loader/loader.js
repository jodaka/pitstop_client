import * as angular from 'angular';
import template from './loader.html';

angular.module('k.directives').component('loader', {
    bindings: {
        display: '<'
    },
    transclude: true,
    template
});
