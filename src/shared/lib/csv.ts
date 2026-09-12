/**
 * RFC 4180 compliant CSV parser and generator with UTF-8 BOM for Excel compatibility.
 */

export interface CsvColumn<T> {
  key: string;
  header: string;
  format?: (row: T) => string | number | boolean | null | undefined;
}

/**
 * Escapes a single CSV cell value according to RFC 4180:
 * - Wrap with double quotes if it contains comma, double quote, or newline (\r, \n)
 * - Double up any double quotes (" -> "")
 */
export function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  const str = String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Converts an array of objects into a CSV string with UTF-8 BOM (\uFEFF)
 * for perfect rendering in Microsoft Excel (Windows/Mac) and other spreadsheet software.
 */
export function generateCsv<T>(data: T[], columns: CsvColumn<T>[]): string {
  const BOM = "\uFEFF";
  const headerRow = columns.map((col) => escapeCsvCell(col.header)).join(",");
  const dataRows = data.map((item) =>
    columns
      .map((col) => {
        const val = col.format ? col.format(item) : (item as Record<string, unknown>)[col.key];
        return escapeCsvCell(val);
      })
      .join(",")
  );

  return `${BOM}${headerRow}\r\n${dataRows.join("\r\n")}\r\n`;
}

/**
 * Parses raw CSV text into a 2D array of string cells.
 * Supports:
 * - RFC 4180 quoted strings with escaped quotes ("")
 * - Multiline cells with newlines inside quotes
 * - Automatically strips UTF-8 BOM if present
 * - Handles both CRLF (\r\n) and LF (\n)
 */
export function parseCsv(csvText: string): string[][] {
  let cleanText = csvText;
  if (cleanText.charCodeAt(0) === 0xfeff) {
    cleanText = cleanText.slice(1);
  }

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;
  let i = 0;
  const len = cleanText.length;

  while (i < len) {
    const char = cleanText[i];
    const nextChar = i + 1 < len ? cleanText[i + 1] : "";

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote
          currentCell += '"';
          i += 2;
          continue;
        } else {
          // Closing quote
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        currentCell += char;
        i++;
        continue;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
        continue;
      } else if (char === ",") {
        currentRow.push(currentCell.trim());
        currentCell = "";
        i++;
        continue;
      } else if (char === "\r") {
        if (nextChar === "\n") {
          i++;
        }
        currentRow.push(currentCell.trim());
        currentCell = "";
        rows.push(currentRow);
        currentRow = [];
        i++;
        continue;
      } else if (char === "\n") {
        currentRow.push(currentCell.trim());
        currentCell = "";
        rows.push(currentRow);
        currentRow = [];
        i++;
        continue;
      } else {
        currentCell += char;
        i++;
        continue;
      }
    }
  }

  // Final cell and row if text didn't end with a trailing newline
  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }

  // Filter out completely empty trailing lines
  return rows.filter((row) => row.some((cell) => cell.length > 0));
}

/**
 * Converts parsed CSV rows into an array of objects mapped by header names (normalized).
 */
export function csvRowsToObjects(rows: string[][]): Record<string, string>[] {
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const result: Record<string, string>[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const obj: Record<string, string> = {};
    let hasValue = false;

    headers.forEach((header, colIndex) => {
      const val = row[colIndex] ?? "";
      obj[header] = val;
      if (val.trim()) hasValue = true;
    });

    if (hasValue) {
      result.push(obj);
    }
  }

  return result;
}
