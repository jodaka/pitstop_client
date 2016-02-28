/*global confirm:true */
angular.module( 'k.directives' ).directive( 'race', [
'getRace',
function raceFactory( getRace ) {

        var link = function ( $scope ) {
            //
            console.log( 'race directive laoded' );

            getRace( $scope.raceId )
                .then( function ( data ) {
                    console.log( data );

                    data.basic.best = data.basic.best / 1000;
                    $scope.race = data;

                    var labels = new Array( data.laps.length );
                    for ( var i = 1; i <= data.laps.length; i++ ) {
                        labels[ i ] = i;
                    }

                    var series = [];
                    var colors = [ "rgba(255, 0,0, 0.8)", "rgba(0, 255,0, 0.8)", "rgba(0, 0, 255, 0.8)", "rgba(255, 255,0, 1)", "rgba(0, 255, 255, 1)"];

                    for ( var d in data.drivers ) {

                        if ( data.drivers.hasOwnProperty( d ) ) {

                            var serie = [];

                            for ( i = 0; i < data.laps.length; i++ ) {
                                var value = ( typeof data.laps[ i ][ d ] !== 'undefined') ? data.laps[ i ][ d ].time : null;
                                console.log( data.laps[ i ], value );
                                serie.push( value );
                            }

                            console.log( colors[ series.length ] );
                            series.push( {
                                fill: true,
                                tension: 0.25,
                                borderColor: colors[ series.length ],
                                label: data.drivers[d].name,
                                data: serie
                            });
                        }
                    }

                    var ctx = document.getElementById("myChart").getContext("2d");
                    var myChart = new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: labels,
                                datasets: series
                            },

                    });

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
