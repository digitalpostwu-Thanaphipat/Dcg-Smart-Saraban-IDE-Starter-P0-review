/**
 * Entry / router — auth + audit only at edges; no direct sheet access.
 * Phase 2 mock: RBAC (role + org) and append-only audit.
 */
import { mockLogin, requireAuth, requireRole } from "../auth/require-auth.js";
import { primaryRole } from "../auth/permission-fixture.js";
import { InMemoryAuditLog } from "../data/audit-log.js";
import { DocumentRepository } from "../data/document-repository.js";
import { FakeSheetGateway } from "../data/fake-sheet-gateway.js";
import { MockPersonnelSource } from "../data/personnel-source.js";
import type { ApiResult } from "../shared/result.js";
import { fail, ok, validationError } from "../shared/result.js";
import type { Role } from "../shared/types.js";

export interface RouterRequest {
  action: string;
  sessionToken?: string;
  payload?: Record<string, unknown>;
}

export type RouterResponse = ApiResult<unknown>;

function defaultGateway(): FakeSheetGateway {
  return new FakeSheetGateway({
    ทะเบียนเอกสาร: {
      headers: [
        "รหัสเอกสาร",
        "ประเภทหนังสือ",
        "สถานะ",
        "รหัสผู้ร่าง",
        "รหัสหน่วยงาน",
        "รุ่นเนื้อหาปัจจุบัน",
        "วันเวลาสร้าง",
        "วันเวลาปรับปรุง",
      ],
      rows: [
        {
          รหัสเอกสาร: "DOC-MOCK-001",
          ประเภทหนังสือ: "หนังสือภายใน",
          สถานะ: "ร่าง",
          รหัสผู้ร่าง: "MOCK-P-001",
          รหัสหน่วยงาน: "MOCK-ORG-01",
          รุ่นเนื้อหาปัจจุบัน: "1",
          วันเวลาสร้าง: "2569-07-16T00:00:00+07:00",
          วันเวลาปรับปรุง: "2569-07-16T00:00:00+07:00",
        },
        {
          รหัสเอกสาร: "DOC-MOCK-002",
          ประเภทหนังสือ: "หนังสือภายใน",
          สถานะ: "ร่าง",
          รหัสผู้ร่าง: "MOCK-P-004",
          รหัสหน่วยงาน: "MOCK-ORG-02",
          รุ่นเนื้อหาปัจจุบัน: "1",
          วันเวลาสร้าง: "2569-07-16T00:00:00+07:00",
          วันเวลาปรับปรุง: "2569-07-16T00:00:00+07:00",
        },
      ],
    },
  });
}

/** In-memory status stub for mockChangeDocumentStatus (not full workflow). */
const mockDocStatus = new Map<string, string>([
  ["DOC-MOCK-001", "ร่าง"],
  ["DOC-MOCK-002", "ร่าง"],
]);

