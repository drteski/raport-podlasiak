import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const colorize = (items: string[]): Record<string, string | undefined> => {
	const colors = ['#FFE2E2', '#ECFCCA', '#DFF2FE', '#F3E8FF', '#FEF3C6'];
	const result: Record<string, string | undefined> = {};
	let i = 0;
	for (const item of items) {
		result[item] = colors[i];
		if (i === colors.length - 1) i = 0;
		else i++;
	}

	return result;
};
