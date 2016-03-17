angular.module( 'k.services' ).service( 'clubsDict', [
'AppConfig',
function clubsDictFactory( AppConfig ) {

        var clubNamesDict = {};
        var clubTitlesDict = {};

        for ( var cl in AppConfig.clubsEn ) {
            if ( AppConfig.clubsEn.hasOwnProperty( cl ) ) {
                clubNamesDict[ AppConfig.clubsEn[ cl ] ] = cl;
            }
        }

        for ( cl in AppConfig.clubs ) {
            if ( AppConfig.clubs.hasOwnProperty( cl ) ) {
                clubTitlesDict[ AppConfig.clubs[ cl ] ] = cl;
            }
        }

        var getTitles = function () {
            return AppConfig.clubs;
        };

        var getNames = function () {
            return AppConfig.clubsEn;
        };

        var getTitleById = function ( id ) {
            return clubTitlesDict[ id ];
        };

        var getNameById = function ( id ) {
            return clubNamesDict[ id ];
        };

        var getIdByName = function ( name ) {
            return AppConfig.clubsEn[ name ];
        };

        return {
            getTitles: getTitles,
            getNames: getNames,
            getTitleById: getTitleById,
            getNameById: getNameById,
            getIdByName: getIdByName

        };
} ] );
