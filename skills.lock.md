# ทะเบียน Skill ภายนอก — Dcg Smart Saraban

สถานะ: `อนุมัติใช้` หมายถึงใช้ได้ตามขอบเขตที่ระบุ, `อ้างอิง` หมายถึงอ่านเพื่อคัดแนวปฏิบัติเท่านั้น, `ยังไม่อนุมัติ` หมายถึงห้ามติดตั้งหรือเรียกใช้กับงานจริง

| รหัส | แหล่ง/Skill | URL | รุ่นหรือ Commit ที่ล็อก | สถานะ | ขอบเขตที่อนุญาต | ผู้อนุมัติ/วันที่ |
|---|---|---|---|---|---|---|
| EXT-001 | Playwright | https://playwright.dev/ | ระบุใน `package.json` เมื่อเริ่มโค้ด | อนุมัติใช้ | E2E, Regression, ตรวจสิทธิ์และ Workflow | รอแต่งตั้ง |
| EXT-002 | Google Skills | https://github.com/google/skills | ยังไม่ติดตั้ง | อ้างอิง | วางแผนย้าย Cloud Run/Cloud SQL และ WAF | รอแต่งตั้ง |
| EXT-003 | Google Agents CLI | https://github.com/google/agents-cli | ยังไม่ติดตั้ง | ยังไม่อนุมัติ | ใช้ได้เฉพาะโครงการ AI Agent ที่ได้รับอนุมัติงบ/Cloud | รอแต่งตั้ง |
| EXT-004 | VoltAgent Awesome Agent Skills | https://github.com/VoltAgent/awesome-agent-skills | ยังไม่ติดตั้ง | อ้างอิง | ค้นหาและตรวจ Skill รายตัว | รอแต่งตั้ง |
| EXT-005 | Agentic Awesome Skills | https://github.com/sickn33/agentic-awesome-skills | ยังไม่ติดตั้ง | อ้างอิง | ค้นหา Skill รายตัวด้าน QA/Security/Accessibility | รอแต่งตั้ง |
| EXT-006 | Matt Pocock Skills | https://github.com/mattpocock/skills | ยังไม่ติดตั้ง | อ้างอิง | แนวทาง Workflow, TDD, Code Review, Handoff และการเขียน Skill | รอแต่งตั้ง |

## บันทึกการเปลี่ยนแปลง

| วันที่ | รหัส | การเปลี่ยนแปลง | ผู้ดำเนินการ | ผู้อนุมัติ |
|---|---|---|---|---|
| 2569-07-16 | EXT-001 ถึง EXT-006 | สร้างทะเบียนเริ่มต้นจากการคัดเลือกแหล่ง Skill | ทีมโครงการ | รอแต่งตั้ง |

## กติกาเมื่ออนุมัติติดตั้ง

1. เติมรุ่นหรือ Commit ที่แน่นอน และวันที่อนุมัติก่อนติดตั้ง
2. เก็บ Skill ไว้เฉพาะในโฟลเดอร์โครงการตามมาตรฐาน IDE ห้ามติดตั้ง Global และห้ามติดตั้งทั้งคลัง
3. ตรวจผลกระทบด้วย Unit Test และ Playwright E2E ที่เกี่ยวข้อง
4. หาก Skill มีการเปลี่ยนรุ่น ให้ถือเป็น Change Request และทดสอบซ้ำก่อนใช้งาน
