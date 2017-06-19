angular.module( 'k.services' ).service( 'getClub', [
    'AppConfig', 'request', 'sprintf',
    function getClubFactory ( $AppConfig, $request, sprintf ) {

        return function ( clubId, page ) {
            var url = $AppConfig.api.url + sprintf( $AppConfig.api.club, clubId, page );
            return $request( url );
        };

    } ] );
