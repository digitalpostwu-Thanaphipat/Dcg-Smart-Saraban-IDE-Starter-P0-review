import type { Role, SessionUser } from "../shared/types.js";
import type { ApiResult } from "../shared/result.js";
import { forbidden, ok, unauthorized } from "../shared/result.js";
import { canAccessOrg, FIXTURE_USERS, primaryRole } from "./permission-fixture.js";
import type { InMemoryAuditLog } from "../data/audit-log.js";

export type RequireRoleOptions = {
  /** ถ้าระบุ ต้องมีสิทธิ์เข้าถึงหน่วยงานนี้ */
  orgUnitId?: string;
  /** บันทึก audit เมื่อสำเร็จ/ล้มเหลว (ถ้ามี store) */
  audit?: InMemoryAuditLog;
  action?: string;
};

export function resolveMockSession(sessionToken: string | undefined): ApiResult<SessionUser> {
  if (!sessionToken || sessionToken.trim() === "") {
    return unauthorized("กรุณาเข้าสู่ระบบก่อนใช้งาน");
  }
  const user = FIXTURE_USERS[sessionToken];
  if (!user) {
    return unauthorized("เซสชันไม่ถูกต้องหรือหมดอายุ (โหมดจำลอง)");
  }
  return ok({ ...user, roles: [...user.roles], orgUnitIds: [...user.orgUnitIds] });
}

/**
 * เข้าสู่ระบบจำลอง — บันทึก audit สำเร็จ/ล้มเหลว
 */
export function mockLogin(
  sessionToken: string | undefined,
  audit?: InMemoryAuditLog,
): ApiResult<SessionUser> {
  const result = resolveMockSession(sessionToken);
  if (audit) {
    if (result.ok) {
      audit.append({
        actorId: result.data.personnelId,
        actorRole: primaryRole(result.data),
        eventType: "เข้าสู่ระบบจำลอง",
        result: "สำเร็จ",
        relatedInfo: `token=${sessionToken ?? ""}`,
      });
    } else {
      audit.append({
        actorId: sessionToken?.trim() ? sessionToken : "ไม่ระบุ",
        actorRole: "ไม่มี",
        eventType: "เข้าสู่ระบบจำลอง",
        result: "ล้มเหลว",
        relatedInfo: result.messageTh,
      });
    }
  }
  return result;
}

export function requireAuth(
  sessionToken: string | undefined,
  options?: { audit?: InMemoryAuditLog; action?: string },
): ApiResult<SessionUser> {
  const result = resolveMockSession(sessionToken);
  if (!result.ok && options?.audit) {
    options.audit.append({
      actorId: sessionToken?.trim() ? sessionToken : "ไม่ระบุ",
      actorRole: "ไม่มี",
      eventType: "ปฏิเสธสิทธิ์",
      result: "ล้มเหลว",
      relatedInfo: options.action
        ? `${options.action}: ${result.messageTh}`
        : result.messageTh,
    });
  }
  return result;
}

/**
 * ตรวจบทบาท + ขอบเขตหน่วยงาน (fixture) ฝั่ง Backend
 */
export function requireRole(
  sessionToken: string | undefined,
  allowed: Role[],
  options?: RequireRoleOptions,
): ApiResult<SessionUser> {
  const auth = resolveMockSession(sessionToken);
  if (!auth.ok) {
    if (options?.audit) {
      options.audit.append({
        actorId: sessionToken?.trim() ? sessionToken : "ไม่ระบุ",
        actorRole: "ไม่มี",
        eventType: "ปฏิเสธสิทธิ์",
        result: "ล้มเหลว",
        relatedInfo: options.action
          ? `${options.action}: ${auth.messageTh}`
          : auth.messageTh,
      });
    }
    return auth;
  }

  const user = auth.data;
  const hasRole = user.roles.some((r) => allowed.includes(r));
  if (!hasRole) {
    const messageTh = `ต้องการบทบาท: ${allowed.join(" หรือ ")} — บัญชีนี้ไม่มีสิทธิ์ทำรายการ`;
    if (options?.audit) {
      options.audit.append({
        actorId: user.personnelId,
        actorRole: primaryRole(user),
        eventType: "ปฏิเสธสิทธิ์",
        result: "ล้มเหลว",
        relatedInfo: options.action ? `${options.action}: ${messageTh}` : messageTh,
        recordId: options.orgUnitId ?? "",
      });
    }
    return forbidden(messageTh);
  }

  if (options?.orgUnitId && !canAccessOrg(user, options.orgUnitId)) {
    const messageTh = `คุณไม่มีสิทธิ์เข้าถึงหน่วยงาน ${options.orgUnitId}`;
    if (options.audit) {
      options.audit.append({
        actorId: user.personnelId,
        actorRole: primaryRole(user),
        eventType: "ปฏิเสธสิทธิ์",
        result: "ล้มเหลว",
        relatedInfo: options.action ? `${options.action}: ${messageTh}` : messageTh,
        recordId: options.orgUnitId,
      });
    }
    return forbidden(messageTh);
  }

  return ok(user);
}