export function createRouter(deps?: {
  gateway?: FakeSheetGateway;
  personnel?: MockPersonnelSource;
  audit?: InMemoryAuditLog;
}): (req: RouterRequest) => RouterResponse {
  const gateway = deps?.gateway ?? defaultGateway();
  const personnel = deps?.personnel ?? new MockPersonnelSource();
  const audit = deps?.audit ?? new InMemoryAuditLog();
  const documents = new DocumentRepository(gateway);

  return function handle(req: RouterRequest): RouterResponse {
    switch (req.action) {
      case "health":
        return ok({ status: "จำลองพร้อมใช้งาน", phase: "DCS-P2-001" });

      case "login": {
        return mockLogin(req.sessionToken, audit);
      }

      case "me": {
        const auth = requireAuth(req.sessionToken, { audit, action: "me" });
        if (!auth.ok) return auth;
        return ok(auth.data);
      }

      case "listDocuments": {
        const auth = requireAuth(req.sessionToken, { audit, action: "listDocuments" });
        if (!auth.ok) return auth;
        const listed = documents.listDocuments();
        if (listed.ok) {
          audit.append({
            actorId: auth.data.personnelId,
            actorRole: primaryRole(auth.data),
            eventType: "อ่านรายการเอกสาร",
            result: "สำเร็จ",
            relatedInfo: `จำนวน=${listed.data.length}`,
          });
        }
        return listed;
      }

      case "listDocumentsInOrg": {
        const orgUnitId =
          typeof req.payload?.orgUnitId === "string" ? req.payload.orgUnitId : "";
        if (!orgUnitId) {
          return validationError("กรุณาระบุรหัสหน่วยงาน");
        }
        const auth = requireRole(
          req.sessionToken,
          ["ผู้ใช้งานทั่วไป", "ผู้กลั่นกรองชั้นที่ 1", "ผู้กลั่นกรองชั้นที่ 2", "ผู้ดูแลระบบ"],
          { orgUnitId, audit, action: "listDocumentsInOrg" },
        );
        if (!auth.ok) return auth;

        const allRows = gateway.readAll("ทะเบียนเอกสาร");
        const orgDocs = allRows.filter((r) => r["รหัสหน่วยงาน"] === orgUnitId);
        audit.append({
          actorId: auth.data.personnelId,
          actorRole: primaryRole(auth.data),
          eventType: "อ่านรายการเอกสาร",
          result: "สำเร็จ",
          relatedInfo: `หน่วยงาน=${orgUnitId};จำนวน=${orgDocs.length}`,
          recordId: orgUnitId,
        });
        return ok(
          orgDocs.map((row) => ({
            รหัสเอกสาร: row["รหัสเอกสาร"] ?? null,
            ประเภทหนังสือ: row["ประเภทหนังสือ"] ?? null,
            สถานะ: row["สถานะ"] ?? null,
            รหัสผู้ร่าง: row["รหัสผู้ร่าง"] ?? null,
            รหัสหน่วยงาน: row["รหัสหน่วยงาน"] ?? null,
          })),
        );
      }

      case "listPersonnelMock": {
        const auth = requireRole(req.sessionToken, ["ผู้ดูแลระบบ", "ผู้กลั่นกรองชั้นที่ 2"], {
          audit,
          action: "listPersonnelMock",
        });
        if (!auth.ok) return auth;
        return personnel.listAll();
      }

      case "mockChangeDocumentStatus": {
        const docId = typeof req.payload?.documentId === "string" ? req.payload.documentId : "";
        const newStatus = typeof req.payload?.status === "string" ? req.payload.status : "";
        const orgUnitId =
          typeof req.payload?.orgUnitId === "string" ? req.payload.orgUnitId : "MOCK-ORG-01";
        if (!docId || !newStatus) {
          return validationError("กรุณาระบุรหัสเอกสารและสถานะ");
        }
        const auth = requireRole(
          req.sessionToken,
          ["ผู้กลั่นกรองชั้นที่ 1", "ผู้กลั่นกรองชั้นที่ 2", "ผู้ดูแลระบบ"] as Role[],
          { orgUnitId, audit, action: "mockChangeDocumentStatus" },
        );
        if (!auth.ok) return auth;

        const before = mockDocStatus.get(docId) ?? "";
        mockDocStatus.set(docId, newStatus);
        audit.append({
          actorId: auth.data.personnelId,
          actorRole: primaryRole(auth.data),
          eventType: "เปลี่ยนสถานะเอกสารจำลอง",
          result: "สำเร็จ",
          recordId: docId,
          beforeValue: before,
          afterValue: newStatus,
          relatedInfo: `หน่วยงาน=${orgUnitId}`,
        });
        return ok({ documentId: docId, status: newStatus });
      }

      case "listAudit": {
        const auth = requireRole(req.sessionToken, ["ผู้ดูแลระบบ", "ผู้ตรวจสอบ"] as Role[], {
          audit,
          action: "listAudit",
        });
        if (!auth.ok) return auth;
        return ok(audit.list());
      }

      default:
        return fail("UNKNOWN_ACTION", `ไม่รู้จักคำสั่ง: ${req.action}`);
    }
  };
}

/** Default singleton for simple smoke usage in tests. */
export const handleRequest = createRouter();

export { InMemoryAuditLog };
