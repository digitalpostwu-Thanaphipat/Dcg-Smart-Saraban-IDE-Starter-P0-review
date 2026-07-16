---
name: apps-script-clasp-development
description: พัฒนาและทดสอบ Google Apps Script ของ Dcg Smart Saraban ผ่าน IDE และ clasp ใช้เมื่อสร้างหรือแก้ JavaScript/TypeScript, HTML Service, Trigger หรือ Deployment ต้องแยกชั้นงาน ตรวจ lint/test และไม่เก็บความลับในโค้ด
---

# Apps Script ผ่าน IDE และ clasp

1. อ่าน `AGENTS.md` และเอกสารงานก่อนแก้ไข
2. แยก UI, ตัวรับคำขอ, กฎธุรกิจ, ชั้นข้อมูล และ Audit ออกจากกัน
3. ใช้ HTML/CSS/JavaScript แยกไฟล์; เรียกฝั่ง Apps Script แบบ asynchronous
4. ใช้ Git เป็นแหล่งโค้ดหลักและจัดการ Apps Script ด้วย clasp
5. ห้ามใส่ `.clasp.json`, Secret, Token หรือ Spreadsheet ID ที่อ่อนไหวใน Repository
6. รัน lint, type check และ test ที่เกี่ยวข้องก่อนสรุป

เสร็จเมื่อ: โค้ดผ่านการตรวจคุณภาพ มีผลทดสอบ และมีคำสั่ง deploy ที่แยก Staging/Production โดย Production ต้องรออนุมัติ
