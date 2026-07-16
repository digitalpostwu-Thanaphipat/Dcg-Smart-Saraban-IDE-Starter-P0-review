import type { SheetRow } from "../shared/types.js";
import type { SheetGateway } from "./sheet-gateway.js";

export class FakeSheetGateway implements SheetGateway {
  private readonly store: Map<string, { headers: string[]; rows: SheetRow[] }>;

  constructor(initial?: Record<string, { headers: string[]; rows: SheetRow[] }>) {
    this.store = new Map();
    if (initial) {
      for (const [name, data] of Object.entries(initial)) {
        this.store.set(name, {
          headers: [...data.headers],
          rows: data.rows.map((r) => ({ ...r })),
        });
      }
    }
  }

  setSheet(sheetName: string, headers: string[], rows: SheetRow[]): void {
    this.store.set(sheetName, {
      headers: [...headers],
      rows: rows.map((r) => ({ ...r })),
    });
  }

  getHeaders(sheetName: string): string[] {
    const sheet = this.store.get(sheetName);
    if (!sheet) {
      throw new Error(`ไม่พบชีตจำลอง: ${sheetName}`);
    }
    return [...sheet.headers];
  }

  readAll(sheetName: string): SheetRow[] {
    const sheet = this.store.get(sheetName);
    if (!sheet) {
      throw new Error(`ไม่พบชีตจำลอง: ${sheetName}`);
    }
    return sheet.rows.map((r) => ({ ...r }));
  }

  getCell(
    sheetName: string,
    rowIndex: number,
    headerName: string,
  ): string | number | boolean | null {
    const sheet = this.store.get(sheetName);
    if (!sheet) {
      throw new Error(`ไม่พบชีตจำลอง: ${sheetName}`);
    }
    if (!sheet.headers.includes(headerName)) {
      throw new Error(`ไม่พบหัวคอลัมน์: ${headerName}`);
    }
    const row = sheet.rows[rowIndex];
    if (!row) {
      throw new Error(`ไม่พบแถวที่ ${rowIndex}`);
    }
    return row[headerName] ?? null;
  }
}
