import type { Role, SessionUser } from "../shared/types.js";

/**
 * Permission / session fixtures — mock only.
 * orgUnitIds define ขอบเขตหน่วยงาน; "*" = ทุกหน่วยงาน
 */
export const FIXTURE_USERS: Record<string, SessionUser> = {
  "mock-user": {
    personnelId: "MOCK-P-001",
    displayName: "สมชาย ตัวอย่าง",
    roles: ["ผู้ใช้งานทั่วไป"],
    orgUnitIds: ["MOCK-ORG-01"],
  },
  "mock-user-org2": {
    personnelId: "MOCK-P-004",
    displayName: "มานี ตัวอย่าง",
    roles: ["ผู้ใช้งานทั่วไป"],
    orgUnitIds: ["MOCK-ORG-02"],
  },
  "mock-reviewer-1": {
    personnelId: "MOCK-P-002",
    displayName: "สมหญิง ตัวอย่าง",
    roles: ["ผู้กลั่นกรองชั้นที่ 1"],
    orgUnitIds: ["MOCK-ORG-01", "MOCK-ORG-02"],
  },
  "mock-reviewer-2": {
    personnelId: "MOCK-P-003",
    displayName: "วิชัย ตัวอย่าง",
    roles: ["ผู้กลั่นกรองชั้นที่ 2"],
    orgUnitIds: ["MOCK-ORG-01"],
  },
  "mock-admin": {
    personnelId: "MOCK-P-999",
    displayName: "ผู้ดูแล ตัวอย่าง",
    roles: ["ผู้ดูแลระบบ"],
    orgUnitIds: ["*"],
  },
  "mock-auditor": {
    personnelId: "MOCK-P-100",
    displayName: "ผู้ตรวจสอบ ตัวอย่าง",
    roles: ["ผู้ตรวจสอบ"],
    orgUnitIds: ["*"],
  },
};

export function canAccessOrg(user: SessionUser, orgUnitId: string): boolean {
  if (user.orgUnitIds.includes("*")) {
    return true;
  }
  return user.orgUnitIds.includes(orgUnitId);
}

export function primaryRole(user: SessionUser): Role {
  return user.roles[0] ?? "ผู้ใช้งานทั่วไป";
}
