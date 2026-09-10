import { describe, it, expect } from "vitest";
import {
  createAdvanceRequestSchema,
  approveAdvanceRequestSchema,
  rejectAdvanceRequestSchema,
  submitClearingSchema,
} from "./validations";

describe("advance-payment validations", () => {
  it("validate createAdvanceRequestSchema สำเร็จเมื่อข้อมูลถูกต้อง", () => {
    const input = {
      title: "โครงการศึกษาดูงานด้านเทคโนโลยีสารสนเทศ",
      description: "เพื่อเพิ่มพูนความรู้บุคลากร",
      amount: 15000,
      eventStartDate: "2026-10-01",
      eventEndDate: "2026-10-03",
      items: [
        { itemDescription: "ค่าที่พัก 2 คืน", estimatedAmount: 6000 },
        { itemDescription: "ค่าน้ำมันและยานพาหนะ", estimatedAmount: 9000 },
      ],
    };
    const result = createAdvanceRequestSchema.parse(input);
    expect(result.title).toBe("โครงการศึกษาดูงานด้านเทคโนโลยีสารสนเทศ");
    expect(result.amount).toBe(15000);
    expect(result.items).toHaveLength(2);
  });

  it("validate createAdvanceRequestSchema ล้มเมื่อไม่มีรายการค่าใช้จ่าย", () => {
    const input = {
      title: "ทดสอบ",
      amount: 5000,
      eventStartDate: "2026-10-01",
      eventEndDate: "2026-10-03",
      items: [],
    };
    expect(() => createAdvanceRequestSchema.parse(input)).toThrow();
  });

  it("validate approveAdvanceRequestSchema ต้องการ id รูปแบบ UUID", () => {
    const valid = { id: "123e4567-e89b-12d3-a456-426614174000" };
    expect(approveAdvanceRequestSchema.parse(valid).id).toBe("123e4567-e89b-12d3-a456-426614174000");

    expect(() => approveAdvanceRequestSchema.parse({ id: "invalid-uuid" })).toThrow();
  });

  it("validate rejectAdvanceRequestSchema ต้องการ reason", () => {
    const valid = { id: "123e4567-e89b-12d3-a456-426614174000", reason: "เอกสารไม่ครบถ้วน" };
    expect(rejectAdvanceRequestSchema.parse(valid).reason).toBe("เอกสารไม่ครบถ้วน");

    expect(() => rejectAdvanceRequestSchema.parse({ id: "123e4567-e89b-12d3-a456-426614174000", reason: "" })).toThrow();
  });

  it("validate submitClearingSchema สำเร็จเมื่อมีรายการใบเสร็จ", () => {
    const valid = {
      advanceRequestId: "123e4567-e89b-12d3-a456-426614174000",
      actualExpenseTotal: 14500,
      items: [
        {
          receiptNo: "REC-001",
          receiptDate: "2026-10-02",
          expenseTitle: "ค่าที่พัก",
          amount: 6000,
        },
        {
          receiptNo: "REC-002",
          receiptDate: "2026-10-03",
          expenseTitle: "ค่าน้ำมัน",
          amount: 8500,
        },
      ],
    };
    const result = submitClearingSchema.parse(valid);
    expect(result.actualExpenseTotal).toBe(14500);
    expect(result.items).toHaveLength(2);
  });
});
