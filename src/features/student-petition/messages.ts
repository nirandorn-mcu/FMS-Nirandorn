import type { Dictionary } from "@/shared/lib/i18n/translate";

export const MESSAGES: Dictionary = {
  "petition.nav": { th: "คำร้องนิสิตออนไลน์", en: "Student Petitions" },
  "petition.title": { th: "ระบบนิสิตยื่นคำร้องออนไลน์", en: "Student Online Petitions" },
  "petition.subtitle": { th: "ยื่นคำร้องวิชาการ/ทั่วไป ติดตามสถานะ และดำเนินการตามลำดับขั้นการอนุมัติ", en: "Submit academic/general petitions and track approval progress" },
  "petition.create": { th: "ยื่นคำร้องใหม่", en: "New Petition" },
  "petition.createSuccess": { th: "ยื่นคำร้องออนไลน์สำเร็จ", en: "Petition submitted successfully" },
  "petition.cancelSuccess": { th: "ยกเลิกคำร้องเรียบร้อย", en: "Petition cancelled successfully" },
  "petition.advisorSuccess": { th: "บันทึกความเห็นชอบโดยอาจารย์ที่ปรึกษาสำเร็จ", en: "Advisor approval recorded" },
  "petition.officerSuccess": { th: "ฝ่ายทะเบียน/วิชาการตรวจสอบและส่งต่อสำเร็จ", en: "Officer review completed" },
  "petition.deanSuccess": { th: "คณบดีอนุมัติคำร้องเรียบร้อยแล้ว", en: "Dean approval completed" },
  "petition.rejectSuccess": { th: "ปฏิเสธ/ตีกลับคำร้องเรียบร้อย", en: "Petition rejected" },

  // Fields
  "petition.ticketNo": { th: "เลขที่คำร้อง", en: "Ticket No." },
  "petition.studentCode": { th: "รหัสนิสิต", en: "Student ID" },
  "petition.studentName": { th: "ชื่อ-นามสกุล นิสิต", en: "Student Name" },
  "petition.studentEmail": { th: "อีเมลนิสิต", en: "Student Email" },
  "petition.major": { th: "สาขาวิชา / ภาควิชา", en: "Major / Dept." },
  "petition.yearLevel": { th: "ชั้นปีที่", en: "Year Level" },
  "petition.type": { th: "ประเภทคำร้อง", en: "Petition Type" },
  "petition.titleField": { th: "หัวข้อคำร้อง", en: "Petition Title" },
  "petition.detailsField": { th: "รายละเอียดและเหตุผลความจำเป็น", en: "Details & Reasons" },
  "petition.evidenceUrl": { th: "ลิงก์ไฟล์หลักฐาน / เอกสารแนบ", en: "Evidence / Attachment URL" },
  "petition.submittedAt": { th: "วันที่ยื่นคำร้อง", en: "Submitted Date" },
  "petition.comment": { th: "ความเห็นประกอบการพิจารณา", en: "Reviewer Comment" },
  "petition.commentPh": { th: "ระบุความเห็นหรือข้อเสนอแนะเพิ่มเติม...", en: "Add comments or notes..." },
  "petition.rejectReason": { th: "เหตุผลที่ไม่อนุมัติ / ตีกลับ", en: "Rejection Reason" },
  "petition.rejectReasonPh": { th: "ระบุเหตุผลในการไม่อนุมัติหรือข้อแก้ไข...", en: "Specify rejection reason..." },

  // Petition Types
  "petition.type.LATE_ENROLL": { th: "ขอลงทะเบียนเรียนล่าช้า", en: "Late Course Registration" },
  "petition.type.LEAVE": { th: "ขอลาพักการเรียน", en: "Leave of Absence" },
  "petition.type.RESIGN": { th: "ขอลาออกจากการเป็นนิสิต", en: "Student Resignation" },
  "petition.type.TUITION_WAIVER": { th: "ขอผ่อนผันค่าธรรมเนียมการศึกษา", en: "Tuition Fee Deferral" },
  "petition.type.COURSE_ADD_DROP": { th: "ขอเพิ่ม-ถอนรายวิชาล่าช้า", en: "Late Add/Drop Course" },
  "petition.type.GENERAL": { th: "คำร้องทั่วไป", en: "General Petition" },

  // Statuses
  "petition.status.all": { th: "สถานะทั้งหมด", en: "All Statuses" },
  "petition.status.SUBMITTED": { th: "ยื่นคำร้องแล้ว (รอที่ปรึกษา)", en: "Submitted (Pending Advisor)" },
  "petition.status.ADVISOR_APPROVED": { th: "ที่ปรึกษาเห็นชอบ (รอทะเบียน)", en: "Advisor Approved (Pending Officer)" },
  "petition.status.OFFICER_APPROVED": { th: "ทะเบียนตรวจสอบแล้ว (รอคณบดี)", en: "Officer Approved (Pending Dean)" },
  "petition.status.DEAN_APPROVED": { th: "คณบดีอนุมัติแล้ว", en: "Dean Approved (Completed)" },
  "petition.status.REJECTED": { th: "ไม่อนุมัติ / ตีกลับ", en: "Rejected" },
  "petition.status.CANCELLED": { th: "ยกเลิกคำร้อง", en: "Cancelled" },

  // Actions
  "petition.action.advisorApprove": { th: "ที่ปรึกษาให้ความเห็นชอบ", en: "Advisor Approve" },
  "petition.action.officerApprove": { th: "ทะเบียนตรวจสอบและส่งต่อ", en: "Officer Forward" },
  "petition.action.deanApprove": { th: "คณบดีอนุมัติคำร้อง", en: "Dean Approve" },
  "petition.action.reject": { th: "ปฏิเสธ / ตีกลับ", en: "Reject Petition" },
  "petition.action.cancel": { th: "ยกเลิกคำร้อง", en: "Cancel Petition" },
  "petition.action.viewDetail": { th: "ดูรายละเอียดและไทม์ไลน์", en: "View Details & Timeline" },

  // KPIs
  "petition.kpi.total": { th: "คำร้องทั้งหมด", en: "Total Petitions" },
  "petition.kpi.pendingAdvisor": { th: "รอที่ปรึกษาพิจารณา", en: "Pending Advisor" },
  "petition.kpi.pendingOfficer": { th: "รอฝ่ายทะเบียนตรวจสอบ", en: "Pending Officer" },
  "petition.kpi.pendingDean": { th: "รอคณบดีอนุมัติ", en: "Pending Dean" },
  "petition.kpi.completed": { th: "อนุมัติเสร็จสิ้น", en: "Completed" },

  // Stepper & Timeline
  "petition.step.submitted": { th: "1. นิสิตยื่นคำร้อง", en: "1. Submission" },
  "petition.step.advisor": { th: "2. อาจารย์ที่ปรึกษา", en: "2. Advisor Review" },
  "petition.step.officer": { th: "3. ฝ่ายทะเบียน/วิชาการ", en: "3. Registrar Check" },
  "petition.step.dean": { th: "4. คณบดีอนุมัติ", en: "4. Dean Final Approval" },
  "petition.history.title": { th: "ประวัติการดำเนินการ (Audit Timeline)", en: "Action History" },

  // Empty state
  "petition.empty": { th: "ไม่พบข้อมูลคำร้องนิสิต", en: "No student petitions found" },
  "petition.emptyDesc": { th: "ยังไม่มีคำร้องที่ยื่นเข้ามาในระบบ หรือไม่ตรงกับตัวกรองที่เลือก", en: "No petitions submitted yet or matching the current filter." },

  // RBAC & Module keys (Required for i18n test suite)
  "roles.module.petition": { th: "คำร้องนิสิตออนไลน์", en: "Student Petitions" },
  "perm.petition:read": { th: "ดูรายการคำร้องนิสิต", en: "View student petitions" },
  "perm.petition:create": { th: "ยื่นและยกเลิกคำร้องนิสิต", en: "Submit and cancel petitions" },
  "perm.petition:advisor": { th: "อาจารย์ที่ปรึกษาพิจารณาคำร้อง", en: "Advisor review petitions" },
  "perm.petition:officer": { th: "เจ้าหน้าที่ทะเบียนตรวจสอบคำร้อง", en: "Officer review petitions" },
  "perm.petition:dean": { th: "คณบดีอนุมัติคำร้อง", en: "Dean approve petitions" },
  "perm.petition:manage": { th: "จัดการระบบคำร้องนิสิต", en: "Manage student petitions" },
};
