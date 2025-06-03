import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "../store/auth-user";

interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface ValidationError {
  errors?: { [key: string]: string };
}

interface GenericError {
  message?: string;
  error?: string;
}

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.data?.message) {
      return axiosError?.response?.data?.message || "internal server error";
    }

    const genericError = error as GenericError;
    if (genericError.message) {
      return genericError.message;
    } else if (genericError.error) {
      return genericError.error;
    }

    const validationError = error as ValidationError;
    if (validationError.errors) {
      return Object.values(validationError.errors).join(", ");
    }
  } else if (error instanceof Error) {
    return error.message;
  } else if (typeof error === "string") {
    return error;
  }

  return "Internal server error";
};

export const getFirstLetterOfFirstName = (name: string | undefined): string => {
  if (!name || name.trim() === "") {
    return "";
  }
  return name.trim().charAt(0).toUpperCase();
};

// Function to generate consistent keys
export const formatKey = (text: string): string => {
  return text
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/[^\w]/g, "")
    .trim(); // Remove special characters
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTo12Hour(timeString: string) {
  const date = new Date(timeString);
  let hours = date.getHours();
  let minutes: any = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
  minutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero if needed

  return `${hours}:${minutes}${ampm}`;
}

export const getToken = () => {
  return useAuthStore.getState().token;
};

export function formatForDateInput(isoString: string): string {
  const d = new Date(isoString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function clearLocalStorage() {
  const removeItems = ["vendor-storage", "user-storage", "creator-storage"];
  removeItems.forEach((key) => localStorage.removeItem(key));
}

export function formatFollowers(count: number = 0) {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return count.toString();
}
