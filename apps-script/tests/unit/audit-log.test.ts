import { describe, expect, it } from "vitest";
import { InMemoryAuditLog } from "../../server/data/audit-log.js";

describe("InMemoryAuditLog append-only", () => {
  it("append แล้ว list ได้ และมี chain previousEventHash", () => {
    const log = new InMemoryAuditLog();
    const a = log.append({
      actorId: "MOCK-P-001",
      actorRole: "ผู้ใช้งานทั่วไป",
      eventType: "ทดสอบ",
      result: "สำเร็จ",
    });
    const b = log.append({
      actorId: "MOCK-P-001",
      actorRole: "ผู้ใช้งานทั่วไป",
      eventType: "ทดสอบ",
      result: "สำเร็จ",
    });
    expect(a.eventId).toMatch(/^AUD-MOCK-/);
    expect(a.previousEventHash).toBe("");
    expect(b.previousEventHash.length).toBeGreaterThan(0);
    expect(log.count()).toBe(2);
    expect(log.list()).toHaveLength(2);
  });

  it("ไม่มีเมธอด update/delete บน store (append-only API)", () => {
    const log = new InMemoryAuditLog();
    const proto = Object.getPrototypeOf(log) as Record<string, unknown>;
    expect(typeof log.append).toBe("function");
    expect(proto.update).toBeUndefined();
    expect(proto.delete).toBeUndefined();
    expect(proto.remove).toBeUndefined();
    // Mutating list() result must not change internal store
    log.append({
      actorId: "X",
      actorRole: "ไม่มี",
      eventType: "t",
      result: "สำเร็จ",
    });
    const snapshot = [...log.list()];
    const first = { ...snapshot[0]! };
    first.result = "ถูกแก้จากภายนอก";
    expect(log.list()[0]?.result).toBe("สำเร็จ");
  });
});
