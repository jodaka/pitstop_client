angular.module( 'k.directives' ).directive( 'navHeader', [
'AppConfig',
function navHeaderFactory( AppConfig ) {

        var link = function ( $scope ) {

            console.log( 'header', $scope );

            $scope.history = [];

            switch ($scope.section) {
                case 'race':
                    $scope.history.push({
                        'link': '/#/races',
                        'text': 'back to list'
                    });
                    break;
                default:
            };


        };

        return {
            restrict: 'E',
            replace: false,
            link: link,
            scope: {
                section: '@'
            },
            templateUrl: 'utils/navHeader'
        };
} ] );
