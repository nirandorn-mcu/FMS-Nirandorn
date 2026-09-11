import { describe, it, expect } from "vitest";

export interface WorkflowState {
  currentStep: number;
  totalSteps: number;
  status: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "CANCELLED";
}

export function advanceWorkflowStep(
  state: WorkflowState,
  action: "APPROVE" | "REJECT",
): WorkflowState {
  if (state.status !== "PENDING_APPROVAL") {
    throw new Error("Cannot transition non-pending document");
  }

  if (action === "REJECT") {
    return {
      ...state,
      status: "REJECTED",
    };
  }

  // APPROVE
  const isLastStep = state.currentStep >= state.totalSteps;
  if (isLastStep) {
    return {
      ...state,
      status: "APPROVED",
    };
  }

  return {
    ...state,
    currentStep: state.currentStep + 1,
    status: "PENDING_APPROVAL",
  };
}

export function calculateWorkflowProgress(currentStep: number, totalSteps: number, status: string): number {
  if (status === "APPROVED") return 100;
  if (status === "DRAFT") return 0;
  if (status === "REJECTED" || status === "CANCELLED") return Math.round(((currentStep - 1) / totalSteps) * 100);
  // PENDING_APPROVAL
  return Math.round(((currentStep - 1) / totalSteps) * 100);
}

describe("Document Workflow Domain Transitions", () => {
  it("เลื่อนขั้นการอนุมัติ 3 ขั้นตอนต่อเนื่องจนเสร็จสิ้น (APPROVED)", () => {
    let state: WorkflowState = {
      currentStep: 1,
      totalSteps: 3,
      status: "PENDING_APPROVAL",
    };

    // Step 1: Head of Dept approves
    state = advanceWorkflowStep(state, "APPROVE");
    expect(state.currentStep).toBe(2);
    expect(state.status).toBe("PENDING_APPROVAL");

    // Step 2: Associate Dean approves
    state = advanceWorkflowStep(state, "APPROVE");
    expect(state.currentStep).toBe(3);
    expect(state.status).toBe("PENDING_APPROVAL");

    // Step 3: Dean approves
    state = advanceWorkflowStep(state, "APPROVE");
    expect(state.currentStep).toBe(3);
    expect(state.status).toBe("APPROVED");
  });

  it("ส่งกลับหรือไม่ยินยอม (REJECT) ในขั้นตอนระหว่างทาง", () => {
    let state: WorkflowState = {
      currentStep: 2,
      totalSteps: 3,
      status: "PENDING_APPROVAL",
    };

    state = advanceWorkflowStep(state, "REJECT");
    expect(state.currentStep).toBe(2);
    expect(state.status).toBe("REJECTED");
  });

  it("คำนวณร้อยละความก้าวหน้าของเส้นทางการอนุมัติ (calculateWorkflowProgress)", () => {
    expect(calculateWorkflowProgress(1, 3, "DRAFT")).toBe(0);
    expect(calculateWorkflowProgress(1, 4, "PENDING_APPROVAL")).toBe(0);
    expect(calculateWorkflowProgress(2, 4, "PENDING_APPROVAL")).toBe(25);
    expect(calculateWorkflowProgress(3, 4, "PENDING_APPROVAL")).toBe(50);
    expect(calculateWorkflowProgress(4, 4, "PENDING_APPROVAL")).toBe(75);
    expect(calculateWorkflowProgress(4, 4, "APPROVED")).toBe(100);
  });
});
