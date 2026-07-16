import type { SheetSchema } from "../config/schema-fixture.js";

export type SchemaValidationResult =
  | { valid: true }
  | { valid: false; issues: string[] };

/**
 * Validates headers by name (never by column index A/B/C).
 */
export function validateHeaders(
  actualHeaders: string[],
  schema: SheetSchema,
): SchemaValidationResult {
  const issues: string[] = [];
  const seen = new Map<string, number>();

  for (const h of actualHeaders) {
    const name = h.trim();
    if (!name) {
      issues.push("พบหัวคอลัมน์ว่าง");
      continue;
    }
    seen.set(name, (seen.get(name) ?? 0) + 1);
  }

  for (const [name, count] of seen) {
    if (count > 1) {
      issues.push(`หัวคอลัมน์ซ้ำ: ${name}`);
    }
  }

  for (const required of schema.requiredHeaders) {
    if (!seen.has(required)) {
      issues.push(`หัวคอลัมน์บังคับหายไป: ${required}`);
    }
  }

  if (issues.length > 0) {
    return { valid: false, issues };
  }
  return { valid: true };
}

/** Simple stable hash placeholder for Header Hash concept (not production crypto). */
export function headerHash(headers: string[]): string {
  const normalized = headers.map((h) => h.trim()).join("|");
  let h = 0;
  for (let i = 0; i < normalized.length; i++) {
    h = (Math.imul(31, h) + normalized.charCodeAt(i)) | 0;
  }
  return `mock-${(h >>> 0).toString(16)}`;
}
