import { getLocale, getTranslations } from "next-intl/server";

export async function translateServer(
  word: string,
  dynamicVariables?: { [key: string]: string }
): Promise<string> {
  try {
    const t = await getTranslations();
    let translation = t(word);

    if (dynamicVariables) {
      Object.entries(dynamicVariables).forEach(([key, value]) => {
        translation = translation.replace(`{${key}}`, value);
      });
    }

    return translation !== word ? translation : word.replace(/_/g, " ");
  } catch (error) {
    return word.replace(/_/g, " ");
  }
}
