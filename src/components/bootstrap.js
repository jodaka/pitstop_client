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

        // If no errors detected, we initialize Angular
        const app = angular.module('pitstop', [
            'ui.router',
            'k.components',
            'k.controllers',
            'k.directives',
            'k.services',
            'k.utils',
            'k.config'
        ]);

        // Angular 1.6 #! router fix
        // app.config(['$locationProvider', function($locationProvider) {
        //     $locationProvider.hashPrefix('');
        // }]);

        app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider) {
            $locationProvider.html5Mode(false);

            $urlRouterProvider.when('/', '/races/pulkovo/all/1');
            $urlRouterProvider.when('', '/races/pulkovo/all/1');

            $stateProvider
                .state('app', {
                    url: '/',
                    abstract: true
                })
                .state('app.races', {
                    url: 'races/:club/:period/:page',
                    template: '<races-list></races-list>',
                    params: {
                        club: {
                            type: 'string',
                            value: 'pulkovo'
                        },
                        period: {
                            type: 'string',
                            value: 'all'
                        },
                        page: {
                            type: 'string',
                            value: '1'
                        }
                    }
                })
                .state('app.club', {
                    url: 'club/:club/:period',
                    template: '<club-top></club-top>',
                    params: {
                        club: {
                            type: 'string',
                            value: 'pulkovo'
                        },
                        period: {
                            type: 'string',
                            value: 'week'
                        }
                    }
                });

            // .state('app.races.incomplete', {
            //     url: 'races/:club',
            //     template: '<races-list></races-list>'
            // })
            // .state('app.races.incomplete2', {
            //     url: 'races/:club/:period',
            //     template: '<races-list></races-list>'
            // })
            // .state('app.races', {
            //     url: 'races/:club/:period/:page',
            //     template: '<races-list></races-list>'
            // });

            // .when('/race/:club/:id', {
            //     templateUrl: 'partials/race/race.html',
            //     controller: 'RaceCtrl'
            // })
            // .when('/live/:club', {
            //     templateUrl: 'partials/live/live.html'
            // })
            // .when('/races/:club?/:period?/:page?', {
            //     templateUrl: 'partials/races/races.html',
            //     controller: 'RacesCtrl'
            // })
            // .when('/pilot/:id?/:page?', {
            //     templateUrl: 'partials/pilot/pilot.html',
            //     controller: 'PilotCtrl'
            // })
            // .when('/club/:club?/:period?', {
            //     templateUrl: 'partials/club/club.html',
            //     controller: 'ClubCtrl'
            // })
            // .otherwise({
            //     redirectTo: '/races'
            // });
        }]);

        // app.config(['$compileProvider', ($compileProvider) => {
        //     $compileProvider.debugInfoEnabled(true);
        // }]);

        app.run(['$rootScope', 'AppConfig',
            function($rootScope, $AppConfig) {
                $rootScope.$on('$stateChangeError', console.log.bind(console));

                $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
                    console.log(`$stateChangeStart to ${toState.to}- fired when the transition begins. toState,toParams : \n`, toState, toParams);
                });

                $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
                    console.log(`$stateChangeSuccess to ${toState.name}- fired once the state transition is complete.`);
                });

                $rootScope.$on('$viewContentLoaded', (event) => {
                    console.log('$viewContentLoaded - fired after dom rendered', event);
                });

                $rootScope.$on('$stateNotFound', (event, unfoundState, fromState, fromParams) => {
                    console.log(`$stateNotFound ${unfoundState.to}  - fired when a state cannot be found by its name.`);
                    console.log(unfoundState, fromState, fromParams);
                });

                // $rootScope.$on('$locationChangeSuccess', (scope, newState, oldState) => {
                //     if (newState !== oldState) {
                //         $rootScope.previousPage = oldState;
                //     }
                // });

                // $rootScope.$on('$routeChangeStart', (evt, next, current) => {
                // if (typeof current !== 'undefined') {
                // const nextName = next.$$route.templateUrl.replace(/.*\/(.*?)\.html/, '$1');
                // $rootScope.$broadcast('routeChange', nextName);
                // }
                // });

                $AppConfig.api.url = $AppConfig.api.url.replace(/%s/, location.hostname);
                $AppConfig.ws.url = $AppConfig.ws.url.replace(/%s/, location.hostname);
            }]);

        angular.bootstrap(node, ['pitstop'], {
            strictDi: true
        });
    };

    d.addEventListener('DOMContentLoaded', initApplication);
}(window, document));
