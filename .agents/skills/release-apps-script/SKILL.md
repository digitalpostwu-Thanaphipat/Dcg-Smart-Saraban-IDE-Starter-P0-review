---
name: release-apps-script
description: เตรียมความพร้อมและปล่อย Dcg Smart Saraban ใช้เมื่อผู้ใช้สั่งตรวจ Release หรือ Deploy เท่านั้น ต้องตรวจ Protected Baseline, Backup, Test, Staging และ Human Approval ก่อน Production
---

# ปล่อยระบบ Apps Script

1. ตรวจ Change Request และผลกระทบต่อ Protected Baseline
2. ตรวจ lint, type check, Unit Test, Playwright E2E, Security/Secret Scan และผล Load/Restore Test ที่เกี่ยวข้อง
3. ยืนยัน Backup ล่าสุดและวิธีย้อนกลับเวอร์ชัน
4. Deploy Staging และบันทึกผล UAT
5. ขอ Human Approval ก่อน Deploy Production
6. หลังปล่อย ตรวจสุขภาพระบบ การแจ้งเตือน Audit และ Backup รอบถัดไป

เสร็จเมื่อ: มีหลักฐานผลทดสอบ รุ่นที่ปล่อย ผู้อนุมัติ แผนย้อนกลับ และผลตรวจหลังปล่อย
