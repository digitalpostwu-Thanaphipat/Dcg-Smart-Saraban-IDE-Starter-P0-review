import { getSchema } from "../config/schema-fixture.js";
import type { SheetRow } from "../shared/types.js";
import { validationError, type ApiResult, ok } from "../shared/result.js";
import type { SheetGateway } from "./sheet-gateway.js";
import { validateHeaders } from "./schema-validator.js";

const SHEET = "ทะเบียนเอกสาร";

/**
 * Repository reads by Thai header names via gateway — never row[index].
 */
export class DocumentRepository {
  constructor(private readonly gateway: SheetGateway) {}

  listDocuments(): ApiResult<SheetRow[]> {
    const schema = getSchema(SHEET);
    if (!schema) {
      return validationError("ไม่พบโครงสร้างชีตทะเบียนเอกสารใน schema fixture");
    }

    const headers = this.gateway.getHeaders(SHEET);
    const check = validateHeaders(headers, schema);
    if (!check.valid) {
      return validationError(
        `โครงสร้างชีตไม่ตรงตาม Data Contract: ${check.issues.join("; ")}`,
      );
    }

    const rows = this.gateway.readAll(SHEET);
    // Demonstrate name-based access (not column index)
    const projected = rows.map((row) => ({
      รหัสเอกสาร: row["รหัสเอกสาร"] ?? null,
      ประเภทหนังสือ: row["ประเภทหนังสือ"] ?? null,
      สถานะ: row["สถานะ"] ?? null,
      รหัสผู้ร่าง: row["รหัสผู้ร่าง"] ?? null,
    }));

    return ok(projected);
  }

  getDocumentIdByName(rowIndex: number): ApiResult<string> {
    try {
      const value = this.gateway.getCell(SHEET, rowIndex, "รหัสเอกสาร");
      if (value === null || value === "") {
        return validationError("ไม่พบรหัสเอกสารในแถวที่ระบุ");
      }
      return ok(String(value));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "อ่านข้อมูลไม่สำเร็จ";
      return validationError(msg);
    }
  }
}
