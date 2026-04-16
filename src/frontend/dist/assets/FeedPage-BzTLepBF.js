import { c as createLucideIcon, u as useQueryClient, a as useActor, b as useMutation, G as GiftType, d as useQuery, e as createActor, r as reactExports, f as useInternetIdentity, j as jsxRuntimeExports, S as Skeleton, U as User, g as cn, B as Button, h as useCoinsStore, C as CoinBadge, i as ue, A as AvatarImage, V as VideoCardSkeleton } from "./index-CaylQVRx.js";
import { H as Heart, u as useFollowStatus, a as useFollow } from "./useFollowStatus-CHs6UK2N.js";
import { u as useLikeVideo, a as useVideoFeed } from "./useVideoFeed-DWJ2nzLY.js";
import { X, I as Input } from "./input-BuVWqQVQ.js";
import { A as AnimatePresence } from "./index-xJDs66J8.js";
import { m as motion } from "./proxy-CAbfz4UL.js";
import { B as BadgeCheck, S as SAMPLE_VIDEOS } from "./useSampleVideos-wXi82xme.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }]
];
const MessageCircle = createLucideIcon("message-circle", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M9 18V5l12-2v13", key: "1jmyc2" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["circle", { cx: "18", cy: "16", r: "3", key: "1hluhg" }]
];
const Music = createLucideIcon("music", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
  ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
  ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" }]
];
const Share2 = createLucideIcon("share-2", __iconNode);
function toDate(argument) {
  const argStr = Object.prototype.toString.call(argument);
  if (argument instanceof Date || typeof argument === "object" && argStr === "[object Date]") {
    return new argument.constructor(+argument);
  } else if (typeof argument === "number" || argStr === "[object Number]" || typeof argument === "string" || argStr === "[object String]") {
    return new Date(argument);
  } else {
    return /* @__PURE__ */ new Date(NaN);
  }
}
function constructFrom(date, value) {
  if (date instanceof Date) {
    return new date.constructor(value);
  } else {
    return new Date(value);
  }
}
const minutesInMonth = 43200;
const minutesInDay = 1440;
let defaultOptions = {};
function getDefaultOptions() {
  return defaultOptions;
}
function getTimezoneOffsetInMilliseconds(date) {
  const _date = toDate(date);
  const utcDate = new Date(
    Date.UTC(
      _date.getFullYear(),
      _date.getMonth(),
      _date.getDate(),
      _date.getHours(),
      _date.getMinutes(),
      _date.getSeconds(),
      _date.getMilliseconds()
    )
  );
  utcDate.setUTCFullYear(_date.getFullYear());
  return +date - +utcDate;
}
function compareAsc(dateLeft, dateRight) {
  const _dateLeft = toDate(dateLeft);
  const _dateRight = toDate(dateRight);
  const diff = _dateLeft.getTime() - _dateRight.getTime();
  if (diff < 0) {
    return -1;
  } else if (diff > 0) {
    return 1;
  } else {
    return diff;
  }
}
function constructNow(date) {
  return constructFrom(date, Date.now());
}
function differenceInCalendarMonths(dateLeft, dateRight) {
  const _dateLeft = toDate(dateLeft);
  const _dateRight = toDate(dateRight);
  const yearDiff = _dateLeft.getFullYear() - _dateRight.getFullYear();
  const monthDiff = _dateLeft.getMonth() - _dateRight.getMonth();
  return yearDiff * 12 + monthDiff;
}
function getRoundingMethod(method) {
  return (number) => {
    const round = method ? Math[method] : Math.trunc;
    const result = round(number);
    return result === 0 ? 0 : result;
  };
}
function differenceInMilliseconds(dateLeft, dateRight) {
  return +toDate(dateLeft) - +toDate(dateRight);
}
function endOfDay(date) {
  const _date = toDate(date);
  _date.setHours(23, 59, 59, 999);
  return _date;
}
function endOfMonth(date) {
  const _date = toDate(date);
  const month = _date.getMonth();
  _date.setFullYear(_date.getFullYear(), month + 1, 0);
  _date.setHours(23, 59, 59, 999);
  return _date;
}
function isLastDayOfMonth(date) {
  const _date = toDate(date);
  return +endOfDay(_date) === +endOfMonth(_date);
}
function differenceInMonths(dateLeft, dateRight) {
  const _dateLeft = toDate(dateLeft);
  const _dateRight = toDate(dateRight);
  const sign = compareAsc(_dateLeft, _dateRight);
  const difference = Math.abs(
    differenceInCalendarMonths(_dateLeft, _dateRight)
  );
  let result;
  if (difference < 1) {
    result = 0;
  } else {
    if (_dateLeft.getMonth() === 1 && _dateLeft.getDate() > 27) {
      _dateLeft.setDate(30);
    }
    _dateLeft.setMonth(_dateLeft.getMonth() - sign * difference);
    let isLastMonthNotFull = compareAsc(_dateLeft, _dateRight) === -sign;
    if (isLastDayOfMonth(toDate(dateLeft)) && difference === 1 && compareAsc(dateLeft, _dateRight) === 1) {
      isLastMonthNotFull = false;
    }
    result = sign * (difference - Number(isLastMonthNotFull));
  }
  return result === 0 ? 0 : result;
}
function differenceInSeconds(dateLeft, dateRight, options) {
  const diff = differenceInMilliseconds(dateLeft, dateRight) / 1e3;
  return getRoundingMethod(options == null ? void 0 : options.roundingMethod)(diff);
}
const formatDistanceLocale = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
};
const formatDistance$1 = (token, count, options) => {
  let result;
  const tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }
  if (options == null ? void 0 : options.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }
  return result;
};
function buildFormatLongFn(args) {
  return (options = {}) => {
    const width = options.width ? String(options.width) : args.defaultWidth;
    const format = args.formats[width] || args.formats[args.defaultWidth];
    return format;
  };
}
const dateFormats = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
const timeFormats = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
const dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
const formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: "full"
  })
};
const formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
};
const formatRelative = (token, _date, _baseDate, _options) => formatRelativeLocale[token];
function buildLocalizeFn(args) {
  return (value, options) => {
    const context = (options == null ? void 0 : options.context) ? String(options.context) : "standalone";
    let valuesArray;
    if (context === "formatting" && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      const width = (options == null ? void 0 : options.width) ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      const defaultWidth = args.defaultWidth;
      const width = (options == null ? void 0 : options.width) ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[width] || args.values[defaultWidth];
    }
    const index = args.argumentCallback ? args.argumentCallback(value) : value;
    return valuesArray[index];
  };
}
const eraValues = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
};
const quarterValues = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
};
const monthValues = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
};
const dayValues = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
};
const dayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
};
const formattingDayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
};
const ordinalNumber = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  const rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
};
const localize = {
  ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide"
  })
};
function buildMatchFn(args) {
  return (string, options = {}) => {
    const width = options.width;
    const matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    const matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    const matchedString = matchResult[0];
    const parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    const key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString)) : (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
      findKey(parsePatterns, (pattern) => pattern.test(matchedString))
    );
    let value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
      options.valueCallback(value)
    ) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}
