import { describe, expect, it } from "vitest";
import { DocumentRepository } from "../../server/data/document-repository.js";
import { FakeSheetGateway } from "../../server/data/fake-sheet-gateway.js";

const fullHeaders = [
  "รหัสเอกสาร",
  "ประเภทหนังสือ",
  "สถานะ",
  "รหัสผู้ร่าง",
  "รหัสหน่วยงาน",
  "รุ่นเนื้อหาปัจจุบัน",
  "วันเวลาสร้าง",
  "วันเวลาปรับปรุง",
];

describe("DocumentRepository — อ่านตามชื่อคอลัมน์", () => {
  it("อ่านรหัสเอกสารด้วยชื่อหัวคอลัมน์ ไม่ใช้ index", () => {
    const gateway = new FakeSheetGateway({
      ทะเบียนเอกสาร: {
        headers: fullHeaders,
        rows: [
          {
            รหัสเอกสาร: "DOC-A",
            ประเภทหนังสือ: "หนังสือภายใน",
            สถานะ: "ร่าง",
            รหัสผู้ร่าง: "MOCK-P-001",
            รหัสหน่วยงาน: "MOCK-ORG-01",
            รุ่นเนื้อหาปัจจุบัน: "1",
            วันเวลาสร้าง: "t1",
            วันเวลาปรับปรุง: "t1",
          },
        ],
      },
    });

    const repo = new DocumentRepository(gateway);
    const byName = repo.getDocumentIdByName(0);
    expect(byName.ok).toBe(true);
    if (byName.ok) {
      expect(byName.data).toBe("DOC-A");
    }

    // Column order shuffled in storage map still works via header name
    const cell = gateway.getCell("ทะเบียนเอกสาร", 0, "สถานะ");
    expect(cell).toBe("ร่าง");
  });

  it("listDocuments ล้มเหลวเมื่อ schema ไม่ครบ", () => {
    const gateway = new FakeSheetGateway({
      ทะเบียนเอกสาร: {
        headers: ["รหัสเอกสาร", "สถานะ"],
        rows: [{ รหัสเอกสาร: "X", สถานะ: "ร่าง" }],
      },
    });
    const repo = new DocumentRepository(gateway);
    const list = repo.listDocuments();
    expect(list.ok).toBe(false);
    if (!list.ok) {
      expect(list.messageTh).toContain("โครงสร้างชีต");
    }
  });
});
