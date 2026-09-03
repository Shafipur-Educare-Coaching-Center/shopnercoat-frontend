/**
 * Strict Nominal Dhaka Timezone Date and Registration Utilities for Shopner Coat
 *
 * Guarantees zero timezone shift (+6h bug eliminated) by parsing and rendering
 * the exact nominal date/time digits returned from the database.
 */

export const DHAKA_TIMEZONE = 'Asia/Dhaka';

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export interface NominalDateTime {
  year: string;
  month: string;
  day: string;
  hour: number;
  minute: number;
  second: number;
  dateKey: string;       // "YYYY-MM-DD"
  formattedDate: string;  // "03 Sep 2026"
  formattedTime: string;  // "12:00 PM"
  inputDateTime: string;  // "YYYY-MM-DDTHH:mm"
  inputDate: string;      // "YYYY-MM-DD"
  rawString: string;      // "YYYY-MM-DDTHH:mm:ss"
}

/**
 * Extracts exact nominal digits (YYYY, MM, DD, HH, mm, ss) without any timezone shifting
 */
export function parseNominalDateTime(val?: string | Date | null): NominalDateTime | null {
  if (!val) return null;

  let raw = '';
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return null;
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: DHAKA_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).formatToParts(val);
    const get = (t: string) => parts.find((p) => p.type === t)?.value || '00';
    raw = `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')}`;
  } else {
    raw = String(val).trim();
  }

  // 1. Matches "YYYY-MM-DD HH:mm:ss" or "YYYY-MM-DDTHH:mm:ss..."
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (match) {
    const [, year, month, day, hhStr, mmStr, ssStr = '00'] = match;
    const hour = parseInt(hhStr, 10);
    const minute = parseInt(mmStr, 10);
    const second = parseInt(ssStr, 10);

    const monthIdx = parseInt(month, 10) - 1;
    const monthName = MONTH_NAMES_SHORT[monthIdx] || month;

    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const displayMinute = String(minute).padStart(2, '0');
    const formattedTime = `${displayHour}:${displayMinute} ${ampm}`;
    const formattedDate = `${day} ${monthName} ${year}`;

    return {
      year,
      month,
      day,
      hour,
      minute,
      second,
      dateKey: `${year}-${month}-${day}`,
      formattedDate,
      formattedTime,
      inputDateTime: `${year}-${month}-${day}T${hhStr}:${mmStr}`,
      inputDate: `${year}-${month}-${day}`,
      rawString: `${year}-${month}-${day}T${hhStr}:${mmStr}:${ssStr}`,
    };
  }

  // 2. Matches date only "YYYY-MM-DD"
  const dateMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    const [, year, month, day] = dateMatch;
    const monthIdx = parseInt(month, 10) - 1;
    const monthName = MONTH_NAMES_SHORT[monthIdx] || month;

    return {
      year,
      month,
      day,
      hour: 0,
      minute: 0,
      second: 0,
      dateKey: `${year}-${month}-${day}`,
      formattedDate: `${day} ${monthName} ${year}`,
      formattedTime: '12:00 AM',
      inputDateTime: `${year}-${month}-${day}T00:00`,
      inputDate: `${year}-${month}-${day}`,
      rawString: `${year}-${month}-${day}T00:00:00`,
    };
  }

  return null;
}

/**
 * Backwards compatibility aliases
 */
export const parseDhakaDateTime = (val?: string | Date | null): Date | null => {
  const parsed = parseNominalDateTime(val);
  if (!parsed) return null;
  return new Date(`${parsed.rawString}+06:00`);
};
export const parseDateTime = parseDhakaDateTime;

/**
 * Formats date into readable string e.g. "04 Sept 2026"
 */
export function formatExamDate(val?: string | Date | null, includeWeekday = false): string {
  if (!val) return 'Date TBA';
  const parsed = parseNominalDateTime(val);
  if (!parsed) return String(val).split('T')[0].split(' ')[0];

  if (includeWeekday) {
    try {
      const d = new Date(`${parsed.rawString}+06:00`);
      const weekday = new Intl.DateTimeFormat('en-US', { timeZone: DHAKA_TIMEZONE, weekday: 'short' }).format(d);
      return `${weekday}, ${parsed.formattedDate}`;
    } catch {
      return parsed.formattedDate;
    }
  }

  return parsed.formattedDate;
}

/**
 * Formats time string e.g. "12:00 PM", "09:00 PM"
 */
export function formatExamTime(val?: string | Date | null): string {
  if (!val) return '';
  if (typeof val === 'string' && (val.includes('AM') || val.includes('PM'))) {
    return val.trim();
  }

  const parsed = parseNominalDateTime(val);
  if (!parsed) return String(val);

  return parsed.formattedTime;
}

/**
 * Formats candidate registration window e.g.
 * - Same day: "03 Sep, 12:00 PM – 09:00 PM"
 * - Multi day: "03 Sep, 12:00 PM to 04 Sep, 09:00 PM"
 */
