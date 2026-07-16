import type { ApiResult } from "../shared/result.js";
import { ok, validationError } from "../shared/result.js";

/**
 * Mock personnel source only (ADR-01 Phase 1 condition).
 * Do NOT connect to central HR / Workspace / real sheets here.
 */
export interface PersonnelSnapshot {
  personnelId: string;
  fullName: string;
  orgUnitId: string;
  status: string;
}

const MOCK_PERSONNEL: PersonnelSnapshot[] = [
  {
    personnelId: "MOCK-P-001",
    fullName: "สมชาย ตัวอย่าง",
    orgUnitId: "MOCK-ORG-01",
    status: "ปฏิบัติงาน",
  },
  {
    personnelId: "MOCK-P-002",
    fullName: "สมหญิง ตัวอย่าง",
    orgUnitId: "MOCK-ORG-02",
    status: "ปฏิบัติงาน",
  },
];

export interface PersonnelSource {
  findById(personnelId: string): ApiResult<PersonnelSnapshot>;
  listAll(): ApiResult<PersonnelSnapshot[]>;
}

export class MockPersonnelSource implements PersonnelSource {
  findById(personnelId: string): ApiResult<PersonnelSnapshot> {
    const found = MOCK_PERSONNEL.find((p) => p.personnelId === personnelId);
    if (!found) {
      return validationError("ไม่พบรหัสบุคลากรในข้อมูลจำลอง");
    }
    return ok({ ...found });
  }

  listAll(): ApiResult<PersonnelSnapshot[]> {
    return ok(MOCK_PERSONNEL.map((p) => ({ ...p })));
  }
}
