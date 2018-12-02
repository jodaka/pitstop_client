import * as angular from 'angular';

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
                })
                .state('app.race', {
                    url: 'race/:club/:raceId',
                    template: '<race-details></race-details>',
                    params: {
                        club: {
                            type: 'string',
                            value: 'pulkovo'
                        },
                        raceId: {
                            type: 'string'
                        }
                    }
                })
                .state('app.pilot', {
                    url: 'pilot/:pilotId/:page',
                    template: '<pilot-details></pilot-details>',
                    params: {
                        pilotId: {
                            type: 'string'
                        },
                        page: {
                            type: 'string'
                        }
                    }
                });
        }]);

        app.config(['$compileProvider', ($compileProvider) => {
            $compileProvider.debugInfoEnabled(false);
        }]);

        app.run(['$rootScope', 'AppConfig',
            function($rootScope, $AppConfig) {
                $AppConfig.api.url = $AppConfig.api.url.replace(/%s/, window.location.hostname);
            }]);

        angular.bootstrap(node, ['pitstop'], {
            strictDi: true
        });
    };

    d.addEventListener('DOMContentLoaded', initApplication);
}(window, document));
