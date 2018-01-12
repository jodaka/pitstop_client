import * as angular from 'angular';

const addLeadingZero = (num) => {
    if (num < 10) {
        return `0${num}`;
    }
    return num;
};

angular.module('k.utils').filter('raceDate', ['$sce',
    ($sce) => {
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Мая', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

        return function(d) {
            if (!d) {
                return;
            }
            d = new Date(d);

            if (d instanceof Date) {
                const day = days[d.getDay()];
                const mon = months[d.getMonth()];
                const date = d.getDate();
                const hours = addLeadingZero(d.getHours());
                const minutes = addLeadingZero(d.getMinutes());
                const res = `<span class="no-mobile">${day}, </span>${date} ${mon}, ${hours}:${minutes}`;
                return $sce.trustAsHtml(res);
            }
            return d;
        };
    }]);


angular.module('k.utils').filter('lapTime', [
    () => {
        const toPrecision = num => (num / 1000).toFixed(3);

        return function(num) {
            if (num < 60000) {
                return toPrecision(num);
            }

            let hours = 0;
            let mins = 0;
            let sec = num;

            while (sec > 60000) {
                mins += 1;
                sec -= 60000;
                if (mins === 60) {
                    mins = 0;
                    hours += 1;
                }
            }

            let res = '';
            if (hours > 0) {
                res += `${hours}:`;
                mins = addLeadingZero(mins);
            }
            if (mins > 0) {
                res += `${mins}:`;
                if (sec < 9000) {
                    res += `0${toPrecision(sec)}`;
                } else {
                    res += toPrecision(sec);
                }
            } else {
                res += toPrecision(sec);
            }

            return res;
        };
    }]);
