import { describe, expect, it } from "vitest";
import { mockLogin, requireAuth, requireRole } from "../../server/auth/require-auth.js";
import { InMemoryAuditLog } from "../../server/data/audit-log.js";

describe("requireAuth / requireRole (RBAC จำลอง)", () => {
  it("ปฏิเสธเมื่อไม่มีเซสชัน — ข้อความภาษาไทย", () => {
    const result = requireAuth(undefined);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("UNAUTHORIZED");
      expect(result.messageTh.length).toBeGreaterThan(0);
      expect(result.messageTh).toMatch(/เข้าสู่ระบบ|เซสชัน|สิทธิ์/);
    }
  });

  it("ปฏิเสธบทบาทผิดเมื่อเรียก requireRole", () => {
    const result = requireRole("mock-user", ["ผู้กลั่นกรองชั้นที่ 2"]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("FORBIDDEN");
      expect(result.messageTh).toContain("บทบาท");
    }
  });

  it("อนุญาตเมื่อบทบาทตรง", () => {
    const result = requireRole("mock-reviewer-2", ["ผู้กลั่นกรองชั้นที่ 2"]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.roles).toContain("ผู้กลั่นกรองชั้นที่ 2");
      expect(result.data.orgUnitIds.length).toBeGreaterThan(0);
    }
  });

  it("ปฏิเสธเมื่อหน่วยงานนอกขอบเขต", () => {
    const result = requireRole("mock-user", ["ผู้ใช้งานทั่วไป"], {
      orgUnitId: "MOCK-ORG-02",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("FORBIDDEN");
      expect(result.messageTh).toContain("หน่วยงาน");
    }
  });

  it("อนุญาตหน่วยงานในขอบเขต", () => {
    const result = requireRole("mock-user", ["ผู้ใช้งานทั่วไป"], {
      orgUnitId: "MOCK-ORG-01",
    });
    expect(result.ok).toBe(true);
  });

  it("ผู้ดูแลเข้าถึงทุกหน่วยงานด้วย *", () => {
    const result = requireRole("mock-admin", ["ผู้ดูแลระบบ"], {
      orgUnitId: "MOCK-ORG-99",
    });
    expect(result.ok).toBe(true);
  });

  it("บันทึก audit เมื่อปฏิเสธสิทธิ์", () => {
    const audit = new InMemoryAuditLog();
    requireRole("mock-user", ["ผู้กลั่นกรองชั้นที่ 2"], {
      audit,
      action: "ทดสอบปฏิเสธ",
    });
    const denied = audit.findByEventType("ปฏิเสธสิทธิ์");
    expect(denied.length).toBeGreaterThanOrEqual(1);
    expect(denied[0]?.result).toBe("ล้มเหลว");
    expect(denied[0]?.relatedInfo).toContain("ทดสอบปฏิเสธ");
  });

  it("login จำลองสำเร็จและล้มเหลวมี audit", () => {
    const audit = new InMemoryAuditLog();
    const okLogin = mockLogin("mock-user", audit);
    expect(okLogin.ok).toBe(true);
    const badLogin = mockLogin("token-ไม่มีจริง", audit);
    expect(badLogin.ok).toBe(false);
    const events = audit.findByEventType("เข้าสู่ระบบจำลอง");
    expect(events.some((e) => e.result === "สำเร็จ")).toBe(true);
    expect(events.some((e) => e.result === "ล้มเหลว")).toBe(true);
  });
});
