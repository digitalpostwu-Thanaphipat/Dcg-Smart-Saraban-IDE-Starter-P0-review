/** Shared types for mock backend (Phase 1–2). */

export type Role =
  | "ผู้ใช้งานทั่วไป"
  | "ผู้กลั่นกรองชั้นที่ 1"
  | "ผู้กลั่นกรองชั้นที่ 2"
  | "ผู้ดูแลระบบ"
  | "ผู้ตรวจสอบ";

/**
 * Session user from fixture (not Google Workspace).
 * orgUnitIds: หน่วยงานที่เข้าถึงได้; "*" = ทุกหน่วยงาน (เช่น ผู้ดูแล)
 */
export interface SessionUser {
  personnelId: string;
  displayName: string;
  roles: Role[];
  orgUnitIds: string[];
}

export type SheetRow = Record<string, string | number | boolean | null>;
