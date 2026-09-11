import { describe, it, expect } from "vitest";

export type PetitionStatus =
  | "SUBMITTED"
  | "ADVISOR_APPROVED"
  | "OFFICER_APPROVED"
  | "DEAN_APPROVED"
  | "REJECTED"
  | "CANCELLED";

export function canTransitionPetition(current: PetitionStatus, next: PetitionStatus): boolean {
  if (current === next) return false;
  if (current === "DEAN_APPROVED" || current === "REJECTED" || current === "CANCELLED") {
    return false; // Terminal states
  }

  const allowedMap: Record<PetitionStatus, PetitionStatus[]> = {
    SUBMITTED: ["ADVISOR_APPROVED", "REJECTED", "CANCELLED"],
    ADVISOR_APPROVED: ["OFFICER_APPROVED", "REJECTED", "CANCELLED"],
    OFFICER_APPROVED: ["DEAN_APPROVED", "REJECTED", "CANCELLED"],
    DEAN_APPROVED: [],
    REJECTED: [],
    CANCELLED: [],
  };

  return allowedMap[current]?.includes(next) ?? false;
}

describe("Student Petition State Machine Transitions", () => {
  it("อนุญาตให้เดินสถานะตามลำดับ 3 ขั้นตอน", () => {
    expect(canTransitionPetition("SUBMITTED", "ADVISOR_APPROVED")).toBe(true);
    expect(canTransitionPetition("ADVISOR_APPROVED", "OFFICER_APPROVED")).toBe(true);
    expect(canTransitionPetition("OFFICER_APPROVED", "DEAN_APPROVED")).toBe(true);
  });

  it("ไม่อนุญาตให้ข้ามขั้นตอน เช่น จาก SUBMITTED ไป DEAN_APPROVED โดยตรง", () => {
    expect(canTransitionPetition("SUBMITTED", "OFFICER_APPROVED")).toBe(false);
    expect(canTransitionPetition("SUBMITTED", "DEAN_APPROVED")).toBe(false);
    expect(canTransitionPetition("ADVISOR_APPROVED", "DEAN_APPROVED")).toBe(false);
  });

  it("อนุญาตให้ปฏิเสธ (REJECTED) หรือยกเลิก (CANCELLED) ในขั้นตอนที่ยังไม่สิ้นสุด", () => {
    expect(canTransitionPetition("SUBMITTED", "REJECTED")).toBe(true);
    expect(canTransitionPetition("SUBMITTED", "CANCELLED")).toBe(true);
    expect(canTransitionPetition("ADVISOR_APPROVED", "REJECTED")).toBe(true);
    expect(canTransitionPetition("OFFICER_APPROVED", "REJECTED")).toBe(true);
  });

  it("ไม่อนุญาตให้เปลี่ยนสถานะหลังจากที่คณบดีอนุมัติแล้ว หรือถูกปฏิเสธ/ยกเลิกแล้ว (Terminal state)", () => {
    expect(canTransitionPetition("DEAN_APPROVED", "REJECTED")).toBe(false);
    expect(canTransitionPetition("DEAN_APPROVED", "CANCELLED")).toBe(false);
    expect(canTransitionPetition("REJECTED", "SUBMITTED")).toBe(false);
    expect(canTransitionPetition("CANCELLED", "ADVISOR_APPROVED")).toBe(false);
  });
});
