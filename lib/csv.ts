export type CsvRecord = Record<string, string>;

function normalizeHeader(value: string) {
	return value.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

export function parseCsv(text: string): string[][] {
	const rows: string[][] = [];
	let currentRow: string[] = [];
	let currentValue = "";
	let inQuotes = false;

	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];
		const nextChar = text[index + 1];

		if (char === '"') {
			if (inQuotes && nextChar === '"') {
				currentValue += '"';
				index += 1;
				continue;
			}

			inQuotes = !inQuotes;
			continue;
		}

		if (char === "," && !inQuotes) {
			currentRow.push(currentValue.trim());
			currentValue = "";
			continue;
		}

		if ((char === "\n" || char === "\r") && !inQuotes) {
			if (char === "\r" && nextChar === "\n") {
				index += 1;
			}

			currentRow.push(currentValue.trim());
			if (currentRow.some((value) => value.length > 0)) {
				rows.push(currentRow);
			}
			currentRow = [];
			currentValue = "";
			continue;
		}

		currentValue += char;
	}

	if (currentValue.length > 0 || currentRow.length > 0) {
		currentRow.push(currentValue.trim());
		if (currentRow.some((value) => value.length > 0)) {
			rows.push(currentRow);
		}
	}

	return rows;
}

export function csvRowsToRecords(rows: string[][]): CsvRecord[] {
	if (rows.length === 0) return [];

	const [rawHeaders, ...dataRows] = rows;
	const headers = rawHeaders.map(normalizeHeader);

	return dataRows.map((row) => {
		const record: CsvRecord = {};

		headers.forEach((header, index) => {
			record[header] = row[index]?.trim() ?? "";
		});

		return record;
	});
}

export function getCsvValue(
	record: CsvRecord,
	headers: string[],
): string | undefined {
	for (const header of headers) {
		const value = record[normalizeHeader(header)];
		if (value) return value;
	}

	return undefined;
}
