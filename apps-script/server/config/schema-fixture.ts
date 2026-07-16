/**
 * Fixture schema aligned with docs/data-dictionary.md (subset for Phase 1 tests).
 * Not loaded from live Google Sheets.
 */

export interface SheetSchema {
  sheetName: string;
  structureVersion: string;
  requiredHeaders: string[];
}

export const SCHEMA_FIXTURE: SheetSchema[] = [
  {
    sheetName: "ทะเบียนเอกสาร",
    structureVersion: "1.0.0-mock",
    requiredHeaders: [
      "รหัสเอกสาร",
      "ประเภทหนังสือ",
      "สถานะ",
      "รหัสผู้ร่าง",
      "รหัสหน่วยงาน",
      "รุ่นเนื้อหาปัจจุบัน",
      "วันเวลาสร้าง",
      "วันเวลาปรับปรุง",
    ],
  },
  {
    sheetName: "ข้อมูลบุคลากร",
    structureVersion: "1.0.0-mock",
    requiredHeaders: [
      "รหัสบุคลากร",
      "ชื่อ-นามสกุล",
      "รหัสหน่วยงาน",
      "สถานะ",
      "วันเวลานำเข้า",
    ],
  },
  {
    sheetName: "การกำหนดสิทธิ์",
    structureVersion: "1.0.0-mock",
    requiredHeaders: [
      "รหัสสิทธิ์",
      "รหัสบุคลากร",
      "บทบาท",
      "สถานะ",
      "วันเริ่ม",
    ],
  },
];

export function getSchema(sheetName: string): SheetSchema | undefined {
  return SCHEMA_FIXTURE.find((s) => s.sheetName === sheetName);
}
