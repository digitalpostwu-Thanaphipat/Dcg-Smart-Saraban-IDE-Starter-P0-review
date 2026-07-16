import { describe, expect, it } from "vitest";
import { MockPersonnelSource } from "../../server/data/personnel-source.js";

describe("MockPersonnelSource", () => {
  it("คืนข้อมูลจำลองเท่านั้น ไม่มี spreadsheet id", () => {
    const source = new MockPersonnelSource();
    const all = source.listAll();
    expect(all.ok).toBe(true);
    if (all.ok) {
      expect(all.data.length).toBeGreaterThan(0);
      const json = JSON.stringify(all.data);
      expect(json).not.toMatch(/spreadsheets\//i);
      expect(json).not.toMatch(/AIza/i);
      expect(all.data[0]?.personnelId.startsWith("MOCK-")).toBe(true);
    }
  });
});
