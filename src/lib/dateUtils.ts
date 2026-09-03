/**
 * Unified Date and Registration Window Utilities for Shopner Coat
 */

/**
 * Parses any date/time string from database, ISO, or input safely.
 */
export function parseDateTime(val?: string | Date | null): Date | null {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;

  // Handle SQL datetime "YYYY-MM-DD HH:mm:ss" -> convert space to T
  const cleanStr = typeof val === 'string' ? val.trim().replace(' ', 'T') : String(val);
  const d = new Date(cleanStr);
  if (!isNaN(d.getTime())) return d;
  return null;
}

/**
 * Formats date into readable string e.g. "04 Sept 2026" or "Fri, Sep 4, 2026"
 */
export function formatExamDate(val?: string | Date | null, includeWeekday = false): string {
  if (!val) return 'Date TBA';
  const d = parseDateTime(val);
  if (!d) return String(val).split('T')[0];

  return d.toLocaleDateString('en-GB', {
    ...(includeWeekday ? { weekday: 'short' } : {}),
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formats time from date/time string or standard time string
 */
export function formatExamTime(val?: string | Date | null): string {
  if (!val) return '';
  // If already formatted like "10:00 AM"
  if (typeof val === 'string' && (val.includes('AM') || val.includes('PM'))) {
    return val.trim();
  }

  const d = parseDateTime(val);
  if (!d) return String(val);

  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Formats candidate registration window e.g.
 * - Same day: "03 Sept, 12:00 PM – 08:00 PM"
 * - Multi day: "03 Sept, 12:00 PM to 04 Sept, 08:00 PM"
 */
export function formatExamRegWindow(startIso?: string | null, endIso?: string | null): string {
  if (!endIso && !startIso) return 'Open for registration';

  const startD = parseDateTime(startIso);
  const endD = parseDateTime(endIso);

  const timeFmt = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const dateFmt = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

  if (startD && endD) {
    const isSameDay =
      startD.getFullYear() === endD.getFullYear() &&
      startD.getMonth() === endD.getMonth() &&
      startD.getDate() === endD.getDate();

    if (isSameDay) {
      return `${dateFmt(startD)}, ${timeFmt(startD)} – ${timeFmt(endD)}`;
    }
    return `${dateFmt(startD)}, ${timeFmt(startD)} to ${dateFmt(endD)}, ${timeFmt(endD)}`;
  }

  if (endD) {
    return `${dateFmt(endD)}, ${timeFmt(endD)}`;
  }

  return 'Open for registration';
}

/**
 * Formats any datetime into "YYYY-MM-DDTHH:mm" for <input type="datetime-local" />
 * Avoids unintended timezone shifts by preserving nominal local representation.
 */
export function toDateTimeLocalInput(val?: string | null): string {
  if (!val) return '';
  const clean = val.trim().replace(' ', 'T');

  // If already in YYYY-MM-DDTHH:mm format
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(clean)) {
    return clean.slice(0, 16);
  }

  const d = parseDateTime(val);
  if (!d) return '';

  const pad = (n: number) => String(n).padStart(2, '0');
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${y}-${m}-${day}T${h}:${min}`;
}

/**
 * Formats date into "YYYY-MM-DD" for <input type="date" />
 */
export function toDateInput(val?: string | null): string {
  if (!val) return '';
  const clean = val.trim().split('T')[0].split(' ')[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;

  const d = parseDateTime(val);
  if (!d) return '';

  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
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
  const now = new Date().getTime();

  const startD = parseDateTime(exam.registrationStartAt);
  const endD = parseDateTime(exam.registrationEndAt);

  const startTime = startD ? startD.getTime() : null;
  const endTime = endD ? endD.getTime() : null;

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
  if (startTime && now < startTime) {
    const opensTimeStr = formatExamTime(startD);
    const opensDateStr = formatExamDate(startD);
    const isToday = startD && new Date().toDateString() === startD.toDateString();

    return {
      status: 'BEFORE_OPEN',
      isOpen: false,
      badgeText: isToday ? `Opens Today at ${opensTimeStr}` : `Opens ${opensDateStr}`,
      badgeVariant: 'soon',
    };
  }

  // 3. If registration window has already passed
  if (endTime && now > endTime) {
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
    if (endD) {
      const isEndingToday = new Date().toDateString() === endD.toDateString();
      timeRemainingText = isEndingToday
        ? `Closes Today at ${formatExamTime(endD)}`
        : `Closes ${formatExamDate(endD)}`;
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
