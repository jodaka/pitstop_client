angular.module( 'k.controllers' ).controller( 'ClubCtrl', [
'AppConfig', '$scope', '$routeParams', '$location',
function ClubCtrlFactory( AppConfig, $scope, $routeParams, $location ) {

        $scope.clubs = AppConfig.clubs;

        $scope.clubName = $routeParams.id;
        if ( $scope.clubName ) {
            $scope.clubName = $scope.clubName.toLowerCase();
        }

        // checking club id
        if ( AppConfig.clubsEn.hasOwnProperty( $scope.clubName ) ) {
            $scope.clubId = AppConfig.clubsEn[ $scope.clubName ];
        } else {
            $location.path( '/races/pulkovo/week' );
            return;
        }

        $scope.period = $routeParams.period;
        if ( !$scope.period ) {
            $scope.period = 'week';
        }

        var today = new Date();
        $scope.today = today.toISOString().slice( 0, 10 );
        today.setDate( today.getDate() - 1 );
        $scope.yesterday = new Date( today.getTime() ).toISOString().slice( 0, 10 );

        $scope.changeClub = function( clubId ) {
            clubId = Number( clubId );
            if ( $scope.clubId !== clubId ) {
                for ( var cl in AppConfig.clubsEn ) {
                    if ( AppConfig.clubsEn.hasOwnProperty( cl ) ) {
                        if ( AppConfig.clubsEn[ cl ] === clubId ) {
                            $location.path( '/club/' + cl+ '/' + $scope.period );
                            break;
                        }
                    }
                }

            }
        };

        $scope.isActive = function( period ) {
            return $scope.period === period;
        };

        $scope.setPeriod = function( period ) {
            console.log('setting peropd', period );
            if ( $scope.period !== period ) {
                $location.path( '/club/' + $scope.clubName + '/' + period );
            }
        };
} ] );
