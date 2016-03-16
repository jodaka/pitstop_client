angular.module( 'k.utils' ).filter( 'raceDate', [
function raceDateFactory() {

        var days = [ 'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота' ];
        var months = [ 'Янв', 'Фев', 'Мар', 'Апр', 'Мая', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек' ];

        return function ( d ) {

            if ( !d ) {
                return;
            }
            console.log(d);

            d = d.replace( 'Z', '+03:00' );
            console.log(d);

            d = new Date( d );

            console.log(d);

            if ( d instanceof Date ) {

                var day = days[ d.getDay() ];
                var mon = months[ d.getMonth() ];
                var date = d.getDate();
                var hours = d.getHours();
                var minutes = d.getMinutes();
                if ( minutes === 0 ) {
                    minutes = '00';
                }
                var res = day + ', ' + date + ' ' + mon + ', ' + hours + ':' + minutes;
                return res;

            } else {
                console.warn( 222, d, d instanceof Date );
                return date;
            }
        };
} ] );
