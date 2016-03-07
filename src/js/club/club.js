angular.module( 'k.directives' ).directive( 'club', [
'AppConfig', 'getClub',
function clubFactory( AppConfig, getClub ) {

        var link = function ( $scope ) {

            $scope.clubs = AppConfig.clubs;
            $scope.clubsIds = {};
            for ( var cl in $scope.clubs ) {
                if ( $scope.clubs.hasOwnProperty( cl ) ) {
                    $scope.clubsIds[ $scope.clubs[ cl ] ] = cl;
                }
            }

            var loadData = function () {

                getClub( $scope.clubId, '' )
                    .then( function ( response ) {

                        console.log(response);
                    } )
                    .catch( function ( err ) {
                        console.error( err );
                    } );
            };

            loadData();

        };

        return {
            restrict: 'E',
            replace: false,
            link: link,
            scope: {
                clubId: '=',
                period: '='
            },
            templateUrl: 'club/club'
        };
} ] );
