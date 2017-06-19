(function(w, d) {
    // global errors handler
    if (typeof w.onerror === 'undefined') {
        w.onerror = (msg, url, linenumber) => {
            console.warn(`Error message: ${msg}\nURL: ${url}\nLine Number: ${linenumber}`);
            return true;
        };
    }

    /**
     * Loads CSS/JS dependencies and init angular application
     */
    const initApplication = () => {
        // this is a main holder
        const node = d.querySelector('.k-main');

        // and this is router pager
        const holder = d.createElement('div');
        holder.setAttribute('ng-view', '');
        holder.setAttribute('class', 'a-view');
        node.appendChild(holder);

        // If no errors detected, we initialize Angular
        const app = angular.module('k', [
            'ngRoute',
            'k.controllers',
            'k.directives',
            'k.services',
            'k.utils',
            'k.config'
        ]);

        // Angular 1.6 #! router fix
        app.config(['$locationProvider', ($locationProvider) => {
            $locationProvider.hashPrefix('');
        }]);

        app.config(['$routeProvider',
            function($routeProvider) {
                $routeProvider
                    .when('/race/:club/:id', {
                        templateUrl: 'partials/race/race.html',
                        controller: 'RaceCtrl'
                    })
                    .when('/live/:club', {
                        templateUrl: 'partials/live/live.html'
                    })
                    .when('/races/:club?/:period?/:page?', {
                        templateUrl: 'partials/races/races.html',
                        controller: 'RacesCtrl'
                    })
                    .when('/pilot/:id?/:page?', {
                        templateUrl: 'partials/pilot/pilot.html',
                        controller: 'PilotCtrl'
                    })
                    .when('/club/:club?/:period?', {
                        templateUrl: 'partials/club/club.html',
                        controller: 'ClubCtrl'
                    })
                    .otherwise({
                        redirectTo: '/races'
                    });
            }]);

        app.config(['$compileProvider', ($compileProvider) => {
            $compileProvider.debugInfoEnabled(false);
        }]);

        app.run(['$rootScope', 'AppConfig',
            function($rootScope, $AppConfig) {
                $rootScope.$on('$locationChangeSuccess', (scope, newState, oldState) => {
                    if (newState !== oldState) {
                        $rootScope.previousPage = oldState;
                    }
                });

                $rootScope.$on('$routeChangeStart', (evt, next, current) => {
                    if (typeof current !== 'undefined') {
                        const nextName = next.$$route.templateUrl.replace(/.*\/(.*?)\.html/, '$1');
                        $rootScope.$broadcast('routeChange', nextName);
                    }
                });

                $AppConfig.api.url = $AppConfig.api.url.replace(/%s/, location.hostname);
                $AppConfig.ws.url = $AppConfig.ws.url.replace(/%s/, location.hostname);
            }]);

        angular.bootstrap(node, ['k'], {
            strictDi: true
        });
    };

    d.addEventListener('DOMContentLoaded', initApplication);
}(window, document));
