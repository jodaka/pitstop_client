angular.module( 'k.directives' ).directive( 'race', [
'getRace',
function raceFactory( getRace ) {

        var link = function ( $scope, $element ) {

            var round = function ( val ) {
                if ( typeof val === 'number' ) {
                    return val.toFixed( 3 );
                }
                return 0;
            };

            getRace( $scope.raceId )
                .then( function ( data ) {
                    // console.log( data );

                    data.basic.best = data.basic.best / 1000;
                    data.basic.date = data.basic.date.replace( /Z$/, '+0600' );

                    var labels = new Array( data.laps.length );
                    for ( var i = 0; i < data.laps.length; i++ ) {
                        labels[ i ] = i + 1;
                    }

                    var series = [];
                    var colors = [

                        'rgba(172, 207, 204, 0.8)',
                        'rgba(184, 174, 156, 0.8)',
                        'rgba(255, 255, 255, 0.8)',
                        'rgba(138, 9, 23, 0.8)',
                        'rgba(41, 217, 194, 0.8)',
                        'rgba(255, 255, 166, 0.8)',
                        'rgba(174, 238, 0, 0.8)',
                        'rgba(89, 82, 65, 0.8)',
                        'rgba(255, 53, 139, 0.8)'
                    ];

                    for ( var d in data.drivers ) {

                        if ( data.drivers.hasOwnProperty( d ) ) {
                            var serie = [];

                            data.drivers[ d ].average = data.drivers[ d ].average.toFixed( 3 );

                            for ( i = 0; i < data.laps.length; i++ ) {
                                var value = ( typeof data.laps[ i ][ d ] !== 'undefined' ) ? data.laps[ i ][ d ].time : null;

                                if ( value !== null ) {
                                    data.laps[ i ][ d ].time = round( value );
                                }

                                serie.push( value );
                            }

                            series.push( {
                                fill: true,
                                tension: 0.25,
                                borderColor: colors[ series.length ],
                                label: data.drivers[ d ].name,
                                data: serie
                            } );
                        }
                    }

                    $scope.race = data;
                    $scope.driversCount = Object.keys( data.drivers ).length;

                    /*global Chart */
                    var ctx = $element[ 0 ].querySelector( '.k-race-chart' ).getContext( '2d' );
                    var myChart = new Chart( ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: series
                        }
                    } );
                    // options:{
                    //     scales:{
                    //         yAxes:[{
                    //                 ticks:{
                    //                     beginAtZero:true
                    //                 }
                    //             }]
                    //     }
                    // }
                    // Create a new line chart object where as first parameter we pass in a selector
                    // that is resolving to our chart container element. The Second parameter
                    // is the actual data object.
                    // new Chartist.Line( '.ct-chart', {
                    //     // A labels array that can contain any sort of values
                    //     labels: labels,
                    //     // Our series array that contains series objects or in this case series data arrays
                    //     series: series
                    // } );

                } );

        };

        return {
            restrict: 'E',
            replace: false,
            link: link,
            scope: {
                raceId: '='
            },
            templateUrl: 'race/race'
        };
} ] );
