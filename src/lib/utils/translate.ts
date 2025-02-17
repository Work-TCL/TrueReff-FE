import { useTranslations } from 'next-intl';

// Prevent duplicate API calls for missing translations
const missingTranslations = new Set<string>();

function addIfNotExist(word: string) {
  if (!missingTranslations.has(word) && process.env.NODE_ENV === 'development') {
    missingTranslations.add(word);
    const BASE_URL = process.env.FRONTEND_URL || "http://localhost:3000"
    // Ensure the API URL is correctly formatted
    const apiUrl = `${BASE_URL}/api/add-translation`;

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: word,
        value: word, // Placeholder
      }),
    }).catch((error) => console.error("Error adding translation:", error));
  }
}

export function translate(
  word: string,
  dynamicVariables?: { [key: string]: string }
): string {
  const t = useTranslations();

  try {
    let translation = t(word);

    if (translation === word) {
      addIfNotExist(word)
      return word.replace(/_/g, ' ')
    }

    if (dynamicVariables) {
      Object.entries(dynamicVariables).forEach((variable) => {
        translation = translation.replace(`{${variable[0]}}`, variable[1]);
      });
    }
    return translation
  } catch (error) {
    addIfNotExist(word)
    return word.replace(/_/g, ' ');
  }
}