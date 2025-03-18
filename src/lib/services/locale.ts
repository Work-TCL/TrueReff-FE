// 'use server';
// import {cookies} from 'next/headers';
import {Locale, defaultLocale} from '../../i18n/config';

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale() {
    // const cookieStore = await cookies(); // Await the cookies promise
  // return cookieStore.get(COOKIE_NAME)?.value ||defaultLocale
  return defaultLocale;
}

export async function setUserLocale(locale: Locale) {
    // const cookieStore = await cookies(); // Await the cookies promise
    // cookieStore.set(COOKIE_NAME, locale);
    return defaultLocale;
}