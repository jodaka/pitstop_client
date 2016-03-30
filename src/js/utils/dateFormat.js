angular.module( 'k.utils' ).filter( 'raceDate', [
function raceDateFactory() {

        var days = [ 'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота' ];
        var months = [ 'Янв', 'Фев', 'Мар', 'Апр', 'Мая', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек' ];

        var addLeadingZero = function( num ) {
            if (num < 10) {
                return '0'+num;
            } else {
                return num;
            }
        };

        return function ( d ) {

            if ( !d ) {
                return;
            }

            // d = d.replace( 'Z', '+03:00' );
            d = new Date( d );

            if ( d instanceof Date ) {

                var day = days[ d.getDay() ];
                var mon = months[ d.getMonth() ];
                var date = d.getDate();
                var hours = addLeadingZero( d.getHours() );
                var minutes = addLeadingZero( d.getMinutes());
                var res = day + ', ' + date + ' ' + mon + ', ' + hours + ':' + minutes;
                return res;

            } else {
                console.warn( 222, d, d instanceof Date );
                return date;
            }
        };
} ] );
