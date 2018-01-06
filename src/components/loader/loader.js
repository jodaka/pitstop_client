angular.module('k.directives').directive('loader', () => {
    return {
        restrict: 'E',
        scope: {
            display: '='
        },
        transclude: true,
        replace: true,
        templateUrl: 'partials/loader/loader.html'
    };
});
