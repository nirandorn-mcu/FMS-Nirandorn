import { describe, it, expect } from "vitest";
import {
  createDocumentSchema,
  submitDocumentSchema,
  approveStepSchema,
  rejectStepSchema,
  addCommentSchema,
} from "./validations";

describe("document-flow validations", () => {
  it("validate createDocumentSchema สำเร็จเมื่อข้อมูลถูกต้อง", () => {
    const input = {
      docNo: "ศธ 0514.1/102",
      title: "ขออนุมัติจัดโครงการสัมมนาวิชาการระดับชาติ ประจำปี 2569",
      docType: "MEMO",
      urgency: "URGENT",
      confidentiality: "NORMAL",
      content: "รายละเอียดโครงการ...",
      attachmentUrl: "https://drive.google.com/file/d/123",
      tags: ["วิชาการ", "โครงการ"],
      workflowSteps: [
        { approverRole: "หัวหน้าภาควิชา" },
        { approverRole: "รองคณบดีฝ่ายวิชาการ" },
        { approverRole: "คณบดี" },
      ],
    };

    const result = createDocumentSchema.parse(input);
    expect(result.docNo).toBe("ศธ 0514.1/102");
    expect(result.workflowSteps).toHaveLength(3);
    expect(result.urgency).toBe("URGENT");
  });

  it("validate createDocumentSchema ล้มเหลวเมื่อไม่มี workflowSteps", () => {
    const input = {
      docNo: "ศธ 0514.1/102",
      title: "ขออนุมัติจัดโครงการ",
      docType: "MEMO",
      workflowSteps: [],
    };
    expect(() => createDocumentSchema.parse(input)).toThrow();
  });

  it("validate submitDocumentSchema", () => {
    const input = { id: "123e4567-e89b-12d3-a456-426614174000" };
    const result = submitDocumentSchema.parse(input);
    expect(result.id).toBe("123e4567-e89b-12d3-a456-426614174000");
  });

  it("validate approveStepSchema และ rejectStepSchema", () => {
    const approveInput = {
      stepId: "123e4567-e89b-12d3-a456-426614174001",
      comment: "เห็นควรอนุมัติตามเสนอ",
      signatureUrl: "https://storage.local/signatures/dean.png",
    };
    const approved = approveStepSchema.parse(approveInput);
    expect(approved.comment).toBe("เห็นควรอนุมัติตามเสนอ");

    const rejectInput = {
      stepId: "123e4567-e89b-12d3-a456-426614174001",
      comment: "ขอให้ปรับแก้งบประมาณหมวดที่ 2 ให้สอดคล้องกับระเบียบ",
    };
    const rejected = rejectStepSchema.parse(rejectInput);
    expect(rejected.comment).toBe("ขอให้ปรับแก้งบประมาณหมวดที่ 2 ให้สอดคล้องกับระเบียบ");
  });

  it("validate addCommentSchema", () => {
    const commentInput = {
      documentId: "123e4567-e89b-12d3-a456-426614174000",
      comment: "สอบถามเพิ่มเติมเรื่องกำหนดการ",
    };
    const result = addCommentSchema.parse(commentInput);
    expect(result.comment).toBe("สอบถามเพิ่มเติมเรื่องกำหนดการ");
  });
});