export function formatExamRegWindow(startIso?: string | null, endIso?: string | null): string {
  if (!endIso && !startIso) return 'Open for registration';

  const startParsed = parseNominalDateTime(startIso);
  const endParsed = parseNominalDateTime(endIso);

  if (startParsed && endParsed) {
    if (startParsed.dateKey === endParsed.dateKey) {
      return `${endParsed.formattedDate}, ${startParsed.formattedTime} – ${endParsed.formattedTime}`;
    }
    return `${startParsed.formattedDate}, ${startParsed.formattedTime} to ${endParsed.formattedDate}, ${endParsed.formattedTime}`;
  }

  if (endParsed) {
    return `${endParsed.formattedDate}, ${endParsed.formattedTime}`;
  }

  return 'Open for registration';
}

/**
 * Formats datetime into "YYYY-MM-DDTHH:mm" for <input type="datetime-local" />
 */
export function toDateTimeLocalInput(val?: string | null): string {
  const parsed = parseNominalDateTime(val);
  return parsed ? parsed.inputDateTime : '';
}

/**
 * Formats date into "YYYY-MM-DD" for <input type="date" />
 */
export function toDateInput(val?: string | null): string {
  const parsed = parseNominalDateTime(val);
  return parsed ? parsed.inputDate : '';
}

/**
 * Gets current timestamp representation in Bangladesh (Asia/Dhaka)
 */
function getDhakaCurrentTime(): { nowKey: string; nowRaw: string } {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: DHAKA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const get = (t: string) => parts.find((p) => p.type === t)?.value || '00';
  const y = get('year');
  const m = get('month');
  const d = get('day');
  const hh = get('hour');
  const mm = get('minute');
  const ss = get('second');

  return {
    nowKey: `${y}-${m}-${d}`,
    nowRaw: `${y}-${m}-${d}T${hh}:${mm}:${ss}`,
  };
}

/**
 * Unified Registration Lifecycle Evaluator
 */
export type RegistrationStatusType = 'OPEN' | 'BEFORE_OPEN' | 'PAST_DEADLINE' | 'CLOSED';

export interface ExamRegistrationEvaluation {
  status: RegistrationStatusType;
  isOpen: boolean;
  badgeText: string;
  badgeVariant: 'open' | 'soon' | 'closed';
  timeRemainingText?: string;
}

export function evaluateExamRegistration(exam: {
  status?: string | null;
  registrationStartAt?: string | null;
  registrationEndAt?: string | null;
}): ExamRegistrationEvaluation {
  const isStatusOpen = exam.status === 'REGISTRATION_OPEN' || !exam.status;

  const { nowKey, nowRaw } = getDhakaCurrentTime();

  const startParsed = parseNominalDateTime(exam.registrationStartAt);
  const endParsed = parseNominalDateTime(exam.registrationEndAt);

  // 1. If explicitly closed or cancelled in admin
  if (exam.status === 'REGISTRATION_CLOSED' || exam.status === 'CANCELLED') {
    return {
      status: 'CLOSED',
      isOpen: false,
      badgeText: 'Registration Closed',
      badgeVariant: 'closed',
    };
  }

  // 2. If registration window has not started yet
  if (startParsed && nowRaw < startParsed.rawString) {
    const isToday = nowKey === startParsed.dateKey;

    return {
      status: 'BEFORE_OPEN',
      isOpen: false,
      badgeText: isToday ? `Opens Today at ${startParsed.formattedTime}` : `Opens ${startParsed.formattedDate}`,
      badgeVariant: 'soon',
    };
  }

  // 3. If registration window has already passed
  if (endParsed && nowRaw > endParsed.rawString) {
    return {
      status: 'PAST_DEADLINE',
      isOpen: false,
      badgeText: 'Registration Closed',
      badgeVariant: 'closed',
    };
  }

  // 4. Registration is currently active!
  if (isStatusOpen) {
    let timeRemainingText = 'Open for Registration';
    if (endParsed) {
      const isEndingToday = nowKey === endParsed.dateKey;
      timeRemainingText = isEndingToday
        ? `Closes Today at ${endParsed.formattedTime}`
        : `Closes ${endParsed.formattedDate}`;
    }

    return {
      status: 'OPEN',
      isOpen: true,
      badgeText: 'Registration Open',
      badgeVariant: 'open',
      timeRemainingText,
    };
  }

  return {
    status: 'CLOSED',
    isOpen: false,
    badgeText: 'Registration Closed',
    badgeVariant: 'closed',
  };
}

/**
 * Calculates exam duration in minutes from startTime and endTime strings (e.g. "10:00 AM" to "11:15 AM")
 */
export function calculateExamDurationMinutes(startTime?: string | null, endTime?: string | null): number {
  if (!startTime || !endTime) return 60;

  const parseTimeToMinutes = (tStr: string): number | null => {
    const raw = tStr.trim().toUpperCase();
    const match = raw.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
    if (!match) return null;

    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const meridian = match[3];

    if (meridian === 'PM' && hour < 12) hour += 12;
    if (meridian === 'AM' && hour === 12) hour = 0;

    return hour * 60 + minute;
  };

  const startMin = parseTimeToMinutes(startTime);
  const endMin = parseTimeToMinutes(endTime);

  if (startMin === null || endMin === null) return 60;

  let diff = endMin - startMin;
  if (diff < 0) diff += 24 * 60; // Crosses midnight

  return diff > 0 ? diff : 60;
}

/**
 * Formats exam duration into readable text e.g. "75 Mins"
 */
export function formatExamDuration(startTime?: string | null, endTime?: string | null): string {
  const mins = calculateExamDurationMinutes(startTime, endTime);
  return `${mins} Mins`;
}
