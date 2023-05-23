import { LOCALE } from '../i18n/translate';

type Presets = Record<string, Intl.DateTimeFormatOptions>;

let presets: Presets = {
  medium: { year: 'numeric', month: 'short', day: 'numeric' },
  short: { year: 'numeric', month: '2-digit', day: '2-digit' },
};

let presetTime: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
};

type DateFormat = keyof typeof presets;

export function formatDateTime(
  dateString: string,
  format: DateFormat = 'medium',
  time?: boolean,
  locale: string = LOCALE,
): string {
  let date = new Date(dateString);

  if (isNaN(date.getDate())) {
    return '';
  }

  // This only happens during testing. Feel free to dig in further to find a more
  // proper fix.
  const normalizedLocale = locale === 'mock' ? 'en-US' : locale;

  return date.toLocaleString(normalizedLocale, {
    ...presets[format],
    ...(time && presetTime),
  });
}
