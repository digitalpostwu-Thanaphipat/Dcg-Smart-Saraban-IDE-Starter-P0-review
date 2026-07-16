import { describe, expect, it } from "vitest";
import { requireAuth, requireRole } from "../../server/auth/require-auth.js";

describe("requireAuth / requireRole (จำลอง)", () => {
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
    }
  });
});
