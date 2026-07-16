/** Shared domain-ish types for Phase 1 mock scaffold. */

export type Role =
  | "ผู้ใช้งานทั่วไป"
  | "ผู้กลั่นกรองชั้นที่ 1"
  | "ผู้กลั่นกรองชั้นที่ 2"
  | "ผู้ดูแลระบบ"
  | "ผู้ตรวจสอบ";

export interface SessionUser {
  personnelId: string;
  displayName: string;
  roles: Role[];
}

export type SheetRow = Record<string, string | number | boolean | null>;