function findKey(object, predicate) {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key) && predicate(object[key])) {
      return key;
    }
  }
  return void 0;
}
function findIndex(array, predicate) {
  for (let key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return void 0;
}
function buildMatchPatternFn(args) {
  return (string, options = {}) => {
    const matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    const matchedString = matchResult[0];
    const parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}
const matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
const parseOrdinalNumberPattern = /\d+/i;
const matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
};
const parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i]
};
const matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
};
const parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
const matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
const parseMonthPatterns = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
const matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
const parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
const matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
const parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
const match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: "any"
  })
};
const enUS = {
  code: "en-US",
  formatDistance: formatDistance$1,
  formatLong,
  formatRelative,
  localize,
  match,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function formatDistance(date, baseDate, options) {
  const defaultOptions2 = getDefaultOptions();
  const locale = (options == null ? void 0 : options.locale) ?? defaultOptions2.locale ?? enUS;
  const minutesInAlmostTwoDays = 2520;
  const comparison = compareAsc(date, baseDate);
  if (isNaN(comparison)) {
    throw new RangeError("Invalid time value");
  }
  const localizeOptions = Object.assign({}, options, {
    addSuffix: options == null ? void 0 : options.addSuffix,
    comparison
  });
  let dateLeft;
  let dateRight;
  if (comparison > 0) {
    dateLeft = toDate(baseDate);
    dateRight = toDate(date);
  } else {
    dateLeft = toDate(date);
    dateRight = toDate(baseDate);
  }
  const seconds = differenceInSeconds(dateRight, dateLeft);
  const offsetInSeconds = (getTimezoneOffsetInMilliseconds(dateRight) - getTimezoneOffsetInMilliseconds(dateLeft)) / 1e3;
  const minutes = Math.round((seconds - offsetInSeconds) / 60);
  let months;
  if (minutes < 2) {
    if (options == null ? void 0 : options.includeSeconds) {
      if (seconds < 5) {
        return locale.formatDistance("lessThanXSeconds", 5, localizeOptions);
      } else if (seconds < 10) {
        return locale.formatDistance("lessThanXSeconds", 10, localizeOptions);
      } else if (seconds < 20) {
        return locale.formatDistance("lessThanXSeconds", 20, localizeOptions);
      } else if (seconds < 40) {
        return locale.formatDistance("halfAMinute", 0, localizeOptions);
      } else if (seconds < 60) {
        return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
      } else {
        return locale.formatDistance("xMinutes", 1, localizeOptions);
      }
    } else {
      if (minutes === 0) {
        return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
      } else {
        return locale.formatDistance("xMinutes", minutes, localizeOptions);
      }
    }
  } else if (minutes < 45) {
    return locale.formatDistance("xMinutes", minutes, localizeOptions);
  } else if (minutes < 90) {
    return locale.formatDistance("aboutXHours", 1, localizeOptions);
  } else if (minutes < minutesInDay) {
    const hours = Math.round(minutes / 60);
    return locale.formatDistance("aboutXHours", hours, localizeOptions);
  } else if (minutes < minutesInAlmostTwoDays) {
    return locale.formatDistance("xDays", 1, localizeOptions);
  } else if (minutes < minutesInMonth) {
    const days = Math.round(minutes / minutesInDay);
    return locale.formatDistance("xDays", days, localizeOptions);
  } else if (minutes < minutesInMonth * 2) {
    months = Math.round(minutes / minutesInMonth);
    return locale.formatDistance("aboutXMonths", months, localizeOptions);
  }
  months = differenceInMonths(dateRight, dateLeft);
  if (months < 12) {
    const nearestMonth = Math.round(minutes / minutesInMonth);
    return locale.formatDistance("xMonths", nearestMonth, localizeOptions);
  } else {
    const monthsSinceStartOfYear = months % 12;
    const years = Math.trunc(months / 12);
    if (monthsSinceStartOfYear < 3) {
      return locale.formatDistance("aboutXYears", years, localizeOptions);
    } else if (monthsSinceStartOfYear < 9) {
      return locale.formatDistance("overXYears", years, localizeOptions);
    } else {
      return locale.formatDistance("almostXYears", years + 1, localizeOptions);
    }
  }
}
function formatDistanceToNow(date, options) {
  return formatDistance(date, constructNow(date), options);
}
function mapComment(c) {
  return {
    id: c.id,
    videoId: c.videoId,
    authorHandle: c.authorHandle,
    authorAvatar: c.authorAvatar || void 0,
    text: c.text,
    likeCount: Number(c.likeCount),
    isLiked: c.isLiked,
    createdAt: Number(c.createdAt / 1000000n)
    // nanoseconds → milliseconds
  };
}
function useComments(videoId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["comments", videoId],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getComments(videoId);
      return raw.map(mapComment);
    },
    enabled: !!videoId && !isFetching,
    staleTime: 3e4
  });
}
function useAddComment(videoId) {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (text) => {
      if (!actor) throw new Error("Not authenticated");
      const raw = await actor.addComment(videoId, text);
      return mapComment(raw);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
    }
  });
}
function useSendGift() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      videoId,
      giftId
    }) => {
      if (!actor) throw new Error("Not authenticated");
      const giftType = GiftType[giftId] ?? GiftType.heart;
      await actor.sendGift(videoId, giftType);
      return { videoId, giftId };
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["videos", vars.videoId] });
    }
  });
}
function useToggleCommentLike() {
  return useMutation({
    mutationFn: async (commentId) => {
      return commentId;
    }
  });
}
function formatCount$1(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toString();
}
function CommentDrawer({
  videoId,
  isOpen,
  onClose
}) {
  const [text, setText] = reactExports.useState("");
  const [likeOverrides, setLikeOverrides] = reactExports.useState(
    /* @__PURE__ */ new Map()
  );
  const { data: comments, isLoading } = useComments(videoId);
  const { mutate: addComment, isPending } = useAddComment(videoId);
  const { mutate: toggleLike } = useToggleCommentLike();
  const { isAuthenticated } = useInternetIdentity();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || !isAuthenticated) return;
    addComment(text.trim());
    setText("");
  };
  const handleLikeToggle = (commentId, currentLiked) => {
    setLikeOverrides((prev) => {
      const next = new Map(prev);
      next.set(commentId, !currentLiked);
      return next;
    });
    toggleLike(commentId);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "fixed inset-0 bg-black/70 z-40 backdrop-blur-[2px] pointer-events-auto",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-2xl border-t border-white/10 pointer-events-auto",
        style: {
          maxHeight: "78vh",
          background: "linear-gradient(180deg, oklch(0.14 0 0 / 0.97) 0%, oklch(0.11 0 0 / 0.99) 100%)",
          backdropFilter: "blur(20px)"
        },
        initial: { y: "100%" },
        animate: { y: 0 },
        exit: { y: "100%" },
        transition: { type: "spring", damping: 28, stiffness: 320 },
        onClick: (e) => e.stopPropagation(),
        "data-ocid": "comment_drawer.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-3 pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-1 rounded-full bg-white/20" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-white/8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-bold text-white text-base", children: [
              (comments == null ? void 0 : comments.length) ?? 0,
              " Comments"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "p-1.5 rounded-full hover:bg-white/10 transition-colors",
                "aria-label": "Close comments",
                "data-ocid": "comment_drawer.close_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-white/60" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-4 py-3 space-y-5 min-h-0", children: isLoading ? ["sk1", "sk2", "sk3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-9 h-9 rounded-full flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-28 h-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-3/4 h-3" })
            ] })
          ] }, k)) : (comments == null ? void 0 : comments.length) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-14 text-center",
              "data-ocid": "comment_drawer.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl mb-4", children: "💬" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-white text-base mb-1", children: "No comments yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-sm font-body", children: "Be the first to drop a thought!" })
              ]
            }
          ) : comments == null ? void 0 : comments.map((comment, index) => {
            const effectiveLiked = likeOverrides.has(comment.id) ? likeOverrides.get(comment.id) ?? false : comment.isLiked ?? false;
            const baseCount = comment.likeCount ?? 0;
            const backendLiked = comment.isLiked ?? false;
            const likeAdjust = likeOverrides.has(comment.id) ? effectiveLiked === backendLiked ? 0 : effectiveLiked ? 1 : -1 : 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex gap-3 group",
                "data-ocid": `comment_drawer.item.${index + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full flex-shrink-0 overflow-hidden bg-white/10 flex items-center justify-center", children: comment.authorAvatar ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: comment.authorAvatar,
                      alt: comment.authorHandle,
                      className: "w-full h-full object-cover",
                      onError: (e) => {
                        e.currentTarget.style.display = "none";
                      }
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-white/40" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2 mb-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-white text-xs", children: [
                        "@",
                        comment.authorHandle
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/40 text-[10px] font-body", children: formatDistanceToNow(comment.createdAt, {
                        addSuffix: true
                      }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/90 text-sm leading-relaxed break-words font-body", children: comment.text }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleLikeToggle(comment.id, effectiveLiked),
                        className: cn(
                          "flex items-center gap-1 mt-2 text-xs transition-colors",
                          effectiveLiked ? "text-[oklch(0.72_0.2_200)]" : "text-white/40 hover:text-white/70"
                        ),
                        "aria-label": effectiveLiked ? "Unlike comment" : "Like comment",
                        "data-ocid": `comment_drawer.toggle.${index + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Heart,
                            {
                              className: cn(
                                "w-3 h-3 transition-smooth",
                                effectiveLiked && "fill-current"
                              )
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCount$1(baseCount + likeAdjust) })
                        ]
                      }
                    )
                  ] })
                ]
              },
              comment.id
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "px-4 py-3 border-t border-white/8 pointer-events-auto",
              style: {
                paddingBottom: "max(env(safe-area-inset-bottom, 4px), 12px)"
              },
              onClick: (e) => e.stopPropagation(),
              onKeyDown: (e) => e.stopPropagation(),
              onPointerDown: (e) => e.stopPropagation(),
              children: isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: text,
                    onChange: (e) => setText(e.target.value),
                    placeholder: "Add a comment...",
                    className: "flex-1 bg-white/8 border-white/12 text-white placeholder:text-white/40 focus-visible:ring-[oklch(0.72_0.2_200)] focus-visible:border-[oklch(0.72_0.2_200)] pointer-events-auto",
                    style: { pointerEvents: "auto" },
                    maxLength: 300,
                    autoFocus: isOpen,
                    onPointerDown: (e) => e.stopPropagation(),
                    onMouseDown: (e) => e.stopPropagation(),
                    onTouchStart: (e) => e.stopPropagation(),
                    "data-ocid": "comment_drawer.input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    size: "icon",
                    disabled: !text.trim() || isPending,
                    className: "bg-[oklch(0.72_0.2_200)] hover:bg-[oklch(0.68_0.22_200)] text-[oklch(0.05_0_0)] flex-shrink-0",
                    "data-ocid": "comment_drawer.submit_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" })
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-white/50 text-sm py-2 font-body", children: "Log in to leave a comment" })
            }
          )
        ]
      }
    )
  ] }) });
}
const GIFTS = [
  {
    id: "g1",
    name: "Star",
    emoji: "⭐",
    coinCost: 5,
    animationClass: "coin-float"
  },
  {
    id: "g2",
    name: "Fire",
    emoji: "🔥",
    coinCost: 10,
    animationClass: "coin-float"
  },
  {
    id: "g3",
    name: "Lightning",
    emoji: "⚡",
    coinCost: 25,
    animationClass: "coin-float"
  },
  {
    id: "g4",
    name: "Diamond",
    emoji: "💎",
    coinCost: 50,
    animationClass: "coin-float"
  },
  {
    id: "g5",
    name: "Cyber Heart",
    emoji: "💙",
    coinCost: 75,
    animationClass: "coin-float"
  },
  {
    id: "g6",
    name: "Crown",
    emoji: "👑",
    coinCost: 100,
    animationClass: "coin-float"
  },
  {
    id: "g7",
    name: "Rocket",
    emoji: "🚀",
    coinCost: 200,
    animationClass: "coin-float"
  },
  {
    id: "g8",
    name: "Galaxy",
    emoji: "🌌",
    coinCost: 500,
    animationClass: "coin-float"
  }
];
function GiftPicker({ videoId, isOpen, onClose }) {
  const [selected, setSelected] = reactExports.useState(null);
  const [floatingCoins, setFloatingCoins] = reactExports.useState([]);
  const balance = useCoinsStore((s) => s.balance);
  const deductCoins = useCoinsStore((s) => s.deductCoins);
  const { mutate: sendGift, isPending } = useSendGift();
  const canAfford = selected ? balance >= selected.coinCost : false;
  const handleSend = () => {
    if (!selected) return;
    if (balance < selected.coinCost) {
      ue.error("Not enough TR Coins! Top up in your wallet. 💰");
      return;
    }
    const newCoins = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 220,
      y: -(Math.random() * 120 + 60)
    }));
    setFloatingCoins(newCoins);
    setTimeout(() => setFloatingCoins([]), 1500);
    deductCoins(selected.coinCost);
    sendGift({ videoId, giftId: selected.id });
    ue.success(`${selected.emoji} ${selected.name} sent!`, {
      description: `−${selected.coinCost} TR Coins`
    });
    onClose();
    setSelected(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "fixed inset-0 bg-black/70 z-40 backdrop-blur-[2px]",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        onClick: onClose,
        "data-ocid": "gift_picker.dialog"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-white/10",
        style: {
          background: "linear-gradient(180deg, oklch(0.14 0 0 / 0.97) 0%, oklch(0.11 0 0 / 0.99) 100%)",
          backdropFilter: "blur(20px)"
        },
        initial: { y: "100%" },
        animate: { y: 0 },
        exit: { y: "100%" },
        transition: { type: "spring", damping: 28, stiffness: 320 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-3 pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-1 rounded-full bg-white/20" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-white text-base", children: "Send a Gift" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-xs font-body mt-0.5", children: "Support your favourite creator" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CoinBadge, { amount: balance, showLabel: true }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onClose,
                    className: "p-1.5 rounded-full hover:bg-white/10 transition-colors",
                    "aria-label": "Close gift picker",
                    "data-ocid": "gift_picker.close_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-white/60" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2 mb-4", children: GIFTS.map((gift) => {
              const isSelected = (selected == null ? void 0 : selected.id) === gift.id;
              const affordable = balance >= gift.coinCost;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.button,
                {
                  type: "button",
                  onClick: () => setSelected(gift),
                  whileTap: { scale: 0.92 },
                  "data-ocid": `gift_picker.item.${gift.id}`,
                  className: cn(
                    "flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border transition-smooth relative overflow-hidden",
                    isSelected ? "border-[oklch(0.72_0.14_68)] bg-[oklch(0.72_0.14_68/0.15)] shadow-[0_0_14px_oklch(0.72_0.14_68/0.35)]" : affordable ? "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/8" : "border-white/5 bg-white/3 opacity-50 cursor-not-allowed"
                  ),
                  children: [
                    isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[oklch(0.72_0.14_68/0.08)] pointer-events-none" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl leading-none", children: gift.emoji }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-white/60 font-body leading-none", children: gift.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CoinBadge, { amount: gift.coinCost, size: "sm" })
                  ]
                },
                gift.id
              );
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              floatingCoins.map((coin) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  className: "absolute bottom-8 left-1/2 text-lg pointer-events-none z-10",
                  animate: { x: coin.x, y: coin.y, opacity: 0, scale: 0.4 },
                  transition: { duration: 1.2, ease: "easeOut" },
                  children: "🪙"
                },
                coin.id
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: cn(
                    "w-full font-display font-bold text-sm transition-smooth",
                    selected && canAfford ? "bg-[oklch(0.72_0.14_68)] hover:bg-[oklch(0.68_0.16_68)] text-[oklch(0.05_0_0)] shadow-[0_0_20px_oklch(0.72_0.14_68/0.4)]" : "bg-white/10 text-white/40"
                  ),
                  disabled: !selected || isPending || !canAfford,
                  onClick: handleSend,
                  "data-ocid": "gift_picker.confirm_button",
                  children: isPending ? "Sending..." : selected ? canAfford ? `Send ${selected.emoji} ${selected.name} · ${selected.coinCost} coins` : `Need ${selected.coinCost - balance} more coins` : "Select a gift to send"
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] }) });
}
function formatCount(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toString();
}
function VideoCard({
  video,
  index,
  onBecameActive,
  containerRef
}) {
  const cardRef = reactExports.useRef(null);
  const videoRef = reactExports.useRef(null);
  const [isActive, setIsActive] = reactExports.useState(false);
  const [liked, setLiked] = reactExports.useState(video.isLiked);
  const [likeCount, setLikeCount] = reactExports.useState(video.likeCount);
  const [showHearts, setShowHearts] = reactExports.useState([]);
  const [showGiftPicker, setShowGiftPicker] = reactExports.useState(false);
  const [showComments, setShowComments] = reactExports.useState(false);
  const [paused, setPaused] = reactExports.useState(false);
  const [videoError, setVideoError] = reactExports.useState(false);
  const tapTimerRef = reactExports.useRef(null);
  const { isAuthenticated } = useInternetIdentity();
  const isAuth = isAuthenticated;
  const { isFollowing } = useFollowStatus(video.creatorHandle);
  const { mutate: followMutation } = useFollow();
  const { mutate: likeMutation } = useLikeVideo();
  reactExports.useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const active = entry.isIntersecting && entry.intersectionRatio >= 0.6;
        setIsActive(active);
        if (active) onBecameActive(index);
      },
      {
        root: containerRef.current,
        threshold: 0.6
      }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [index, onBecameActive, containerRef]);
  reactExports.useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isActive) {
      vid.play().catch(() => {
      });
    } else {
      vid.pause();
    }
  }, [isActive]);
  const triggerHeartBurst = reactExports.useCallback((clientX, clientY) => {
    const id = Date.now();
    const newHearts = Array.from({ length: 7 }, (_, i) => ({
      id: id + i,
      x: clientX + (Math.random() - 0.5) * 100,
      y: clientY + (Math.random() - 0.5) * 100
    }));
    setShowHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setShowHearts(
        (prev) => prev.filter((h) => !newHearts.find((n) => n.id === h.id))
      );
    }, 800);
  }, []);
  const doLike = reactExports.useCallback(
    (clientX, clientY) => {
      if (!liked) {
        setLiked(true);
        setLikeCount((c) => c + 1);
        triggerHeartBurst(clientX, clientY);
        likeMutation({ videoId: video.id, isLiked: false });
      } else {
        triggerHeartBurst(clientX, clientY);
      }
    },
    [liked, triggerHeartBurst, likeMutation, video.id]
  );
  const handleTap = reactExports.useCallback(
    (e) => {
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
        tapTimerRef.current = null;
        doLike(e.clientX, e.clientY);
      } else {
        tapTimerRef.current = setTimeout(() => {
          tapTimerRef.current = null;
          const vid = videoRef.current;
          if (!vid) return;
          if (vid.paused) {
            vid.play().catch(() => {
            });
            setPaused(false);
          } else {
            vid.pause();
            setPaused(true);
          }
        }, 220);
      }
    },
    [doLike]
  );
  const handleLike = (e) => {
    e.stopPropagation();
    if (!isAuth) {
      ue("Log in to like videos", { icon: "🔐" });
      return;
    }
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((c) => newLiked ? c + 1 : c - 1);
    if (newLiked) triggerHeartBurst(e.clientX, e.clientY);
    likeMutation({ videoId: video.id, isLiked: liked });
  };
  const handleFollow = (e) => {
    e.stopPropagation();
    if (!isAuth) {
      ue("Log in to follow creators", { icon: "🔐" });
      return;
    }
    followMutation({
      handle: video.creatorHandle,
      currentlyFollowing: isFollowing
    });
  };
  const handleShare = (e) => {
    e.stopPropagation();
    const url = `https://timereel.app/v/${video.id}`;
    if (navigator.share) {
      navigator.share({ title: video.caption, url }).catch(() => {
      });
    } else {
      navigator.clipboard.writeText(url).catch(() => {
      });
      ue("Link copied!", { icon: "🔗" });
    }
  };
  const handleGift = (e) => {
    e.stopPropagation();
    if (!isAuth) {
      ue("Log in to send gifts", { icon: "🔐" });
      return;
    }
    setShowGiftPicker(true);
  };
  const handleComment = (e) => {
    e.stopPropagation();
    setShowComments(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: cardRef,
      className: "relative w-full flex-shrink-0 overflow-hidden",
      style: {
        height: "100dvh",
        scrollSnapAlign: "start",
        scrollSnapStop: "always"
      },
      "data-ocid": `video_feed.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "absolute inset-0 w-full h-full cursor-default focus:outline-none z-10",
            onClick: handleTap,
            "aria-label": "Tap to pause/play, double tap to like"
          }
        ),
        videoError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 w-full h-full bg-muted/20 flex flex-col items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "📵" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/60 text-xs font-body", children: "Video unavailable" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "video",
          {
            ref: videoRef,
            src: video.videoUrl,
            className: "absolute inset-0 w-full h-full object-cover",
            loop: true,
            muted: true,
            playsInline: true,
            preload: index <= 1 ? "auto" : "metadata",
            poster: video.thumbnailUrl,
            onPlay: () => setPaused(false),
            onPause: () => setPaused(true),
            onError: () => setVideoError(true),
            onLoadedData: () => setVideoError(false)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/25 pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: paused && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "absolute inset-0 flex items-center justify-center z-20 pointer-events-none",
            initial: { opacity: 0, scale: 0.7 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 1.3 },
            transition: { duration: 0.15 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1.5" }) })
          }
        ) }),
        showHearts.map((heart) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "fixed pointer-events-none z-50 text-xl select-none",
            style: { left: heart.x - 12, top: heart.y - 12 },
            initial: { opacity: 1, scale: 0.5 },
            animate: { opacity: 0, scale: 2.2, y: -80 },
            transition: { duration: 0.65, ease: "easeOut" },
            children: "💙"
          },
          heart.id
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-3 bottom-24 flex flex-col items-center gap-4 z-20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AvatarImage,
              {
                src: video.creatorAvatar,
                alt: video.creatorHandle,
                size: "md",
                ring: true,
                ringColor: "cyan"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleFollow,
                className: cn(
                  "absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-smooth shadow-md",
                  isFollowing ? "bg-muted text-foreground border border-border" : "bg-[oklch(0.72_0.2_200)] text-[oklch(0.05_0_0)]"
                ),
                "aria-label": isFollowing ? "Unfollow" : "Follow",
                "data-ocid": `video_feed.follow_button.${index + 1}`,
                children: isFollowing ? "✓" : "+"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleLike,
              className: "flex flex-col items-center gap-1 group",
              "aria-label": `${liked ? "Unlike" : "Like"} video`,
              "data-ocid": `video_feed.like_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    whileTap: { scale: 0.75 },
                    className: cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-smooth",
                      liked ? "bg-[oklch(0.65_0.25_259/0.2)] shadow-[0_0_16px_oklch(0.65_0.25_259/0.5)]" : "bg-black/40 group-hover:bg-[oklch(0.65_0.25_259/0.1)]"
                    ),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Heart,
                      {
                        className: cn(
                          "w-6 h-6 transition-smooth",
                          liked ? "fill-[oklch(0.72_0.2_200)] text-[oklch(0.72_0.2_200)]" : "text-white"
                        )
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-xs font-display font-bold drop-shadow-md", children: formatCount(likeCount) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleComment,
              className: "flex flex-col items-center gap-1 group",
              "aria-label": "Open comments",
              "data-ocid": `video_feed.comment_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    whileTap: { scale: 0.75 },
                    className: "w-12 h-12 rounded-full bg-black/40 group-hover:bg-[oklch(0.65_0.25_259/0.1)] flex items-center justify-center transition-smooth",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-6 h-6 text-white" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-xs font-display font-bold drop-shadow-md", children: formatCount(video.commentCount) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleShare,
              className: "flex flex-col items-center gap-1 group",
              "aria-label": "Share video",
              "data-ocid": `video_feed.share_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    whileTap: { scale: 0.75 },
                    className: "w-12 h-12 rounded-full bg-black/40 group-hover:bg-[oklch(0.65_0.25_259/0.1)] flex items-center justify-center transition-smooth",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-6 h-6 text-white" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-xs font-display font-bold drop-shadow-md", children: formatCount(video.shareCount) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleGift,
              className: "flex flex-col items-center gap-1 group",
              "aria-label": "Send gift",
              "data-ocid": `video_feed.gift_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    whileTap: { scale: 0.75 },
                    className: "w-12 h-12 rounded-full bg-black/40 group-hover:bg-[oklch(0.72_0.14_68/0.15)] flex items-center justify-center transition-smooth",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: "🪙" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-xs font-display font-bold drop-shadow-md", children: formatCount(video.giftCount) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "absolute bottom-0 left-0 right-16 px-4 z-20",
            style: { paddingBottom: "max(env(safe-area-inset-bottom, 4px), 64px)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-white text-sm drop-shadow-md", children: [
                  "@",
                  video.creatorHandle
                ] }),
                video.isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "w-4 h-4 text-[oklch(0.72_0.2_200)] flex-shrink-0" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm leading-relaxed mb-2 drop-shadow max-w-[72vw] line-clamp-2 font-body", children: video.caption }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-x-2 gap-y-0.5 mb-2", children: video.hashtags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "text-[oklch(0.72_0.2_200)] text-xs font-body font-medium",
                  children: [
                    "#",
                    tag
                  ]
                },
                tag
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    animate: isActive && !paused ? { rotate: 360 } : { rotate: 0 },
                    transition: {
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "w-3 h-3 text-white/70" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/70 text-xs font-body truncate max-w-[55vw]", children: video.soundName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CoinBadge, { amount: video.giftCount, size: "sm", showLabel: true }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          GiftPicker,
          {
            videoId: video.id,
            isOpen: showGiftPicker,
            onClose: () => setShowGiftPicker(false)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CommentDrawer,
          {
            videoId: video.id,
            isOpen: showComments,
            onClose: () => setShowComments(false)
          }
        )
      ]
    }
  );
}
const CATEGORIES = [
  "For You",
  "Trending",
  "Latest",
  "Dance",
  "Food",
  "Gaming",
  "Art",
  "Fitness"
];
function FeedPage() {
  const { data: backendVideos, isLoading } = useVideoFeed();
  const [activeCategory, setActiveCategory] = reactExports.useState("For You");
  const [videos, setVideos] = reactExports.useState(SAMPLE_VIDEOS);
  const [activeIndex, setActiveIndex] = reactExports.useState(0);
  const [isLoadingMore, setIsLoadingMore] = reactExports.useState(false);
  const containerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (backendVideos && backendVideos.length > 0) {
      setVideos(backendVideos);
    }
  }, [backendVideos]);
  const handleActiveChange = reactExports.useCallback((index) => {
    setActiveIndex(index);
  }, []);
  const handleLoadMore = reactExports.useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVideos((prev) => [
        ...prev,
        ...SAMPLE_VIDEOS.map((v) => ({
          ...v,
          id: `${v.id}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
        }))
      ]);
      setIsLoadingMore(false);
    }, 800);
  }, [isLoadingMore]);
  reactExports.useEffect(() => {
    if (videos.length > 0 && activeIndex >= videos.length - 2) {
      handleLoadMore();
    }
  }, [activeIndex, videos.length, handleLoadMore]);
  if (isLoading && (!videos || videos.length === 0)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-[100dvh] overflow-hidden bg-[oklch(0.05_0_0)]",
        "aria-label": "Loading feed",
        children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(VideoCardSkeleton, {}, i))
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[100dvh] overflow-hidden bg-[oklch(0.05_0_0)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "absolute top-0 left-0 right-0 z-20 pt-safe",
        initial: { opacity: 0, y: -16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.2 },
        style: { paddingTop: "env(safe-area-inset-top, 8px)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex items-center gap-2 overflow-x-auto px-4 py-2 scrollbar-none",
            style: { scrollbarWidth: "none", WebkitOverflowScrolling: "touch" },
            "data-ocid": "feed.category_bar",
            children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setActiveCategory(cat),
                "data-ocid": `feed.category.${cat.toLowerCase().replace(/\s+/g, "_")}`,
                className: [
                  "flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-display font-bold transition-smooth whitespace-nowrap",
                  activeCategory === cat ? "bg-[oklch(0.72_0.2_200)] text-[oklch(0.05_0_0)] shadow-[0_0_12px_oklch(0.72_0.2_200/0.5)]" : "bg-black/40 text-white/80 backdrop-blur-sm border border-white/10 hover:border-white/30"
                ].join(" "),
                children: cat
              },
              cat
            ))
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: containerRef,
        className: "h-[100dvh] overflow-y-scroll",
        style: {
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
          overscrollBehavior: "contain",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch"
        },
        "data-ocid": "feed.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: videos.map((video, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            VideoCard,
            {
              video,
              index,
              onBecameActive: handleActiveChange,
              containerRef
            },
            video.id
          )) }),
          isLoadingMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[100dvh] snap-start flex-shrink-0 flex items-center justify-center bg-[oklch(0.05_0_0)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-2 border-[oklch(0.72_0.2_200)] border-t-transparent rounded-full animate-spin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/60 text-sm font-body", children: "Loading more..." })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-0.5 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1 py-4", children: videos.slice(0, Math.min(videos.length, 8)).map((video, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: [
          "w-1 rounded-full transition-all duration-300",
          i === activeIndex % Math.min(videos.length, 8) ? "h-5 bg-[oklch(0.72_0.2_200)]" : "h-1.5 bg-white/20"
        ].join(" ")
      },
      video.id
    )) })
  ] });
}
export {
  FeedPage as default
};
