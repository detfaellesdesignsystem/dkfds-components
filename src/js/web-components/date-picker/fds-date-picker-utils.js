/**
 * Get weekday index with Monday as 0
 *
 * @param {Date} date - Date to get weekday for
 * @return {number} Weekday index (0=Mon..6=Sun)
 */
export function getWeekday(date) {
    const day = (date.getDay() + 6) % 7; // First day of the week changed from Sunday to Monday
    return day;
}

/**
 * Get the number of days in a month
 *
 * @param {Date} date - Any date in the month, for which you want the total number of days
 * @return {number} The month's total number of days
 */
export function totalDaysInMonth(date) {
    const newDate = new Date(1990, 1, 1); // Date() uses an argument to create a timestamp of 00:00:00

    newDate.setFullYear(date.getFullYear());
    newDate.setMonth(date.getMonth() + 1);
    newDate.setDate(0); // Sets the date to the last day of the previous month

    return newDate.getDate()
}

/**
 * Converts a date string to a Date object, setting time to 00:00:00.
 * Accepts various separators: slash (/), dash (-), dot (.), or space.
 * 
 * @param {string} str - The date string in YYYY-MM-DD format (or DD-MM-YYYY if reverse is true)
 * @param {boolean} [reverse=false] - If true, expects DD-MM-YYYY format; if false, expects YYYY-MM-DD format
 * @return {Date} A new Date object (time set to 00:00:00), or invalid Date if string format is invalid
 */
export function stringToDate(str, reverse = false) {
    if (typeof str !== 'string') {
        return new Date('invalid');
    }

    let regex = /^(\d{4})[\/\-\. ](\d{1,2})[\/\-\. ](\d{1,2})$/; // Matches year first, e.g. YYYY-MM-DD
    if (reverse) {
        regex = /^(\d{1,2})[\/\-\. ](\d{1,2})[\/\-\. ](\d{4})$/; // Matches day first, e.g. DD-MM-YYYY
    }

    const match = str.match(regex);
    if (match) {
        if (reverse) {
            const day = parseInt(match[1], 10);
            const month = parseInt(match[2], 10) - 1;
            const year = parseInt(match[3], 10);
            return dateFromIntegers(year, month, day);
        }
        else {
            const year = parseInt(match[1], 10);
            const month = parseInt(match[2], 10) - 1;
            const day = parseInt(match[3], 10);
            return dateFromIntegers(year, month, day);
        }
    }
    else {
        return new Date('invalid');
    }
}

/**
 * Checks whether the date is a valid Date
 *
 * @param {*} date - The value to check if it's a valid Date object
 * @return {boolean} True if the value is a valid Date object, false otherwise
 */
export function isValidDate(date) {
    return (date instanceof Date) && !isNaN(date.getTime());
}

/**
 * Checks whether the string would be a valid Date if converted
 *
 * @param {*} date - The value to check if it's a valid Date object
 * @return {boolean} True if the value is a valid Date object, false otherwise
 */
export function isValidDateStr(str) {
    const date = stringToDate(str);
    return (date instanceof Date) && !isNaN(date.getTime());
}

/**
 * Constrains a date to be within the specified range and sets time to 00:00:00
 * 
 * @param {Date} minDate - The minimum allowed date (lower bound, ignored if invalid)
 * @param {Date} date - The date to constrain within the range
 * @param {Date} maxDate - The maximum allowed date (upper bound, ignored if invalid)
 * @return {Date} A new Date object with the constrained date, or invalid Date if input date is invalid
 */
export function constrainDate(minDate, date, maxDate) {
    if (!isValidDate(date)) {
        return new Date('invalid');
    }

    date.setHours(0, 0, 0, 0);
    if (isValidDate(minDate)) { minDate.setHours(0, 0, 0, 0); }
    if (isValidDate(maxDate)) { maxDate.setHours(0, 0, 0, 0); }

    if (isValidDate(minDate) && date < minDate) {
        return minDate;
    }
    else if (isValidDate(maxDate) && maxDate < date) {
        return maxDate;
    }
    else {
        return date;
    }
}

/**
 * Create a date from integers with timestamp 00:00:00. Unlike new Date(yyyy, mm, dd) this function don't allow date roll overs.
 *
 * @param {number} year - The year in the date
 * @param {number} month - The month in the date (0=January..11=December)
 * @param {number} day - The day in the date
 */
