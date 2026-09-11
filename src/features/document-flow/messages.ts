import type { Dictionary } from "@/shared/lib/i18n/translate";

export const MESSAGES: Dictionary = {
  "doc.nav": { th: "ระบบเสนอขออนุมัติและเอกสาร", en: "Document Approval Flow" },
  "doc.title": { th: "ระบบเสนอขออนุมัติและเอกสารอิเล็กทรอนิกส์", en: "Electronic Document & Approval Flow" },
  "doc.subtitle": { th: "ติดตามสถานะหนังสือราชการ บันทึกข้อความ และการลงนามอนุมัติตามลำดับขั้น (Multi-Step Approval)", en: "Track official memos, approvals, and multi-step signing workflows" },
  "doc.create": { th: "สร้างหนังสือขออนุมัติใหม่", en: "New Document Request" },
  "doc.createSuccess": { th: "สร้างและร่างหนังสือสำเร็จ", en: "Document created successfully" },
  "doc.submitSuccess": { th: "ส่งหนังสือเข้าสู่กระบวนการพิจารณาสำเร็จ", en: "Document submitted for approval" },
  "doc.approveSuccess": { th: "ลงนาม / อนุมัติขั้นตอนสำเร็จ", en: "Step approved successfully" },
  "doc.rejectSuccess": { th: "ส่งกลับ / ไม่อนุมัติเอกสารเรียบร้อย", en: "Document rejected successfully" },
  "doc.commentSuccess": { th: "เพิ่มความคิดเห็นเรียบร้อย", en: "Comment added successfully" },

  // Fields
  "doc.docNo": { th: "เลขที่หนังสือ / บันทึกข้อความ", en: "Document No." },
  "doc.titleField": { th: "เรื่อง / หัวข้อหนังสือ", en: "Subject / Title" },
  "doc.docType": { th: "ประเภทเอกสาร", en: "Document Type" },
  "doc.urgency": { th: "ชั้นความเร็ว", en: "Urgency" },
  "doc.confidentiality": { th: "ชั้นความลับ", en: "Confidentiality" },
  "doc.creator": { th: "ผู้ร่าง / ผู้เสนอ", en: "Author / Requester" },
  "doc.currentStep": { th: "ขั้นตอนปัจจุบัน", en: "Current Step" },
  "doc.status": { th: "สถานะหนังสือ", en: "Document Status" },
  "doc.content": { th: "เนื้อหา / รายละเอียดบันทึก", en: "Content / Body" },
  "doc.attachmentUrl": { th: "ไฟล์แนบ (URL / Drive)", en: "Attachment URL" },
  "doc.tags": { th: "ป้ายกำกับ / หมวดหมู่", en: "Tags / Categories" },
  "doc.createdAt": { th: "วันที่สร้างเอกสาร", en: "Date Created" },
  "doc.updatedAt": { th: "ปรับปรุงล่าสุด", en: "Last Updated" },

  // Types
  "doc.type.MEMO": { th: "บันทึกข้อความภายใน", en: "Internal Memo" },
  "doc.type.ANNOUNCEMENT": { th: "ประกาศคณะ", en: "Faculty Announcement" },
  "doc.type.ORDER": { th: "คำสั่งแต่งตั้ง / คำสั่งคณะ", en: "Faculty Order" },
  "doc.type.PETITION": { th: "คำร้องขออนุมัติทั่วไป", en: "General Petition" },
  "doc.type.CONTRACT": { th: "สัญญา / ข้อตกลงความร่วมมือ", en: "Contract / MOU" },
  "doc.type.REPORT": { th: "รายงานสรุป / รายงานผล", en: "Summary Report" },
  "doc.type.OTHER": { th: "เอกสารอื่น ๆ", en: "Other Documents" },

  // Urgency
  "doc.urgency.NORMAL": { th: "ปกติ", en: "Normal" },
  "doc.urgency.URGENT": { th: "ด่วน", en: "Urgent" },
  "doc.urgency.VERY_URGENT": { th: "ด่วนมาก", en: "Very Urgent" },
  "doc.urgency.MOST_URGENT": { th: "ด่วนที่สุด", en: "Most Urgent" },

  // Confidentiality
  "doc.confidentiality.NORMAL": { th: "ปกติ", en: "Normal" },
  "doc.confidentiality.CONFIDENTIAL": { th: "ลับ", en: "Confidential" },
  "doc.confidentiality.VERY_CONFIDENTIAL": { th: "ลับมาก", en: "Very Confidential" },
  "doc.confidentiality.TOP_SECRET": { th: "ลับที่สุด", en: "Top Secret" },

  // Status
  "doc.status.all": { th: "ทั้งหมด", en: "All" },
  "doc.status.DRAFT": { th: "ฉบับร่าง", en: "Draft" },
  "doc.status.PENDING_APPROVAL": { th: "อยู่ระหว่างการพิจารณา", en: "Pending Approval" },
  "doc.status.APPROVED": { th: "อนุมัติ / ลงนามครบถ้วน", en: "Approved" },
  "doc.status.REJECTED": { th: "ส่งกลับ / ไม่อนุมัติ", en: "Rejected" },
  "doc.status.CANCELLED": { th: "ยกเลิกเอกสาร", en: "Cancelled" },

  // Workflow Steps
  "doc.workflow.title": { th: "เส้นทางการพิจารณาและลงนาม (Workflow Steps)", en: "Approval Workflow Steps" },
  "doc.workflow.step": { th: "ลำดับที่", en: "Step" },
  "doc.workflow.role": { th: "ตำแหน่งผู้พิจารณา", en: "Approver Role" },
  "doc.workflow.status": { th: "ผลการพิจารณา", en: "Step Status" },
  "doc.workflow.actionAt": { th: "วันที่ลงนาม / พิจารณา", en: "Action Date" },
  "doc.workflow.comment": { th: "ความเห็น / หมายเหตุ", en: "Comment / Note" },
  "doc.workflow.signature": { th: "ลายมือชื่อ / ตราประทับ", en: "Digital Signature" },
  "doc.workflow.PENDING": { th: "รอการพิจารณา", en: "Pending" },
  "doc.workflow.APPROVED": { th: "อนุมัติ / ลงนามแล้ว", en: "Approved" },
  "doc.workflow.REJECTED": { th: "ไม่อนุมัติ / ตีกลับ", en: "Rejected" },
  "doc.workflow.SKIPPED": { th: "ข้ามขั้นตอนนี้", en: "Skipped" },

  // Summary Metrics
  "doc.metric.total": { th: "เอกสารทั้งหมด", en: "Total Documents" },
  "doc.metric.pending": { th: "รอพิจารณา / อนุมัติ", en: "Pending Approval" },
  "doc.metric.approved": { th: "อนุมัติเรียบร้อย", en: "Approved" },
  "doc.metric.rejected": { th: "ส่งกลับ / ไม่อนุมัติ", en: "Rejected" },

  // Actions & Buttons
  "doc.action.viewDetail": { th: "ดูรายละเอียด / ไทม์ไลน์", en: "View Details & Timeline" },
  "doc.action.submit": { th: "ส่งขออนุมัติ", en: "Submit for Approval" },
  "doc.action.approve": { th: "ลงนามอนุมัติ", en: "Approve Step" },
  "doc.action.reject": { th: "ไม่อนุมัติ / ส่งกลับ", en: "Reject Document" },
  "doc.action.addComment": { th: "แสดงความคิดเห็น", en: "Add Comment" },
  "doc.action.saveDraft": { th: "บันทึกร่าง", en: "Save Draft" },

  // Comments
  "doc.comments.title": { th: "ประวัติความคิดเห็นและข้อสั่งการ", en: "Comments & Directives" },
  "doc.comments.empty": { th: "ยังไม่มีความคิดเห็นในเอกสารนี้", en: "No comments yet" },
  "doc.comments.placeholder": { th: "พิมพ์ข้อคิดเห็นหรือข้อสั่งการที่นี่...", en: "Write your comment or directive here..." },

  // Empty state
  "doc.empty": { th: "ไม่พบรายการเอกสาร", en: "No documents found" },
  "doc.emptyDesc": { th: "เริ่มต้นสร้างบันทึกข้อความหรือคำขออนุมัติเพื่อเข้าสู่กระบวนการเวียนเอกสาร", en: "Create a new document request to initiate the multi-step approval workflow." },

  // RBAC & Module keys (Required for i18n and roles test suite)
  "roles.module.doc": { th: "เสนอขออนุมัติและเอกสาร", en: "Document Approval Flow" },
  "perm.doc:read": { th: "ดูรายการเอกสารและติดตามสถานะหนังสือ", en: "View documents and track status" },
  "perm.doc:create": { th: "ร่างและสร้างหนังสือขออนุมัติ", en: "Draft and create approval documents" },
  "perm.doc:approve": { th: "ลงนามและพิจารณาอนุมัติเอกสารตามลำดับขั้น", en: "Sign and approve document workflow steps" },
  "perm.doc:manage": { th: "จัดการประเภทเอกสารและเส้นทางการอนุมัติ", en: "Manage document workflows and settings" },
};
