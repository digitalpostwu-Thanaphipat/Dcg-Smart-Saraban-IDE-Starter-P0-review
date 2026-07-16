/**
 * Append-only Audit Log (in-memory mock).
 * Fields align with docs/02 and data-dictionary บันทึกเหตุการณ์.
 * No update/delete APIs — callers cannot mutate past events.
 */

export interface AuditEvent {
  /** รหัสเหตุการณ์ */
  eventId: string;
  /** วันเวลา */
  timestamp: string;
  /** ผู้กระทำ */
  actorId: string;
  /** บทบาทผู้กระทำ */
  actorRole: string;
  /** ประเภทเหตุการณ์ */
  eventType: string;
  /** ข้อมูลที่เกี่ยวข้อง */
  relatedInfo: string;
  /** รหัสรายการ */
  recordId: string;
  /** ค่าก่อนเปลี่ยน */
  beforeValue: string;
  /** ค่าหลังเปลี่ยน */
  afterValue: string;
  /** ผลการดำเนินการ */
  result: string;
  /** รหัสอ้างอิง */
  referenceId: string;
  /** รหัสตรวจสอบเหตุการณ์ก่อนหน้า (chain) */
  previousEventHash: string;
}

export type AuditAppendInput = {
  actorId: string;
  actorRole: string;
  eventType: string;
  relatedInfo?: string;
  recordId?: string;
  beforeValue?: string;
  afterValue?: string;
  result: string;
  referenceId?: string;
  timestamp?: string;
};

function simpleHash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  }
  return `h${(h >>> 0).toString(16)}`;
}

export class InMemoryAuditLog {
  private readonly events: AuditEvent[] = [];
  private seq = 0;
  private lastHash = "";

  append(input: AuditAppendInput): AuditEvent {
    this.seq += 1;
    const eventId = `AUD-MOCK-${String(this.seq).padStart(6, "0")}`;
    const timestamp = input.timestamp ?? new Date().toISOString();
    const previousEventHash = this.lastHash;
    const event: AuditEvent = {
      eventId,
      timestamp,
      actorId: input.actorId,
      actorRole: input.actorRole,
      eventType: input.eventType,
      relatedInfo: input.relatedInfo ?? "",
      recordId: input.recordId ?? "",
      beforeValue: input.beforeValue ?? "",
      afterValue: input.afterValue ?? "",
      result: input.result,
      referenceId: input.referenceId ?? "",
      previousEventHash,
    };
    this.events.push(Object.freeze({ ...event }));
    this.lastHash = simpleHash(
      `${event.eventId}|${event.timestamp}|${event.eventType}|${event.result}|${previousEventHash}`,
    );
    return event;
  }

  /** Read-only snapshot — does not allow mutating internal store via returned array. */
  list(): readonly AuditEvent[] {
    return this.events.map((e) => ({ ...e }));
  }

  count(): number {
    return this.events.length;
  }

  findByEventType(eventType: string): readonly AuditEvent[] {
    return this.list().filter((e) => e.eventType === eventType);
  }
}
