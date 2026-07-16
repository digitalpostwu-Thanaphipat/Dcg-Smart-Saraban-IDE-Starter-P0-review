/**
 * Entry / router stub — no business rules, no direct sheet access.
 * Phase 1 mock: callable from unit tests and future doGet/doPost adapters.
 */
import { requireAuth, requireRole } from "../auth/require-auth.js";
import { DocumentRepository } from "../data/document-repository.js";
import { FakeSheetGateway } from "../data/fake-sheet-gateway.js";
import { MockPersonnelSource } from "../data/personnel-source.js";
import type { ApiResult } from "../shared/result.js";
import { fail, ok } from "../shared/result.js";
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
      ],
    },
  });
}

export function createRouter(deps?: {
  gateway?: FakeSheetGateway;
  personnel?: MockPersonnelSource;
}): (req: RouterRequest) => RouterResponse {
  const gateway = deps?.gateway ?? defaultGateway();
  const personnel = deps?.personnel ?? new MockPersonnelSource();
  const documents = new DocumentRepository(gateway);

  return function handle(req: RouterRequest): RouterResponse {
    switch (req.action) {
      case "health":
        return ok({ status: "จำลองพร้อมใช้งาน", phase: "DCS-P1-001" });

      case "me": {
        const auth = requireAuth(req.sessionToken);
        if (!auth.ok) return auth;
        return ok(auth.data);
      }

      case "listDocuments": {
        const auth = requireAuth(req.sessionToken);
        if (!auth.ok) return auth;
        return documents.listDocuments();
      }

      case "listPersonnelMock": {
        const auth = requireRole(req.sessionToken, [
          "ผู้ดูแลระบบ",
          "ผู้กลั่นกรองชั้นที่ 2",
        ] as Role[]);
        if (!auth.ok) return auth;
        return personnel.listAll();
      }

      default:
        return fail("UNKNOWN_ACTION", `ไม่รู้จักคำสั่ง: ${req.action}`);
    }
  };
}

/** Default singleton for simple smoke usage in tests. */
export const handleRequest = createRouter();
