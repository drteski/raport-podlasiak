export const cleanText = (text: string): string => {
	if (!text) {
		return '';
	}

	return text
		.split('\n')
		.map((line) => line.replace(/\s+/g, ' ').trim())
		.filter((line) => line !== '')
		.join('\n');
};
