# Schema Manifest — สเปกสัญญา Runtime

อ้างอิง: `docs/00-แผนหลักระยะที่-1.md` (แก้ไขที่ 5), `docs/data-dictionary.md`  
งาน: DCS-P0-001 | วันที่: 2569-07-16

## บทบาท

| ชั้น | บทบาท |
|------|--------|
| `docs/data-dictionary.md` | แหล่งจริงเชิงออกแบบ (คนอ่าน/Agent แก้ที่นี่) |
| Schema Manifest (ไฟล์ build) | แหล่งจริงตอนรัน — Apps Script ตรวจกับชีตจริง |
| Google Sheets | ข้อมูลปฏิบัติงาน — ต้องตรง Header กับ Manifest |

**ห้าม** แก้ Dictionary กับ Manifest คนละทางด้วยมือ

## Path และรูปแบบที่เสนอ (รอยืนยันเครื่องมือ build ใน Phase 1)

| รายการ | ค่าที่เสนอ |
|--------|------------|
| Path ต้นทาง | `docs/data-dictionary.md` |
| Path ผลลัพธ์ที่เสนอ | `apps-script/server/config/schema-manifest.json` (สร้างเมื่อมี scaffold — **ยังไม่สร้างไฟล์ JSON ในงานนี้**) |
| รูปแบบ | JSON, UTF-8 |
| การสร้าง | สคริปต์ generate ใน Phase 1 (build) — งานนี้กำหนดสัญญาเท่านั้น |

หากทีมเปลี่ยนนามสกุล/path ต้องบันทึก ADR หรืออัปเดตสเปกนี้ก่อน generate ครั้งแรก

## โครงสร้าง Manifest ขั้นต่ำ

```json
{
  "schemaManifestVersion": "1",
  "generatedAt": "ISO-8601",
  "source": "docs/data-dictionary.md",
  "sheets": [
    {
      "sheetName": "ทะเบียนเอกสาร",
      "structureVersion": "1.0.0",
      "requiredHeaders": ["รหัสเอกสาร", "สถานะ"],
      "headerHash": "<hex-or-base64>",
      "columns": [
        {
          "name": "รหัสเอกสาร",
          "required": true,
          "dataType": "string"
        }
      ]
    }
  ]
}
```

## Header Hash

- คำนวณจากรายการหัวคอลัมน์บังคับตามลำดับที่กำหนดใน Dictionary (รายละเอียดอัลกอริทึมล็อกตอน implement Phase 1 — ห้ามสุ่มหลายสูตรคู่ขนาน)
- เก็บใน Manifest และในชีต `การควบคุมโครงสร้าง` คอลัมน์ `รหัสตรวจสอบหัวคอลัมน์`
- ตอนรัน: เทียบ hash ของหัวคอลัมน์จริงกับ Manifest

## พฤติกรรมเมื่อไม่ตรง (บังคับตาม docs/00)

บันทึก Audit / แจ้งผู้ดูแล และ**หยุดอย่างน้อย**:

1. การเขียนข้อมูล  
2. การออกเลข  
3. การสร้าง PDF ควบคุม  
4. งานตามเวลา (Trigger/Jobs)  

จนกว่าผู้ดูแลแก้ Schema แล้วผ่านการตรวจสอบ

## ขอบเขตงานนี้ (DCS-P0-001)

- มีสเปกนี้และ Data Dictionary โครง  
- **ไม่มี** ไฟล์ manifest.json จริง และไม่มีสคริปต์ generate (Phase 1)
