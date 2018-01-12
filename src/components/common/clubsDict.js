import * as angular from 'angular';

const clubsDictFactory = function(AppConfig) {
    const clubsByIDs = {};

    Object.keys(AppConfig.clubs).forEach((clubName) => {
        clubsByIDs[AppConfig.clubs[clubName].id] = clubName;
    });

    const getTitleById = function(id) {
        return AppConfig.clubs[clubsByIDs[id]].title;
    };

    const getNameById = function(id) {
        return clubsByIDs[id];
    };

    const getIdByName = function(name) {
        if (AppConfig.clubs.hasOwnProperty(name)) {
            return AppConfig.clubs[name].id;
        }
        return null;
    };

    const getClubs = function() {
        return AppConfig.clubs;
    };

    return {
        getClubs,
        getTitleById,
        getNameById,
        getIdByName
    };
};

angular.module('k.services').service('clubsDict', ['AppConfig', clubsDictFactory]);
