import type { Dictionary } from "@/shared/lib/i18n/translate";

export const MESSAGES: Dictionary = {
  "project.nav": { th: "บริหารโครงการและงบประมาณ", en: "Projects & Budget" },
  "project.title": { th: "ระบบบริหารจัดการโครงการและงบประมาณ", en: "Project & Budget Management" },
  "project.subtitle": { th: "วางแผน ติดตามการเบิกจ่ายงบประมาณ และประเมินผลสัมฤทธิ์ตัวชี้วัด (KPIs)", en: "Plan, track budget execution, and monitor project KPI achievements" },
  "project.create": { th: "สร้างโครงการใหม่", en: "New Project" },
  "project.edit": { th: "แก้ไขโครงการ", en: "Edit Project" },
  "project.createSuccess": { th: "สร้างโครงการสำเร็จ", en: "Project created successfully" },
  "project.updateSuccess": { th: "บันทึกข้อมูลโครงการเรียบร้อย", en: "Project updated successfully" },
  "project.addExpenseSuccess": { th: "บันทึกการเบิกจ่ายงบประมาณสำเร็จ", en: "Expense recorded successfully" },
  "project.deleteExpenseSuccess": { th: "ลบรายการค่าใช้จ่ายเรียบร้อย", en: "Expense deleted successfully" },
  "project.updateKpiSuccess": { th: "อัปเดตผลตัวชี้วัดสำเร็จ", en: "KPI updated successfully" },
  "project.addKpiSuccess": { th: "เพิ่มตัวชี้วัดโครงการสำเร็จ", en: "KPI added successfully" },

  // Fields
  "project.code": { th: "รหัสโครงการ", en: "Project Code" },
  "project.nameTh": { th: "ชื่อโครงการ (ภาษาไทย)", en: "Project Name (TH)" },
  "project.nameEn": { th: "ชื่อโครงการ (English)", en: "Project Name (EN)" },
  "project.fiscalYear": { th: "ปีงบประมาณ (พ.ศ.)", en: "Fiscal Year" },
  "project.strategicPlan": { th: "ยุทธศาสตร์ / พันธกิจที่สอดคล้อง", en: "Strategic Alignment" },
  "project.budgetSource": { th: "แหล่งเงินงบประมาณ", en: "Budget Source" },
  "project.allocatedBudget": { th: "งบประมาณที่ได้รับจัดสรร (บาท)", en: "Allocated Budget (THB)" },
  "project.spentBudget": { th: "งบประมาณที่ใช้ไป (บาท)", en: "Spent Budget (THB)" },
  "project.remainingBudget": { th: "งบประมาณคงเหลือ (บาท)", en: "Remaining Budget (THB)" },
  "project.executionRate": { th: "อัตราการเบิกจ่าย (%)", en: "Execution Rate (%)" },
  "project.responsiblePerson": { th: "หัวหน้าโครงการ / ผู้รับผิดชอบ", en: "Project Manager" },
  "project.startDate": { th: "วันเริ่มต้นโครงการ", en: "Start Date" },
  "project.endDate": { th: "วันสิ้นสุดโครงการ", en: "End Date" },
  "project.description": { th: "หลักการและเหตุผล / วัตถุประสงค์", en: "Project Description" },
  "project.status": { th: "สถานะโครงการ", en: "Project Status" },

  // Budget Sources
  "project.source.GOVERNMENT": { th: "งบประมาณแผ่นดิน", en: "Government Budget" },
  "project.source.REVENUE": { th: "เงินรายได้คณะ", en: "Faculty Revenue" },
  "project.source.RESEARCH_GRANT": { th: "ทุนวิจัยภายนอก", en: "Research Grant" },
  "project.source.DONATION": { th: "เงินบริจาค / กองทุน", en: "Donation / Fund" },
  "project.source.OTHER": { th: "แหล่งเงินอื่น ๆ", en: "Other Sources" },

  // Project Statuses
  "project.status.all": { th: "ทั้งหมด", en: "All" },
  "project.status.PLANNED": { th: "วางแผน / รอเริ่ม", en: "Planned" },
  "project.status.IN_PROGRESS": { th: "กำลังดำเนินการ", en: "In Progress" },
  "project.status.COMPLETED": { th: "เสร็จสิ้นโครงการ", en: "Completed" },
  "project.status.SUSPENDED": { th: "ระงับชั่วคราว", en: "Suspended" },

  // Expense Tracker
  "project.expenses.title": { th: "รายการเบิกจ่ายงบประมาณ (Expenses)", en: "Project Expenses" },
  "project.expenses.add": { th: "บันทึกรายการเบิกจ่าย", en: "Add Expense" },
  "project.expenses.itemTitle": { th: "รายการค่าใช้จ่าย", en: "Expense Title" },
  "project.expenses.amount": { th: "จำนวนเงิน (บาท)", en: "Amount (THB)" },
  "project.expenses.date": { th: "วันที่เบิกจ่าย", en: "Expense Date" },
  "project.expenses.receiptRef": { th: "เลขที่ใบเสร็จ / ใบสำคัญจ่าย", en: "Receipt / Voucher Ref" },
  "project.expenses.empty": { th: "ยังไม่มีรายการเบิกจ่ายงบประมาณ", en: "No expenses recorded yet" },

  // KPIs
  "project.kpi.title": { th: "ตัวชี้วัดความสำเร็จของโครงการ (KPIs)", en: "Project KPIs" },
  "project.kpi.add": { th: "เพิ่มตัวชี้วัด", en: "Add KPI" },
  "project.kpi.name": { th: "ชื่อตัวชี้วัด", en: "Indicator Name" },
  "project.kpi.target": { th: "เป้าหมาย", en: "Target" },
  "project.kpi.actual": { th: "ผลสัมฤทธิ์จริง", en: "Actual" },
  "project.kpi.unit": { th: "หน่วยนับ", en: "Unit" },
  "project.kpi.status": { th: "สถานะตัวชี้วัด", en: "KPI Status" },
  "project.kpi.PENDING": { th: "รอดำเนินการ", en: "Pending" },
  "project.kpi.ON_TRACK": { th: "เป็นไปตามแผน", en: "On Track" },
  "project.kpi.AT_RISK": { th: "มีความเสี่ยง", en: "At Risk" },
  "project.kpi.ACHIEVED": { th: "บรรลุเป้าหมาย", en: "Achieved" },

  // KPIs Dashboard Cards
  "project.kpi.totalAllocated": { th: "งบประมาณจัดสรรรวม", en: "Total Allocated Budget" },
  "project.kpi.totalSpent": { th: "ยอดเบิกจ่ายรวม", en: "Total Spent Budget" },
  "project.kpi.totalRemaining": { th: "งบประมาณคงเหลือ", en: "Total Remaining Budget" },
  "project.kpi.avgExecutionRate": { th: "อัตราการเบิกจ่ายรวม", en: "Total Execution Rate" },
  "project.kpi.activeProjects": { th: "โครงการที่กำลังดำเนินงาน", en: "Active Projects" },

  // Actions
  "project.action.viewDetail": { th: "ดูรายละเอียด / บันทึกงบและ KPI", en: "View Details, Expenses & KPIs" },
  "project.action.edit": { th: "แก้ไขข้อมูลโครงการ", en: "Edit Project" },

  // Empty state
  "project.empty": { th: "ไม่พบข้อมูลโครงการ", en: "No projects found" },
  "project.emptyDesc": { th: "เริ่มต้นสร้างโครงการเพื่อวางแผนและควบคุมการเบิกจ่ายงบประมาณ", en: "Create a project to start tracking your budget and strategic goals." },

  // RBAC & Module keys (Required for i18n test suite)
  "roles.module.project": { th: "บริหารโครงการและงบประมาณ", en: "Projects & Budget" },
  "perm.project:read": { th: "ดูรายการโครงการและงบประมาณ", en: "View projects and budget" },
  "perm.project:create": { th: "เสนอโครงการใหม่", en: "Create new projects" },
  "perm.project:manage": { th: "บันทึกค่าใช้จ่ายและอัปเดตผลตัวชี้วัดโครงการ", en: "Manage project expenses and KPIs" },
  "perm.project:plan": { th: "ตรวจสอบแผนยุทธศาสตร์และปรับงบประมาณโครงการ", en: "Review strategic alignment and budget" },
  "perm.project:executive": { th: "ดูสรุปภาพรวมงบประมาณระดับผู้บริหาร", en: "Executive budget overview" },
};
