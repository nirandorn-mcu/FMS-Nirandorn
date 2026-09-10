import { describe, it, expect } from "vitest";
import {
  createPetitionSchema,
  advisorReviewSchema,
  officerReviewSchema,
  deanReviewSchema,
  rejectPetitionSchema,
  cancelPetitionSchema,
} from "./validations";

describe("student-petition validations", () => {
  it("validate createPetitionSchema สำเร็จเมื่อข้อมูลถูกต้อง", () => {
    const input = {
      studentCode: "66010001",
      studentName: "สมชาย ใจดี",
      studentEmail: "somchai@student.ac.th",
      major: "วิทยาการคอมพิวเตอร์",
      yearLevel: 2,
      petitionType: "LATE_ENROLL",
      title: "ขอลงทะเบียนเรียนรายวิชา CS101 ล่าช้า",
      details: "เนื่องจากติดปัญหาการเทียบโอนหน่วยกิต",
      evidenceUrls: ["https://example.com/slip.pdf"],
    };
    const result = createPetitionSchema.parse(input);
    expect(result.studentCode).toBe("66010001");
    expect(result.petitionType).toBe("LATE_ENROLL");
    expect(result.yearLevel).toBe(2);
  });

  it("validate createPetitionSchema ล้มเมื่ออีเมลไม่ถูกต้อง", () => {
    const input = {
      studentCode: "66010001",
      studentName: "สมชาย ใจดี",
      studentEmail: "invalid-email",
      major: "วิทยาการคอมพิวเตอร์",
      yearLevel: 2,
      petitionType: "LATE_ENROLL",
      title: "ขอลงทะเบียนเรียนรายวิชา CS101 ล่าช้า",
      details: "เนื่องจากติดปัญหาการเทียบโอนหน่วยกิต",
    };
    expect(() => createPetitionSchema.parse(input)).toThrow();
  });

  it("validate advisorReviewSchema และ deanReviewSchema ตรวจสอบ UUID", () => {
    const valid = { id: "123e4567-e89b-12d3-a456-426614174000", comment: "เห็นชอบตามเสนอ" };
    expect(advisorReviewSchema.parse(valid).id).toBe("123e4567-e89b-12d3-a456-426614174000");
    expect(officerReviewSchema.parse(valid).id).toBe("123e4567-e89b-12d3-a456-426614174000");
    expect(deanReviewSchema.parse(valid).id).toBe("123e4567-e89b-12d3-a456-426614174000");

    expect(() => advisorReviewSchema.parse({ id: "invalid" })).toThrow();
  });

  it("validate rejectPetitionSchema ต้องการเหตุผลการปฏิเสธ", () => {
    const valid = { id: "123e4567-e89b-12d3-a456-426614174000", reason: "เอกสารไม่ครบถ้วน" };
    expect(rejectPetitionSchema.parse(valid).reason).toBe("เอกสารไม่ครบถ้วน");

    expect(() => rejectPetitionSchema.parse({ id: "123e4567-e89b-12d3-a456-426614174000", reason: "" })).toThrow();
  });

  it("validate cancelPetitionSchema", () => {
    const valid = { id: "123e4567-e89b-12d3-a456-426614174000" };
    expect(cancelPetitionSchema.parse(valid).id).toBe("123e4567-e89b-12d3-a456-426614174000");
  });
});
