import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getEnvVar = (name: string): string => {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
};
