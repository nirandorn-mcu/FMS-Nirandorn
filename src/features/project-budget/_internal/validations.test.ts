import { describe, it, expect } from "vitest";
import {
  createProjectSchema,
  updateProjectSchema,
  addProjectExpenseSchema,
  deleteProjectExpenseSchema,
  addProjectKpiSchema,
  updateProjectKpiSchema,
} from "./validations";

describe("project-budget validations", () => {
  it("validate createProjectSchema สำเร็จเมื่อข้อมูลครบถ้วน", () => {
    const input = {
      code: "PRJ-2569-001",
      nameTh: "โครงการพัฒนานวัตกรรมดิจิทัลเพื่อการศึกษา",
      fiscalYear: 2569,
      budgetSource: "GOVERNMENT",
      allocatedBudget: 500000,
      responsiblePersonId: "123e4567-e89b-12d3-a456-426614174000",
      startDate: "2026-10-01",
      endDate: "2027-09-30",
      kpis: [
        {
          indicatorName: "จำนวนผู้เข้าร่วมอบรม",
          targetValue: 100,
          unit: "คน",
        },
      ],
    };
    const result = createProjectSchema.parse(input);
    expect(result.code).toBe("PRJ-2569-001");
    expect(result.budgetSource).toBe("GOVERNMENT");
    expect(result.allocatedBudget).toBe(500000);
    expect(result.kpis).toHaveLength(1);
  });

  it("validate createProjectSchema ล้มเมื่องบประมาณติดลบหรือไม่ถูกต้อง", () => {
    const input = {
      code: "PRJ-2569-001",
      nameTh: "โครงการพัฒนานวัตกรรมดิจิทัลเพื่อการศึกษา",
      fiscalYear: 2569,
      budgetSource: "GOVERNMENT",
      allocatedBudget: -100,
      responsiblePersonId: "123e4567-e89b-12d3-a456-426614174000",
      startDate: "2026-10-01",
      endDate: "2027-09-30",
    };
    expect(() => createProjectSchema.parse(input)).toThrow();
  });

  it("validate updateProjectSchema", () => {
    const input = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      nameTh: "โครงการพัฒนาทักษะดิจิทัล (ปรับปรุง)",
      fiscalYear: 2569,
      budgetSource: "REVENUE",
      allocatedBudget: 350000,
      status: "IN_PROGRESS",
      startDate: "2026-10-01",
      endDate: "2027-09-30",
    };
    const result = updateProjectSchema.parse(input);
    expect(result.status).toBe("IN_PROGRESS");
    expect(result.allocatedBudget).toBe(350000);
  });

  it("validate addProjectExpenseSchema", () => {
    const input = {
      projectId: "123e4567-e89b-12d3-a456-426614174000",
      title: "ค่าวิทยากรบรรยาย",
      amount: 15000,
      expenseDate: "2026-11-15",
      receiptRef: "REC-2026-001",
    };
    const result = addProjectExpenseSchema.parse(input);
    expect(result.amount).toBe(15000);
    expect(result.title).toBe("ค่าวิทยากรบรรยาย");
  });

  it("validate deleteProjectExpenseSchema", () => {
    const input = {
      id: "123e4567-e89b-12d3-a456-426614174001",
      projectId: "123e4567-e89b-12d3-a456-426614174000",
    };
    const result = deleteProjectExpenseSchema.parse(input);
    expect(result.id).toBe("123e4567-e89b-12d3-a456-426614174001");
  });

  it("validate addProjectKpiSchema และ updateProjectKpiSchema", () => {
    const kpiInput = {
      projectId: "123e4567-e89b-12d3-a456-426614174000",
      indicatorName: "ระดับความพึงพอใจ",
      targetValue: 4.5,
      unit: "คะแนน",
    };
    const kpi = addProjectKpiSchema.parse(kpiInput);
    expect(kpi.targetValue).toBe(4.5);

    const updateKpiInput = {
      id: "123e4567-e89b-12d3-a456-426614174002",
      actualValue: 4.8,
      status: "ACHIEVED",
    };
    const updated = updateProjectKpiSchema.parse(updateKpiInput);
    expect(updated.actualValue).toBe(4.8);
    expect(updated.status).toBe("ACHIEVED");
  });
});
