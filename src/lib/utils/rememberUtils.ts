import CryptoJS from "crypto-js";

const SECRET_KEY =
  process.env.NEXT_PUBLIC_REMEMBER_ME_SECRET ||
  "dsvcfsdnby8ysg6GUFYUGIUBJ15652cbbyHYG7";
const STORAGE_KEY = "rememberedLogin";

/**
 * Save email and password securely to localStorage
 */
export const saveRememberedUser = (email: string, password: string) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify({ email, password }),
    SECRET_KEY
  ).toString();
  localStorage.setItem(STORAGE_KEY, encrypted);
};

/**
 * Retrieve remembered email and password
 */
export const getRememberedUser = (): {
  email: string;
  password: string;
} | null => {
  const encrypted = localStorage.getItem(STORAGE_KEY);
  if (!encrypted) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (err) {
    console.error("Error decrypting remembered user:", err);
    return null;
  }
};

/**
 * Clear remembered credentials
 */
export const clearRememberedUser = () => {
  localStorage.removeItem(STORAGE_KEY);
};
