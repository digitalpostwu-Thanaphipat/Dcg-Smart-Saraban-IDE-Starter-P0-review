# ชุดเริ่มต้นสำหรับ IDE — Dcg Smart Saraban

ใช้โฟลเดอร์นี้เป็นบริบทต้นทางของ Coding Agent ก่อนเริ่มพัฒนาระบบ

## วิธีเริ่มงาน

1. เปิดโฟลเดอร์นี้ใน IDE และแนบไฟล์ใน `prompts/master-prompt.md` ในคำสั่งแรก
2. ให้ Agent อ่าน `AGENTS.md`, `CONTEXT.md`, **`docs/00-แผนหลักระยะที่-1.md`**, **`docs/10-แผนดำเนินงานระยะที่-1.md`** แล้วจึงอ่าน `docs/` ที่เกี่ยวข้อง ก่อนแก้โค้ด
3. งานจำลอง/เอกสารทำได้เมื่อมี ADR หรือข้อเสนอชั่วคราวใน `docs/adr/`; ห้าม deploy หรือข้อมูลจริงจนกว่าได้สิทธิ์และผ่านเกณฑ์ปล่อย — รายการรอรับรองอยู่ที่ `docs/99-ประเด็นรอการตัดสินใจ.md`

## โครงสร้าง

- `AGENTS.md` — กติกาบังคับของโครงการ
- `CONTEXT.md` — ข้อเท็จจริง ขอบเขต และข้อห้าม
- `DESIGN.md` — หลักออกแบบ UX/UI โครงเมนู หน้าจอ สถานะ และ A4 Preview
- `WORKFLOW.md` — กระบวนการคิดและเกณฑ์จบงานที่ Agent ต้องเลือกใช้ตามประเภทงาน
- `docs/00-แผนหลักระยะที่-1.md` — **แผนหลัก:** ขอบเขตระยะที่ 1, 17 ชีต, ADR, Schema Manifest และเงื่อนไขการเริ่มงาน (source of truth ขอบเขต/ข้อมูล)
- `docs/10-แผนดำเนินงานระยะที่-1.md` — **แผนดำเนินงาน:** Gate, Phase, Pilot, Definition of Done และการพิสูจน์ก่อนเปิดใช้
- `docs/phase-mapping.md` — ตารางจับคู่เฟสแผนหลัก ↔ แผนดำเนินงาน
- `docs/adr/` — ADR-01…07 (เสนอให้รับรอง / Deferred)
- `docs/data-dictionary.md` — แหล่งจริงเชิงออกแบบชื่อชีต/คอลัมน์
- `docs/schema-manifest-spec.md` — สัญญา Schema Manifest / Header Hash
- `docs/spec-ยกเลิกและฉบับแทนที่.md` / `docs/backup-restore-contract.md` — สเปกธุรกิจและสัญญาสำรอง
- `docs/` — ข้อกำหนดเชิงธุรกิจ ข้อมูล การทดสอบ และการปฏิบัติการ (`01`–`09`, `99`)
- `docs/08-โครงสร้าง-Apps-Script-ผ่าน-IDE.md` — โครงสร้างโฟลเดอร์และกติกาแยกชั้นของ Apps Script
- `docs/09-ทะเบียน-Skill-ภายนอก.md` — นโยบายคัดเลือก ตรวจสอบ และใช้ Skill จากภายนอก
- `.agents/skills/` — ขั้นตอนงานเฉพาะที่ Agent เรียกตามชนิดงาน
- `skills.lock.md` — ทะเบียนแหล่งที่มา รุ่น และสถานะการอนุมัติของ Skill ภายนอก
- `templates/` — แบบฟอร์ม Task Manifest และ Skill Evidence สำหรับตรวจสอบย้อนหลัง
- `docs/agent-runs/` — Task Manifest และ Skill Evidence รายงาน

Skills ที่มี: Google Sheets Data Contract, Apps Script/clasp, Concurrency/Audit, Release, Thai UI Quality และ Saraban Document Review

ข้อความสำหรับผู้ใช้ในระบบ ชื่อชีต ชื่อคอลัมน์ สถานะ และข้อความแจ้งเตือนต้องเป็นภาษาไทย 100%
