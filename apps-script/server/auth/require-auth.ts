import type { Role, SessionUser } from "../shared/types.js";
import type { ApiResult } from "../shared/result.js";
import { forbidden, ok, unauthorized } from "../shared/result.js";

/** Fixture sessions for mock scaffold — not Google Workspace. */
const FIXTURE_USERS: Record<string, SessionUser> = {
  "mock-user": {
    personnelId: "MOCK-P-001",
    displayName: "สมชาย ตัวอย่าง",
    roles: ["ผู้ใช้งานทั่วไป"],
  },
  "mock-reviewer-1": {
    personnelId: "MOCK-P-002",
    displayName: "สมหญิง ตัวอย่าง",
    roles: ["ผู้กลั่นกรองชั้นที่ 1"],
  },
  "mock-reviewer-2": {
    personnelId: "MOCK-P-003",
    displayName: "วิชัย ตัวอย่าง",
    roles: ["ผู้กลั่นกรองชั้นที่ 2"],
  },
  "mock-admin": {
    personnelId: "MOCK-P-999",
    displayName: "ผู้ดูแล ตัวอย่าง",
    roles: ["ผู้ดูแลระบบ"],
  },
};

export function resolveMockSession(sessionToken: string | undefined): ApiResult<SessionUser> {
  if (!sessionToken || sessionToken.trim() === "") {
    return unauthorized("กรุณาเข้าสู่ระบบก่อนใช้งาน");
  }
  const user = FIXTURE_USERS[sessionToken];
  if (!user) {
    return unauthorized("เซสชันไม่ถูกต้องหรือหมดอายุ (โหมดจำลอง)");
  }
  return ok(user);
}

export function requireAuth(sessionToken: string | undefined): ApiResult<SessionUser> {
  return resolveMockSession(sessionToken);
}

export function requireRole(
  sessionToken: string | undefined,
  allowed: Role[],
): ApiResult<SessionUser> {
  const auth = requireAuth(sessionToken);
  if (!auth.ok) {
    return auth;
  }
  const hasRole = auth.data.roles.some((r) => allowed.includes(r));
  if (!hasRole) {
    return forbidden(
      `ต้องการบทบาท: ${allowed.join(" หรือ ")} — บัญชีนี้ไม่มีสิทธิ์ทำรายการ`,
    );
  }
  return auth;
}
