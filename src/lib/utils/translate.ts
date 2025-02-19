import { useTranslations } from 'next-intl';
import { formatKey } from "./commonUtils";

// Prevent duplicate API calls for missing translations
const missingTranslations = new Set<string>();

function addIfNotExist(key: string, word: string) {
  if (!missingTranslations.has(key) && process.env.NODE_ENV === 'development') {
    missingTranslations.add(key);
    const BASE_URL = process.env.FRONTEND_URL || "http://localhost:3000"
    // Ensure the API URL is correctly formatted
    const apiUrl = `${BASE_URL}/api/add-translation`;

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: key,
        value: word, // Placeholder
      }),
    }).catch((error) => console.error("Error adding translation:", error));
  }
}

export function translate(
  tKey: string,
  word?: string,
  dynamicVariables?: { [key: string]: string }
): string {
  const key = formatKey(tKey)
  const t = useTranslations();
  if (!word) {
    word = tKey
  }
  try {
    let translation = t(key);

    if (translation === key) {
      // addIfNotExist(key, word)
      return word.replace(/_/g, ' ')
    }

    if (dynamicVariables) {
      Object.entries(dynamicVariables).forEach((variable) => {
        translation = translation.replace(`{${variable[0]}}`, variable[1]);
      });
    }
    return translation
  } catch (error) {
    // addIfNotExist(key, word)
    return word.replace(/_/g, ' ');
  }
}