import { describe, it, expect } from "vitest";
import {
  curriculumSchema,
  updateCurriculumSchema,
  subjectSchema,
  updateSubjectSchema,
  assignSubjectSchema,
  departmentSchema,
  updateDepartmentSchema,
} from "./validations";

describe("curriculum validations", () => {
  it("validate curriculumSchema สำเร็จเมื่อข้อมูลครบถ้วน", () => {
    const valid = {
      code: "BBA-2567",
      nameTh: "หลักสูตรบริหารธุรกิจบัณฑิต",
      nameEn: "Bachelor of Business Administration",
      degreeTh: "บธ.บ.",
      degreeEn: "B.B.A.",
      faculty: "คณะวิทยาการจัดการ",
      totalCredits: 120,
      revisionYear: 2567,
      status: "ACTIVE" as const,
    };
    expect(curriculumSchema.parse(valid)).toMatchObject({
      code: "BBA-2567",
      revisionYear: 2567,
    });
  });

  it("validate curriculumSchema พร้อมข้อมูล มคอ. 2 (TQF 2)", () => {
    const tqf2Data = {
      code: "25611851100597",
      nameTh: "หลักสูตรพุทธศาสตรบัณฑิต สาขาวิชาพระพุทธศาสนา",
      nameEn: "Bachelor of Arts Program in Buddhist Studies",
      degreeTh: "พุทธศาสตรบัณฑิต (พระพุทธศาสนา)",
      degreeEn: "Bachelor of Arts (Buddhist Studies)",
      faculty: "คณะพุทธศาสตร์",
      totalCredits: 132,
      revisionYear: 2570,
      durationYears: 4,
      studyType: "FULL_TIME",
      campusLocation: "วิทยาเขตอุบลราชธานี",
      philosophy: "มุ่งผลิตบัณฑิตให้มีความรู้ความเข้าใจในหลักธรรมทางพระพุทธศาสนา",
      objectives: "1. เพื่อผลิตบัณฑิตที่มีคุณธรรม จริยธรรม",
      careerPaths: "1. พระธรรมทูต / เจ้าหน้าที่งานเผยแผ่พระพุทธศาสนา",
      admissionReq: "สำเร็จการศึกษาระดับมัธยมศึกษาตอนปลาย หรือเทียบเท่า",
      tuitionFees: "ประมาณภาคการศึกษาละ 4,000 บาท (ปีละ 8,000 บาท)",
      graduationCriteria: "เรียนครบหน่วยกิตตามโครงสร้างหลักสูตร 132 หน่วยกิต ได้แต้มระดับคะแนนเฉลี่ยสะสมไม่ต่ำกว่า 2.00",
      plos: "PLO1: อธิบายหลักธรรมสำคัญทางพระพุทธศาสนาเถรวาทและมหายานได้",
      status: "ACTIVE" as const,
    };
    const parsed = curriculumSchema.parse(tqf2Data);
    expect(parsed).toMatchObject({
      code: "25611851100597",
      durationYears: 4,
      studyType: "FULL_TIME",
      campusLocation: "วิทยาเขตอุบลราชธานี",
    });
    expect(parsed.philosophy).toContain("มุ่งผลิตบัณฑิต");
    expect(parsed.plos).toContain("PLO1");
  });

  it("validate curriculumSchema ล้มเหลวเมื่อไม่มีรหัสหรือชื่อหลักสูตร", () => {
    expect(() =>
      curriculumSchema.parse({
        code: "",
        nameTh: "",
        nameEn: "English Only",
        revisionYear: 2567,
      })
    ).toThrow();
  });

  it("validate updateCurriculumSchema ต้องมี id เป็น UUID", () => {
    expect(() =>
      updateCurriculumSchema.parse({
        id: "invalid-id",
        code: "BBA-2567",
        nameTh: "หลักสูตรบริหารธุรกิจบัณฑิต",
        nameEn: "Bachelor of Business Administration",
        revisionYear: 2567,
      })
    ).toThrow();
  });

  it("validate subjectSchema สำเร็จเมื่อระบุข้อมูลวิชาถูกต้อง", () => {
    const valid = {
      code: "MGT1001",
      nameTh: "หลักการจัดการ",
      nameEn: "Principles of Management",
      credits: 3,
      creditInfo: "3(3-0-6)",
      description: "คำอธิบายวิชา",
      status: "ACTIVE" as const,
    };
    expect(subjectSchema.parse(valid)).toMatchObject({
      code: "MGT1001",
      credits: 3,
    });
  });

  it("validate updateSubjectSchema ต้องมี id เป็น UUID", () => {
    expect(() =>
      updateSubjectSchema.parse({
        id: "not-a-uuid",
        code: "MGT1001",
        nameTh: "หลักการจัดการ",
        nameEn: "Principles of Management",
      })
    ).toThrow();
  });

  it("validate assignSubjectSchema ตรวจสอบ UUID ของหลักสูตรและวิชา", () => {
    const valid = {
      curriculumId: "123e4567-e89b-12d3-a456-426614174000",
      subjectId: "123e4567-e89b-12d3-a456-426614174001",
      category: "หมวดวิชาศึกษาทั่วไป",
      isCompulsory: true,
    };
    expect(assignSubjectSchema.parse(valid)).toMatchObject({
      category: "หมวดวิชาศึกษาทั่วไป",
      isCompulsory: true,
    });
  });

  it("validate departmentSchema สำเร็จเมื่อระบุข้อมูลภาควิชาถูกต้อง", () => {
    const valid = {
      code: "D-MGT",
      nameTh: "ภาควิชาการจัดการ",
      nameEn: "Department of Management",
      description: "คำอธิบายภาควิชา",
      status: "ACTIVE" as const,
    };
    expect(departmentSchema.parse(valid)).toMatchObject({
      code: "D-MGT",
      nameTh: "ภาควิชาการจัดการ",
    });
  });

  it("validate updateDepartmentSchema ต้องมี id เป็น UUID", () => {
    expect(() =>
      updateDepartmentSchema.parse({
        id: "invalid-uuid",
        code: "D-MGT",
        nameTh: "ภาควิชาการจัดการ",
        nameEn: "Department of Management",
      })
    ).toThrow();
  });
});
