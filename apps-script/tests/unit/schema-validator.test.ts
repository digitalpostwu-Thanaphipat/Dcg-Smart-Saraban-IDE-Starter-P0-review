import { describe, expect, it } from "vitest";
import { getSchema } from "../../server/config/schema-fixture.js";
import { validateHeaders } from "../../server/data/schema-validator.js";

describe("schema-validator (ชื่อหัวคอลัมน์)", () => {
  const schema = getSchema("ทะเบียนเอกสาร");
  if (!schema) throw new Error("missing fixture");

  it("ผ่านเมื่อมีหัวคอลัมน์บังคับครบ", () => {
    const result = validateHeaders([...schema.requiredHeaders], schema);
    expect(result.valid).toBe(true);
  });

  it("ล้มเหลวเมื่อหัวคอลัมน์บังคับหาย", () => {
    const headers = schema.requiredHeaders.filter((h) => h !== "สถานะ");
    const result = validateHeaders(headers, schema);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.issues.some((i) => i.includes("สถานะ"))).toBe(true);
    }
  });

  it("ล้มเหลวเมื่อหัวคอลัมน์ซ้ำ", () => {
    const headers = [...schema.requiredHeaders, "สถานะ"];
    const result = validateHeaders(headers, schema);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.issues.some((i) => i.includes("ซ้ำ"))).toBe(true);
    }
  });
});
