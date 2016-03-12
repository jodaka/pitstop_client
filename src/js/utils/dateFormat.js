angular.module( 'k.utils' ).filter( 'raceDate', [
function raceDateFactory() {

        var days = [ 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье' ];

        return function ( date ) {

            date = new Date( date );

            if ( date instanceof Date ) {
                var res = days[ date.getDay() ] + ' ' + date.getDate() + ', ' + date.getHours() + ':' + date.getMinutes();

                console.log( 111, date );
                return res;
            } else {
                console.log( 222, date, date instanceof Date  );
                return date;
            }


        };

} ] );
