import { useTranslations } from 'next-intl';

// This function can be used to fetch translations
export function translate(
  word: string,
  dynamicVariables?: { [key: string]: string }
): string {
  const t = useTranslations();

  try {
    let translation = t(word);
    if (dynamicVariables) {
      Object.entries(dynamicVariables).forEach((variable) => {
        translation = translation.replace(`{${variable[0]}}`, variable[1]);
      });
    }
    return translation !== word ? translation : word.replace(/_/g, ' ');
  } catch (error) {
    return word.replace(/_/g, ' ');
  }
}