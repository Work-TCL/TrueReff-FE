
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
    if (typeof error === 'object' && error !== null) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.data?.message) {
            return axiosError?.response?.data?.message || 'internal server error';
        }

        const genericError = error as GenericError;
        if (genericError.message) {
            return genericError.message;
        } else if (genericError.error) {
            return genericError.error;
        }

        const validationError = error as ValidationError;
        if (validationError.errors) {
            return Object.values(validationError.errors).join(', ');
        }
    } else if (error instanceof Error) {
        return error.message;
    } else if (typeof error === 'string') {
        return error;
    }

    return 'Internal server error';
}

export const getFirstLetterOfFirstName = (name: string | undefined): string => {
    if (!name || name.trim() === '') {
        return '';
    }
    return name.trim().charAt(0).toUpperCase();
}


// Function to generate consistent keys
export const formatKey = (text: string): string => {
    return text
        .toLowerCase() // Convert to lowercase
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .replace(/[^\w]/g, '').trim(); // Remove special characters
};

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
