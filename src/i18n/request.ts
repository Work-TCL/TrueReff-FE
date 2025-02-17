import { getUserLocale } from '@/lib/services/locale';
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async () => {
  const locale = await getUserLocale();
  console.log('locale',locale)
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});