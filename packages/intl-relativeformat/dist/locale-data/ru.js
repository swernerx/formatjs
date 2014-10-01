IntlRelativeFormat.__addLocaleData({"locale":"ru","pluralRuleFunction":function (n) {var i=Math.floor(Math.abs(n)),v=n.toString().replace(/^[^.]*\.?/,"").length;n=Math.floor(n);if(v===0&&i%10===1&&(i%100!==11))return"one";if(v===0&&i%10===Math.floor(i%10)&&i%10>=2&&i%10<=4&&!(i%100>=12&&i%100<=14))return"few";if(v===0&&(i%10===0||v===0&&(i%10===Math.floor(i%10)&&i%10>=5&&i%10<=9||v===0&&i%100===Math.floor(i%100)&&i%100>=11&&i%100<=14)))return"many";return"other";},"fields":{"second":{"displayName":"Секунда","relative":{"0":"сейчас"},"relativeTime":{"future":{"one":"Через {0} секунду","few":"Через {0} секунды","many":"Через {0} секунд","other":"Через {0} секунды"},"past":{"one":"{0} секунду назад","few":"{0} секунды назад","many":"{0} секунд назад","other":"{0} секунды назад"}}},"minute":{"displayName":"Минута","relativeTime":{"future":{"one":"Через {0} минуту","few":"Через {0} минуты","many":"Через {0} минут","other":"Через {0} минуты"},"past":{"one":"{0} минуту назад","few":"{0} минуты назад","many":"{0} минут назад","other":"{0} минуты назад"}}},"hour":{"displayName":"Час","relativeTime":{"future":{"one":"Через {0} час","few":"Через {0} часа","many":"Через {0} часов","other":"Через {0} часа"},"past":{"one":"{0} час назад","few":"{0} часа назад","many":"{0} часов назад","other":"{0} часа назад"}}},"day":{"displayName":"День","relative":{"0":"сегодня","1":"завтра","2":"послезавтра","-2":"позавчера","-1":"вчера"},"relativeTime":{"future":{"one":"Через {0} день","few":"Через {0} дня","many":"Через {0} дней","other":"Через {0} дня"},"past":{"one":"{0} день назад","few":"{0} дня назад","many":"{0} дней назад","other":"{0} дня назад"}}},"month":{"displayName":"Месяц","relative":{"0":"в этом месяце","1":"в следующем месяце","-1":"в прошлом месяце"},"relativeTime":{"future":{"one":"Через {0} месяц","few":"Через {0} месяца","many":"Через {0} месяцев","other":"Через {0} месяца"},"past":{"one":"{0} месяц назад","few":"{0} месяца назад","many":"{0} месяцев назад","other":"{0} месяца назад"}}},"year":{"displayName":"Год","relative":{"0":"в этому году","1":"в следующем году","-1":"в прошлом году"},"relativeTime":{"future":{"one":"Через {0} год","few":"Через {0} года","many":"Через {0} лет","other":"Через {0} года"},"past":{"one":"{0} год назад","few":"{0} года назад","many":"{0} лет назад","other":"{0} года назад"}}}}});