// Date format parameters
// https://tc39.es/ecma402/#datetimeformat-objects

// "weekday":	"narrow", "short", "long"
// "era":	"narrow", "short", "long"
// "year":	"2-digit", "numeric"
// "month":	"2-digit", "numeric", "narrow", "short", "long"
// "day":	"2-digit", "numeric"
// "dayPeriod":	"narrow", "short", "long"
// "hour":	"2-digit", "numeric"
// "minute":	"2-digit", "numeric"
// "second":	"2-digit", "numeric"
// "fractionalSecondDigits":	1𝔽, 2𝔽, 3𝔽
// "timeZoneName":	"short", "long", "shortOffset", "longOffset", "shortGeneric", "longGeneric"

// returns 04/04/22
export const shortDate = (date: Date) => {
  const a = [{ month: '2-digit' }, { day: '2-digit' }, { year: '2-digit' }];
  const s = dateToString(date, a, '/');

  return s;
};

// returns '04/04/22, 11:48:19 PM'
export const shortDateWithTime = (date: Date) => {
  const a = [
    {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
  ];
  const s = dateToString(date, a, ':');

  return `${shortDate(date)}, ${s}`;
};

// returns 'Apr/04/2022'
export const longDate = (date: Date) => {
  const a = [{ month: 'short' }, { day: '2-digit' }, { year: 'numeric' }];
  const s = dateToString(date, a, '/');

  return s;
};

// returns 'Monday April 04 2022 4/4/2022, PDT'
export const fullDate = (date: Date) => {
  const a = [
    { weekday: 'long' },
    { month: 'long' },
    { day: '2-digit' },
    { year: 'numeric' },
    { timeZoneName: 'short' }
  ];
  const s = dateToString(date, a, ' ');

  return s;
};

export const dateToString = (date: Date, components: object[], separator: string) => {
  const build = (t: Date, a: object[], s: string) => {
    const format = (m: object) => {
      const f = new Intl.DateTimeFormat('en', m);

      return f.format(t);
    };

    return a.map(format).join(s);
  };

  const s = build(date, components, separator);

  return s;
};
