import { describe, it, expect } from "vitest";

export function calculateAdvanceSummary(items: { amount: number }[], clearingItems: { actualAmount: number }[] = []) {
  const totalAdvance = items.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
  const totalSpent = clearingItems.reduce((acc, it) => acc + (Number(it.actualAmount) || 0), 0);
  const diff = totalSpent - totalAdvance;

  return {
    totalAdvance,
    totalSpent,
    diff,
    status: diff > 0 ? "REIMBURSE" : diff < 0 ? "RETURN" : "EXACT",
    amountToReturn: diff < 0 ? Math.abs(diff) : 0,
    amountToReimburse: diff > 0 ? diff : 0,
  };
}

describe("Advance Payment Domain Calculations", () => {
  it("คำนวณยอดเงินยืมรวมจากรายการย่อยถูกต้อง", () => {
    const items = [
      { amount: 5000 },
      { amount: 2500 },
      { amount: 1500 },
    ];
    const summary = calculateAdvanceSummary(items);
    expect(summary.totalAdvance).toBe(9000);
    expect(summary.totalSpent).toBe(0);
    expect(summary.status).toBe("RETURN");
    expect(summary.amountToReturn).toBe(9000);
  });

  it("คำนวณกรณีใช้เงินน้อยกว่าที่ยืม (ต้องคืนเงินคงเหลือ)", () => {
    const items = [{ amount: 10000 }];
    const clearing = [
      { actualAmount: 4500 },
      { actualAmount: 3500 },
    ];
    const summary = calculateAdvanceSummary(items, clearing);
    expect(summary.totalAdvance).toBe(10000);
    expect(summary.totalSpent).toBe(8000);
    expect(summary.diff).toBe(-2000);
    expect(summary.status).toBe("RETURN");
    expect(summary.amountToReturn).toBe(2000);
    expect(summary.amountToReimburse).toBe(0);
  });

  it("คำนวณกรณีใช้เงินเกินกว่าที่ยืม (ต้องเบิกเงินเพิ่ม)", () => {
    const items = [{ amount: 5000 }];
    const clearing = [
      { actualAmount: 3000 },
      { actualAmount: 2800 },
    ];
    const summary = calculateAdvanceSummary(items, clearing);
    expect(summary.totalAdvance).toBe(5000);
    expect(summary.totalSpent).toBe(5800);
    expect(summary.diff).toBe(800);
    expect(summary.status).toBe("REIMBURSE");
    expect(summary.amountToReturn).toBe(0);
    expect(summary.amountToReimburse).toBe(800);
  });

  it("คำนวณกรณีใช้เงินพอดีกับที่ยืม", () => {
    const items = [{ amount: 5000 }];
    const clearing = [{ actualAmount: 5000 }];
    const summary = calculateAdvanceSummary(items, clearing);
    expect(summary.diff).toBe(0);
    expect(summary.status).toBe("EXACT");
    expect(summary.amountToReturn).toBe(0);
    expect(summary.amountToReimburse).toBe(0);
  });
});
