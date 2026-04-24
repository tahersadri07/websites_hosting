import { getRequestConfig } from "next-intl/server";

// next-intl v4: getRequestConfig callback receives { requestLocale } and must
// return { locale, messages } — locale is a required field in RequestConfig.
export default getRequestConfig(async ({ requestLocale }) => {
    const locale = (await requestLocale) ?? "en";
    const messages = (await import(`../../messages/${locale}.json`)).default;
    return { locale, messages };
});
