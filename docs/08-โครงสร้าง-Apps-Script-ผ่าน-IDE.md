# โครงสร้าง Apps Script ผ่าน IDE

ใช้โครงสร้างนี้กับโครงการ Apps Script ที่พัฒนาผ่าน IDE และ `clasp` เพื่อแยกหน้าที่ ลดโค้ดไฟล์เดียว และทำให้ทดสอบได้

```text
apps-script/
├── appsscript.json
├── server/
│   ├── entry/                 # doGet, doPost, ตัวรับคำขอ และ Router
│   ├── auth/                  # ยืนยันตัวตน RBAC และตรวจสิทธิ์
│   ├── domain/                # กฎธุรกิจตามโมดูล: เอกสาร, กลั่นกรอง, เลขหนังสือ
│   ├── services/              # PDF, รายงาน, แจ้งเตือน, Backup, การนำเข้า
│   ├── data/                  # Sheet Gateway, Repository, Schema Validator
│   ├── config/                # อ่านและตรวจค่าตั้งค่าแบบมีรุ่น
│   ├── jobs/                  # Trigger ตามเวลา และงานเบื้องหลัง
│   └── shared/                # ค่าคงที่ทางเทคนิค, ผลลัพธ์มาตรฐาน, เครื่องมือร่วม
├── client/
│   ├── index.html             # โครงหน้าเว็บ
│   ├── styles.html            # CSS เท่านั้น
│   ├── app.html               # JavaScript ฝั่งผู้ใช้และตัวเริ่มระบบ
│   └── features/              # โมดูลหน้าจอตามฟีเจอร์
├── tests/
│   ├── unit/                  # ทดสอบกฎธุรกิจและชั้นข้อมูลแบบจำลอง
│   └── e2e/                   # Playwright สำหรับ Web App ที่ deploy ใน Staging
└── scripts/                   # คำสั่งตรวจ Schema, นำเข้าข้อมูล, และตรวจ Release
```

## หน้าที่ของแต่ละชั้น

| ชั้น | ทำได้ | ทำไม่ได้ |
|---|---|---|
| `entry` | รับคำขอ ส่งต่อ Router ส่งผลลัพธ์มาตรฐาน | เขียนกฎธุรกิจหรือเข้าถึง Sheet โดยตรง |
| `auth` | ยืนยันตัวตน ตรวจ RBAC และขอบเขตหน่วยงาน | ปล่อยให้ UI เป็นผู้ตัดสินสิทธิ์ |
| `domain` | ตรวจสถานะ Workflow และ Business Rules | เรียก Spreadsheet Service กระจัดกระจาย |
| `services` | ประสาน PDF Report Notification Backup Import | ข้ามการตรวจสิทธิ์หรือ Audit |
| `data` | อ่าน/เขียน Sheets ตรวจ Schema และบันทึก Audit | ส่งข้อมูลดิบเข้าหน้าเว็บโดยไม่กรองสิทธิ์ |
| `config` | อ่านค่าตั้งค่า ตรวจรุ่น และ Cache | ให้ค่าที่ไม่ผ่านอนุมัติมีผลทันที |
| `client` | แสดง UI ภาษาไทย เรียก Server แบบ asynchronous | เข้าถึง Sheet หรือ Secret โดยตรง |

## กติกา Apps Script ที่บังคับ

1. ใช้ `doGet`/`doPost` หรือ Router เป็นจุดเข้าเพียงจุดเดียว และเรียก `requireAuth`/`requireRole` ก่อนทุกงานที่มีข้อมูล
2. แยก HTML, CSS และ JavaScript ฝั่งผู้ใช้ออกจากกัน ใช้ `google.script.run` แบบ asynchronous พร้อม Success/Failure Handler ภาษาไทย
3. ชั้น `data` เท่านั้นที่เรียก Spreadsheet/Drive Service; อ่านและเขียนแบบเป็นชุด ห้ามเรียกเซลล์ใน Loop
4. ใช้ `CacheService` กับค่าตั้งค่า ข้อมูลหน่วยงาน และ mapping หัวคอลัมน์ที่อ่านบ่อย โดยไม่ใช้ Cache เป็นแหล่งข้อมูลจริง
5. ใช้ `LockService` เฉพาะ critical section เช่น ออกเลข เปลี่ยนสถานะสำคัญ และงานสำรองที่ห้ามชนกัน
6. Trigger ตามเวลาอยู่ใน `jobs` ต้องทำงานแบบแบ่งช่วง บันทึก checkpoint และบันทึกผลลง Audit/บันทึกงาน
7. `appsscript.json` ระบุ V8 runtime, OAuth scopes ขั้นต่ำ และ deployment ที่แยก Staging/Production
8. หากใช้ TypeScript หรือ `import/export` ต้อง Bundle ก่อน `clasp push`; Apps Script V8 ไม่รองรับ ES Modules โดยตรง
9. `.clasp.json` และ Secret อยู่เฉพาะเครื่องพัฒนา ห้าม commit

## Definition of Done

- ฟีเจอร์ใหม่อยู่ในชั้นที่ถูกต้อง ไม่มี Business Rule ซ่อนใน UI หรือ Router
- มี Unit Test สำหรับกฎธุรกิจและ Playwright E2E สำหรับ Workflow ที่กระทบผู้ใช้
- มี Error Handler ภาษาไทย, Audit Log และการตรวจสิทธิ์ตามความเสี่ยง
- ผ่าน lint, type check, test และตรวจ Schema ก่อน Merge
