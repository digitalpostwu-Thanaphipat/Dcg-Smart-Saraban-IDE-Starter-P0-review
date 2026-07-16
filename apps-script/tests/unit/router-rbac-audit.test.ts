import { describe, expect, it } from "vitest";
import { createRouter, InMemoryAuditLog } from "../../server/entry/router.js";

describe("router RBAC + audit", () => {
  it("listDocumentsInOrg ปฏิเสธหน่วยงานนอกขอบเขตและมี audit", () => {
    const audit = new InMemoryAuditLog();
    const handle = createRouter({ audit });
    const res = handle({
      action: "listDocumentsInOrg",
      sessionToken: "mock-user",
      payload: { orgUnitId: "MOCK-ORG-02" },
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.messageTh).toContain("หน่วยงาน");
    }
    expect(audit.findByEventType("ปฏิเสธสิทธิ์").length).toBeGreaterThanOrEqual(1);
  });

  it("listDocumentsInOrg ผ่านเมื่ออยู่ในขอบเขต", () => {
    const audit = new InMemoryAuditLog();
    const handle = createRouter({ audit });
    const res = handle({
      action: "listDocumentsInOrg",
      sessionToken: "mock-user",
      payload: { orgUnitId: "MOCK-ORG-01" },
    });
    expect(res.ok).toBe(true);
    expect(audit.findByEventType("อ่านรายการเอกสาร").length).toBeGreaterThanOrEqual(1);
  });

  it("mockChangeDocumentStatus บันทึก before/after", () => {
    const audit = new InMemoryAuditLog();
    const handle = createRouter({ audit });
    const res = handle({
      action: "mockChangeDocumentStatus",
      sessionToken: "mock-reviewer-1",
      payload: {
        documentId: "DOC-MOCK-001",
        status: "รอส่ง",
        orgUnitId: "MOCK-ORG-01",
      },
    });
    expect(res.ok).toBe(true);
    const changes = audit.findByEventType("เปลี่ยนสถานะเอกสารจำลอง");
    expect(changes.length).toBe(1);
    expect(changes[0]?.beforeValue).toBe("ร่าง");
    expect(changes[0]?.afterValue).toBe("รอส่ง");
  });
});
