const EVENTS = {
    WS_CONNECTED: 'event-ws-connected',
    WS_DISCONNECTED: 'event-ws-disconnected',
    RACE_STARTED: 'event-race-started',
    RACE_GET_STATE: 'event-get-race-state',
    RACE_FINISHED: 'event-race-finished',
    RACE_SUBSCRIBED: 'event-subscribe-id',
    RACE_STATE: 'event-race-state',
    CLUB_SUBSCRIBE: 'event-subscribe',
    HEAT: 'event-heat-data'
};

angular.module('k.services').service('eventsList', [() => EVENTS]);
