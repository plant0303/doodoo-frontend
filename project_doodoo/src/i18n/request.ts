import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'ko', 'ja'];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  const finalLocale =
    locale && locales.includes(locale)
      ? locale
      : 'en';

  return {
    locale: finalLocale,
    messages: (
      await import(`../messages/${finalLocale}.json`)
    ).default
  };
});