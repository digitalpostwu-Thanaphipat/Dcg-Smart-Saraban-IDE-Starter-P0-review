# ทะเบียนและนโยบายการใช้ Skill ภายนอก

## หลักการ

Skill เป็นคู่มือขั้นตอนการทำงานของ Agent ไม่ใช่ข้อกำหนดของระบบ และไม่อาจแทนที่ระเบียบงานสารบรรณ ข้อกำหนด Dcg Smart Saraban หรือการอนุมัติของผู้รับผิดชอบได้

ให้ใช้ Skill เฉพาะโครงการใน `.agents/skills/` เป็นหลัก ส่วน Skill ภายนอกให้คัดเลือกเป็นรายตัวตามชนิดงาน โดยต้องผ่านการตรวจเนื้อหาและบันทึกลง `skills.lock.md` ก่อนใช้กับ Repository

## ลำดับความสำคัญของกติกา

1. กฎหมาย ระเบียบสำนักนายกรัฐมนตรี และข้อกำหนด/คำอนุมัติของมหาวิทยาลัย
2. `AGENTS.md`, `CONTEXT.md`, `DESIGN.md`, ADR และเอกสารใน `docs/`
3. Skill เฉพาะโครงการใน `.agents/skills/`
4. Skill ภายนอกที่ได้รับอนุมัติและระบุใน `skills.lock.md`

เมื่อพบความขัดกัน ให้หยุดงานในส่วนนั้น บันทึกประเด็นเพื่อขอคำตัดสิน และห้าม Agent เลือกคำตอบเอง

## ขั้นตอนก่อนเพิ่ม Skill ภายนอก

1. ระบุงานและผลลัพธ์ที่ต้องการให้ชัดเจน เช่น E2E, Accessibility, Security Review หรือ Cloud Migration
2. ตรวจ `SKILL.md` โดยตรง: ขั้นตอน คำสั่ง สิทธิ์ การส่งข้อมูลออกนอกระบบ และไฟล์ที่ Skill อาจแก้
3. ตรวจแหล่งที่มา License รุ่น/Commit และความเข้ากันได้กับ IDE ที่ใช้
4. ประเมินความซ้ำซ้อนหรือขัดกับกติกาโครงการ โดยเฉพาะสิทธิ์ Workflow ภาษาไทย ความปลอดภัย และ Protected Baseline
5. บันทึกใน `skills.lock.md` ว่าเป็น อนุมัติ / อ้างอิงเท่านั้น / ยังไม่อนุมัติ พร้อมเหตุผลและรุ่นที่ล็อก
6. ติดตั้งเฉพาะรายตัวในโฟลเดอร์โครงการ แล้วทดสอบในสภาพแวดล้อมแยกก่อนใช้กับงานจริง

## ข้อห้าม

- ห้ามติดตั้งคลัง Skill ทั้งหมด หรือใช้ `--all` / ติดตั้ง Global เพราะทำให้บริบทมากเกินไปและควบคุมรุ่นยาก
- ห้ามให้ Skill ภายนอกเขียนทับ `AGENTS.md`, `CONTEXT.md`, `DESIGN.md`, ADR, Data Dictionary, Test, สิทธิ์ หรือ Workflow อัตโนมัติ
- ห้ามรันคำสั่งจาก Skill ที่เผยแพร่ข้อมูลจริง เอกสารจริง Token หรือข้อมูลบุคลากรโดยไม่ผ่านการอนุมัติ
- ห้ามใช้ Skill ที่ออกคำสั่งแทนผู้มีอำนาจ เช่น อนุมัติ ออกเลขหนังสือ ลงนาม หรือแก้ข้อมูลที่ออกเลขแล้ว

## แหล่งอ้างอิงที่พิจารณา

| แหล่ง | สถานะ | ใช้เมื่อ | ข้อจำกัด |
|---|---|---|---|
| Google Apps Script / clasp และ Google Workspace Samples | อ้างอิง/เลือกใช้ | พัฒนา Apps Script ผ่าน IDE | ไม่ทดแทน Data Contract และ Audit ของโครงการ |
| Playwright | อนุมัติเป็นแนวปฏิบัติ | ทดสอบ E2E และ Regression | ต้องเขียน Test ตาม Acceptance Criteria ภาษาไทยของระบบ |
| Google `skills` | อ้างอิงระยะย้ายขึ้น Cloud | Cloud Run, Cloud SQL, Security, Reliability, Performance | ยังไม่ติดตั้งในระยะ Sheets/Apps Script ต้นทุนต่ำ |
| Google `agents-cli` | ยังไม่อนุมัติ | เมื่อสร้าง AI Agent ด้วย ADK/Gemini Enterprise โดยมีงบและการอนุมัติ | ไม่ใช่แกนของ Web App; เกี่ยวข้อง Google Cloud และสถานะ Pre-GA |
| VoltAgent Awesome Agent Skills | แหล่งค้นหาเท่านั้น | ค้นหา Skill รายตัวจากทีมที่มีแหล่งชัดเจน | ห้ามติดตั้งทั้งคลัง |
| Agentic Awesome Skills | แหล่งค้นหาเท่านั้น | คัด Skill รายตัวด้าน QA, Security, Accessibility | เป็นคลังชุมชนขนาดใหญ่ ต้องตรวจ Skill รายตัวและล็อกรุ่น |
| Matt Pocock Skills | อ้างอิงแนวทาง | วาง Workflow, TDD, Code Review, Handoff และการเขียน Skill | ใช้แนวคิดที่ปรับเป็นภาษาไทยใน `WORKFLOW.md`; ไม่ได้ติดตั้งทั้งชุด |
| Awesome Design MD / Impeccable / Hallmark | อ้างอิงเฉพาะงานออกแบบ | ตรวจ UX, Accessibility, Responsive และ Component State | ห้ามใช้ธีมหรือ Hook ที่เขียนทับ `DESIGN.md` โดยอัตโนมัติ |

## ชุดที่แนะนำในระยะที่ 1

ไม่เพิ่ม Skill ภายนอกในทันที นอกจากเครื่องมือ/แนวทางที่มีอยู่แล้ว ให้ใช้ Skill เฉพาะโครงการ 6 ตัวเป็นมาตรฐานหลัก ได้แก่ Google Sheets Data Contract, Apps Script/clasp, Concurrency/Audit, Release, Thai UI Quality และ Saraban Document Review

เมื่อเริ่มพัฒนาและมีงานตรงประเภท จึงพิจารณาเพิ่มทีละรายการตามลำดับ:

1. Playwright สำหรับ E2E
2. Security Review / Threat Model สำหรับรอบก่อนปล่อย
3. Accessibility Audit สำหรับรอบก่อน UAT
4. Google Cloud Architecture / Cloud Run / Cloud SQL เมื่ออนุมัติย้ายออกจาก Google Sheets
