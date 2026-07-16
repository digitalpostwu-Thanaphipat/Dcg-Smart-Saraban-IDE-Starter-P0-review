import type { SheetRow } from "../shared/types.js";

/**
 * Abstract sheet access — only the data layer talks to storage.
 * Phase 1 uses FakeSheetGateway only (no SpreadsheetApp).
 */
export interface SheetGateway {
  getHeaders(sheetName: string): string[];
  readAll(sheetName: string): SheetRow[];
  /** Read field by Thai header name, never by column index. */
  getCell(sheetName: string, rowIndex: number, headerName: string): string | number | boolean | null;
}
