import type { Dictionary } from "@/shared/lib/i18n/translate";

export const MESSAGES: Dictionary = {
  "advance.nav": { th: "เงินยืมทดลองจ่าย", en: "Advance Payment" },
  "advance.title": { th: "ระบบบริหารจัดการเงินยืมทดลองจ่าย", en: "Advance Payment & Clearing" },
  "advance.subtitle": { th: "ยื่นคำขอยืมเงินทดลองจ่าย ติดตามสถานะ และส่งใช้เงินยืม (Clearing)", en: "Manage advance requests, disbursement, and expense clearing" },
  "advance.create": { th: "ยื่นคำขอยืมเงิน", en: "New Advance Request" },
  "advance.createSuccess": { th: "ยื่นคำขอยืมเงินสำเร็จ", en: "Advance request submitted successfully" },
  "advance.updateSuccess": { th: "บันทึกการแก้ไขสำเร็จ", en: "Advance request updated successfully" },
  "advance.approveSuccess": { th: "อนุมัติคำขอยืมเงินสำเร็จ", en: "Advance request approved successfully" },
  "advance.rejectSuccess": { th: "ปฏิเสธคำขอยืมเงินเรียบร้อย", en: "Advance request rejected" },
  "advance.disburseSuccess": { th: "บันทึกการจ่ายเงินยืมสำเร็จ", en: "Advance payment disbursed successfully" },
  "advance.clearSuccess": { th: "ส่งใช้เงินยืม (Clearing) สำเร็จ", en: "Clearing submitted successfully" },
  "advance.approveClearingSuccess": { th: "ตรวจรับการส่งใช้เงินยืมเรียบร้อย", en: "Clearing approved successfully" },
  
  // Fields
  "advance.reqNo": { th: "เลขที่คำขอ", en: "Request No." },
  "advance.borrower": { th: "ผู้ขอยืมเงิน", en: "Borrower" },
  "advance.titleField": { th: "ชื่องาน / วัตถุประสงค์", en: "Title / Purpose" },
  "advance.descriptionField": { th: "รายละเอียดเพิ่มเติม", en: "Description" },
  "advance.amountField": { th: "จำนวนเงินที่ขอยืม (บาท)", en: "Amount (THB)" },
  "advance.eventStartDate": { th: "วันเริ่มกิจกรรม", en: "Start Date" },
  "advance.eventEndDate": { th: "วันสิ้นสุดกิจกรรม", en: "End Date" },
  "advance.dueDateClearing": { th: "กำหนดส่งใช้เงินยืม", en: "Clearing Due Date" },
  "advance.bankName": { th: "ธนาคาร", en: "Bank Name" },
  "advance.bankAccountName": { th: "ชื่อบัญชีรับเงิน", en: "Account Name" },
  "advance.bankAccountNo": { th: "เลขที่บัญชี", en: "Account Number" },
  "advance.items": { th: "รายการประมาณการค่าใช้จ่าย", en: "Estimated Items" },
  "advance.addItem": { th: "เพิ่มรายการค่าใช้จ่าย", en: "Add Expense Item" },
  "advance.itemDescription": { th: "รายการ", en: "Item Description" },
  "advance.itemAmount": { th: "ประมาณการ (บาท)", en: "Estimated (THB)" },
  
  // Statuses
  "advance.status.all": { th: "ทั้งหมด", en: "All" },
  "advance.status.DRAFT": { th: "แบบร่าง", en: "Draft" },
  "advance.status.SUBMITTED": { th: "รออนุมัติ", en: "Pending Approval" },
  "advance.status.APPROVED": { th: "อนุมัติแล้ว (รอจ่ายเงิน)", en: "Approved (Pending Disburse)" },
  "advance.status.REJECTED": { th: "ไม่อนุมัติ", en: "Rejected" },
  "advance.status.DISBURSED": { th: "จ่ายเงินแล้ว (รอส่งใช้)", en: "Disbursed (Pending Clearing)" },
  "advance.status.CLEARED": { th: "ส่งใช้เงินยืมแล้ว", en: "Cleared" },
  "advance.status.OVERDUE": { th: "เกินกำหนดส่งใช้", en: "Overdue" },

  // Dialogs & Actions
  "advance.action.approve": { th: "อนุมัติคำขอ", en: "Approve Request" },
  "advance.action.reject": { th: "ปฏิเสธคำขอ", en: "Reject Request" },
  "advance.action.disburse": { th: "บันทึกการจ่ายเงิน", en: "Mark as Disbursed" },
  "advance.action.clear": { th: "ยื่นส่งใช้เงินยืม (Clear)", en: "Submit Clearing" },
  "advance.action.approveClearing": { th: "ตรวจรับการส่งใช้เงินยืม", en: "Approve Clearing" },
  "advance.action.viewDetail": { th: "ดูรายละเอียด", en: "View Details" },
  
  // Clearing Form
  "advance.clearing.title": { th: "แบบฟอร์มส่งใช้เงินยืมทดลองจ่าย", en: "Advance Clearing Form" },
  "advance.clearing.actualExpense": { th: "ยอดค่าใช้จ่ายจริงรวม (บาท)", en: "Total Actual Expense (THB)" },
  "advance.clearing.borrowAmount": { th: "ยอดเงินที่ยืมไป (บาท)", en: "Advance Borrowed (THB)" },
  "advance.clearing.refundAmount": { th: "ยอดเงินส่งคืนคณะ (บาท)", en: "Refund Amount to Faculty (THB)" },
  "advance.clearing.reimburseAmount": { th: "ยอดขอเบิกเพิ่ม (บาท)", en: "Reimbursement Claim (THB)" },
  "advance.clearing.receipts": { th: "รายการใบเสร็จ/หลักฐานการจ่าย", en: "Receipts & Expense Items" },
  "advance.clearing.addReceipt": { th: "เพิ่มรายการใบเสร็จ", en: "Add Receipt Item" },
  "advance.clearing.receiptNo": { th: "เลขที่ใบเสร็จ", en: "Receipt No." },
  "advance.clearing.receiptDate": { th: "วันที่ในใบเสร็จ", en: "Receipt Date" },
  "advance.clearing.expenseTitle": { th: "รายการค่าใช้จ่าย", en: "Expense Title" },
  "advance.clearing.proofUrl": { th: "ลิงก์ไฟล์หลักฐาน/สลิปโอนคืน", en: "Receipt / Transfer Slip URL" },
  "advance.clearing.notes": { th: "หมายเหตุ / สรุปผลการใช้จ่าย", en: "Notes / Summary" },
  
  // Rejection & Remarks
  "advance.rejectReason": { th: "เหตุผลที่ปฏิเสธ", en: "Rejection Reason" },
  "advance.rejectReasonPh": { th: "ระบุเหตุผลในการไม่อนุมัติ...", en: "Specify rejection reason..." },

  // KPIs
  "advance.kpi.totalOutstanding": { th: "ยอดเงินยืมคงค้าง", en: "Total Outstanding" },
  "advance.kpi.pendingApproval": { th: "รออนุมัติ", en: "Pending Approval" },
  "advance.kpi.pendingClearing": { th: "รอส่งใช้เงินยืม", en: "Pending Clearing" },
  "advance.kpi.overdue": { th: "เกินกำหนดส่งใช้", en: "Overdue Items" },

  // Empty state
  "advance.empty": { th: "ไม่พบรายการเงินยืมทดลองจ่าย", en: "No advance requests found" },
  "advance.emptyDesc": { th: "เริ่มต้นสร้างคำขอยืมเงินทดลองจ่ายเพื่อจัดกิจกรรมหรือดำเนินงาน", en: "Create an advance request to start tracking your project expenses" },
  "advance.overdueWarning": { th: "ท่านมีรายการเงินยืมที่เกินกำหนดส่งใช้ กรุณาติดต่อฝ่ายการเงินก่อนยื่นขอยืมใหม่", en: "You have overdue advance requests. Please clear previous advances before creating a new request." },

  // RBAC & Module keys
  "roles.module.advance": { th: "เงินยืมทดลองจ่าย", en: "Advance Payment" },
  "perm.advance:read": { th: "ดูรายการเงินยืมทดลองจ่าย", en: "View advance requests" },
  "perm.advance:create": { th: "ยื่นคำขอยืมเงินและส่งใช้เงินยืม", en: "Create advance and submit clearing" },
  "perm.advance:approve": { th: "อนุมัติคำขอยืมเงิน", en: "Approve advance requests" },
  "perm.advance:finance": { th: "จ่ายเงินยืมและตรวจรับเคลียร์เงิน", en: "Disburse and approve clearing" },
  "perm.advance:manage": { th: "จัดการระบบเงินยืมทดลองจ่าย", en: "Manage advance payments" },
};
