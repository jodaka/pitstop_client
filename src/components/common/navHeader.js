angular.module( 'k.directives' ).directive( 'navHeader', [
'clubsDict', '$routeParams', '$location', '$rootScope',
function navHeaderFactory( clubsDict, $routeParams, $location, $rootScope ) {

        var link = function ( $scope ) {

            $scope.clubs = clubsDict.getTitles();
            $scope.clubName = $routeParams.club;

            if ( $scope.clubName ) {
                $scope.clubName = $scope.clubName.toLowerCase();
            }

            $scope.clubId = clubsDict.getIdByName( $scope.clubName );

            var currentPath = $location.path();

            $scope.getLinkPath = function( id ) {
                var name = clubsDict.getNameById( id );
                if ($scope.section === 'races' || $scope.section === 'club') {
                    var re = new RegExp( $scope.clubName );
                    return '/#' + currentPath.replace( re, name );
                } else {
                    return '/#/races/' + name + '/all/1';
                }
            };

            $scope.gimmeBackLink = function() {
                return $rootScope.previousPage;
            };

            $scope.icanhas = function( chzbrgr ) {
                switch (chzbrgr) {
                    case 'dataFilter':
                        return ( $scope.section === 'races' || $scope.section === 'club' );
                        break;
                    case 'back':
                        return ( $rootScope.previousPage && ( $scope.section === 'pilot' || $scope.section === 'race' ));
                    default:
                        return false;
                }
            };
        };

        return {
            restrict: 'E',
            replace: false,
            link: link,
            scope: {
                section: '@'
            },
            templateUrl: 'partials/common/navHeader.tmpl.html'
        };
} ] );
