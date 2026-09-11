import { describe, it, expect } from "vitest";

export function calculateProjectMetrics(allocatedBudget: number, expenses: { amount: number }[]) {
  const totalExpenses = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  const remainingBudget = allocatedBudget - totalExpenses;
  const disbursementRate = allocatedBudget > 0 ? (totalExpenses / allocatedBudget) * 100 : 0;

  return {
    allocatedBudget,
    totalExpenses,
    remainingBudget,
    disbursementRate: Math.round(disbursementRate * 100) / 100,
    isOverBudget: remainingBudget < 0,
  };
}

export function evaluateKpiProgress(target: number, actual: number) {
  if (target <= 0) return { progressRate: 0, status: "PENDING" as const };
  const rate = (actual / target) * 100;
  let status: "ACHIEVED" | "ON_TRACK" | "AT_RISK" | "PENDING";
  if (rate >= 100) status = "ACHIEVED";
  else if (rate >= 75) status = "ON_TRACK";
  else if (rate > 0) status = "AT_RISK";
  else status = "PENDING";

  return {
    progressRate: Math.round(rate * 100) / 100,
    status,
  };
}

describe("Project & Budget Domain Calculations", () => {
  it("คำนวณงบประมาณคงเหลือและอัตราการเบิกจ่ายถูกต้อง", () => {
    const allocated = 1_000_000;
    const expenses = [
      { amount: 250_000 },
      { amount: 350_000 },
      { amount: 150_000 },
    ];
    const metrics = calculateProjectMetrics(allocated, expenses);
    expect(metrics.totalExpenses).toBe(750_000);
    expect(metrics.remainingBudget).toBe(250_000);
    expect(metrics.disbursementRate).toBe(75);
    expect(metrics.isOverBudget).toBe(false);
  });

  it("ตรวจจับกรณีเบิกจ่ายเกินงบประมาณ (Over budget)", () => {
    const allocated = 500_000;
    const expenses = [
      { amount: 300_000 },
      { amount: 250_000 },
    ];
    const metrics = calculateProjectMetrics(allocated, expenses);
    expect(metrics.totalExpenses).toBe(550_000);
    expect(metrics.remainingBudget).toBe(-50_000);
    expect(metrics.disbursementRate).toBe(110);
    expect(metrics.isOverBudget).toBe(true);
  });

  it("ประเมินสถานะ KPI ความก้าวหน้า (ACHIEVED, ON_TRACK, AT_RISK, PENDING)", () => {
    expect(evaluateKpiProgress(100, 120).status).toBe("ACHIEVED");
    expect(evaluateKpiProgress(100, 100).status).toBe("ACHIEVED");
    expect(evaluateKpiProgress(100, 80).status).toBe("ON_TRACK");
    expect(evaluateKpiProgress(100, 40).status).toBe("AT_RISK");
    expect(evaluateKpiProgress(100, 0).status).toBe("PENDING");
  });
});
