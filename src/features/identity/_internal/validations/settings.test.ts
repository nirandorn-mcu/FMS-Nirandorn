import { describe, it, expect } from "vitest";
import { updateSettingsSchema } from "./settings";

describe("updateSettingsSchema", () => {
  it("ยอมรับข้อมูลการตั้งค่าองค์กรและข้อมูลการติดต่อที่ถูกต้อง", () => {
    const input = {
      nameTh: "คณะการบริหารและนวัตกรรมดิจิทัล",
      nameEn: "Faculty of Management and Digital Innovation",
      logoUrl: "/uploads/logo.png",
      palette: "blue",
      contactPhone: "02-123-4567 ต่อ 8001-8005",
      contactEmail: "contact@fms.ac.th",
      contactAddress: "อาคารเฉลิมพระเกียรติฯ 123",
      contactOfficeHours: "วันจันทร์ - วันศุกร์ เวลา 08:30 - 16:30 น.",
      quickExtEdu: "ext. 8002",
      quickExtFinance: "ext. 8004",
      quickExtPlan: "ext. 8005",
      contactFacebook: "fms.official",
      contactLine: "@fms-official",
      contactWebsite: "https://fms.ac.th",
    };

    const res = updateSettingsSchema.safeParse(input);
    expect(res.success).toBe(true);
  });

  it("ยอมรับกรณีไม่ได้กรอกข้อมูลการติดต่อ (optional หรือ empty string)", () => {
    const input = {
      nameTh: "คณะการบริหารและนวัตกรรมดิจิทัล",
      nameEn: "Faculty of Management and Digital Innovation",
      palette: "blue",
      contactEmail: "",
      contactPhone: "",
    };

    const res = updateSettingsSchema.safeParse(input);
    expect(res.success).toBe(true);
  });

  it("ปฏิเสธรูปแบบอีเมลติดต่อที่ไม่ถูกต้อง", () => {
    const input = {
      nameTh: "คณะการบริหารและนวัตกรรมดิจิทัล",
      nameEn: "Faculty of Management and Digital Innovation",
      palette: "blue",
      contactEmail: "invalid-email",
    };

    const res = updateSettingsSchema.safeParse(input);
    expect(res.success).toBe(false);
  });
});