export function dateFromIntegers(year, month, day) {
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
        throw new Error('dateFromIntegers() must receive integers');
    }
    if (0 <= month && month <= 11 && 0 <= year && year <= 9999) {
        const totalMonthDays = totalDaysInMonth(new Date(year, month, 1));
        if (1 <= day && day <= totalMonthDays) {
            const date = new Date(1990, 1, 1); // Date() uses an argument to create a timestamp of 00:00:00
            date.setFullYear(year);
            date.setMonth(month);
            date.setDate(day);
            return date;
        }
        else {
            return new Date('invalid');
        }
    }
    else {
        return new Date('invalid');
    }
}

/**
 * Format date as YYYY-MM-DD
 *
 * @param {Date} date - Date to format
 * @return {string} ISO-like local date (YYYY-MM-DD)
 */
export function ISOFormatFromDate(date) {
    const year = String(date.getFullYear()).padStart(4, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Get the previous day
 *
 * @param {Date} date - Reference date
 * @return {Date} New Date representing yesterday
 */
export function getYesterday(date) {
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
}

/**
 * Get the next day
 *
 * @param {Date} date - Reference date
 * @return {Date} New Date representing tomorrow
 */
export function getTomorrow(date) {
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
}

export function getPrevWeek(date) {
    const prevWeek = new Date(date);
    prevWeek.setDate(prevWeek.getDate() - 7);
    return prevWeek;
}

export function getNextWeek(date) {
    const nextWeek = new Date(date);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek;
}

export function getPrevMonth(date) {
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    let prevMonth = month - 1;
    if (prevMonth === -1) {
        prevMonth = 11;
        year = year - 1;
    }
    const newDaysInMonth = totalDaysInMonth(new Date(year, prevMonth, 1));
    if (newDaysInMonth < day) {
        day = newDaysInMonth;
    }

    const newDate = new Date(1990, 1, 1); // Date() uses an argument to create a timestamp of 00:00:00
    newDate.setFullYear(year); // Use setFullYear as new Date(year, month, date) would set year "20" to "1920"
    newDate.setMonth(prevMonth);
    newDate.setDate(day);

    return newDate;
}

export function getNextMonth(date) {
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    let nextMonth = month + 1;
    if (nextMonth === 12) {
        nextMonth = 0;
        year = year + 1;
    }
    const newDaysInMonth = totalDaysInMonth(new Date(year, nextMonth, 1));
    if (newDaysInMonth < day) {
        day = newDaysInMonth;
    }

    const newDate = new Date(1990, 1, 1); // Date() uses an argument to create a timestamp of 00:00:00
    newDate.setFullYear(year); // Use setFullYear as new Date(year, month, date) would set year "20" to "1920"
    newDate.setMonth(nextMonth);
    newDate.setDate(day);

    return newDate;
}

export function getPrevYear(date) {
    let day = date.getDate();
    const month = date.getMonth();
    let year = date.getFullYear();

    let prevYear = year - 1;
    const newDaysInMonth = totalDaysInMonth(new Date(prevYear, month, 1));
    if (newDaysInMonth < day) {
        day = newDaysInMonth;
    }

    const newDate = new Date(1990, 1, 1); // Date() uses an argument to create a timestamp of 00:00:00
    newDate.setFullYear(prevYear); // Use setFullYear as new Date(year, month, date) would set year "20" to "1920"
    newDate.setMonth(month);
    newDate.setDate(day);

    return newDate;
}

export function getNextYear(date) {
    let day = date.getDate();
    const month = date.getMonth();
    let year = date.getFullYear();
    
    let nextYear = year + 1;
    const newDaysInMonth = totalDaysInMonth(new Date(nextYear, month, 1));
    if (newDaysInMonth < day) {
        day = newDaysInMonth;
    }

    const newDate = new Date(1990, 1, 1); // Date() uses an argument to create a timestamp of 00:00:00
    newDate.setFullYear(nextYear); // Use setFullYear as new Date(year, month, date) would set year "20" to "1920"
    newDate.setMonth(month);
    newDate.setDate(day);

    return newDate;
}

/**
 * Checks if two dates are exactly the same
 * 
 * @param {Date} date1 - The first date to compare
 * @param {Date} date2 - The second date to compare
 * @returns {boolean} True if the dates are exactly equal, false otherwise
 */
export function datesAreEqual(date1, date2) {
    if (!isValidDate(date1) || !isValidDate(date2)) {
        return false;
    }

    return date1.getTime() === date2.getTime();
}