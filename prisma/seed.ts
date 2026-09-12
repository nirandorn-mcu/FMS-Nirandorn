import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { seedCore, seedUser } from "./lib/seed-core";
import { requireDatabaseUrl } from "./lib/require-database-url";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: requireDatabaseUrl() }) });

/** รหัสผ่านทุกบัญชีตัวอย่าง */
export const DEV_PASSWORD = "Passw0rd!vibe";

async function main() {
  if (process.env.NODE_ENV === "production" && process.env.SEED_ALLOW_PROD !== "1") {
    console.error("[seed] ปฏิเสธ: NODE_ENV=production — ใช้ npm run db:bootstrap แทน");
    process.exit(1);
  }
  const core = await seedCore(prisma, { tenantCode: "DEMO", nameTh: "องค์กรตัวอย่าง", nameEn: "Sample Organization" });
  const hash = await bcrypt.hash(DEV_PASSWORD, 12);
  const users = [
    { email: "admin@app.local", name: "ผู้ดูแลสูงสุด", roles: ["SUPER_ADMIN"] },
    { email: "staff@app.local", name: "เจ้าหน้าที่", roles: ["STAFF"] },
    { email: "viewer@app.local", name: "ผู้ดู", roles: ["VIEWER"] },
    { email: "lockme@app.local", name: "บัญชีทดสอบล็อก", roles: ["VIEWER"] },
    { email: "forced@app.local", name: "บัญชีบังคับเปลี่ยนรหัส", roles: ["VIEWER"], mustChangePassword: true },
  ];
  const createdUsers: Record<string, string> = {};
  for (const u of users) {
    const userId = await seedUser(prisma, core.tenantId, { ...u, passwordHash: hash, roleIds: u.roles.map((c) => core.roleIds[c]) });
    createdUsers[u.email] = userId;
  }

  // Seed sample documents for Document Flow feature
  const adminId = createdUsers["admin@app.local"];
  const staffId = createdUsers["staff@app.local"];

  const existingDoc = await prisma.document.findFirst({ where: { tenantId: core.tenantId } });
  if (!existingDoc && adminId && staffId) {
    // Doc 1: PENDING_APPROVAL with 3 steps (step 1 approved, step 2 active)
    await prisma.document.create({
      data: {
        tenantId: core.tenantId,
        docNo: "ศธ 0514.1/102",
        title: "ขออนุมัติจัดโครงการอบรมเชิงปฏิบัติการ AI สำหรับการวิจัยและการเรียนการสอน",
        docType: "MEMO",
        urgency: "URGENT",
        confidentiality: "NORMAL",
        creatorId: staffId,
        currentStep: 2,
        totalSteps: 3,
        status: "PENDING_APPROVAL",
        content: "ด้วยคณะวิทยาการจัดการ มีความประสงค์จะจัดโครงการอบรมเชิงปฏิบัติการด้าน AI จึงใคร่ขออนุมัติหลักการจัดโครงการและงบประมาณดำเนินงาน",
        attachmentUrl: "https://drive.google.com/drive/folders/demo-fms-ai-workshop",
        tags: ["วิชาการ", "AI", "อบรม"],
        workflowSteps: {
          create: [
            {
              stepNumber: 1,
              approverRole: "หัวหน้าภาควิชาคอมพิวเตอร์และเทคโนโลยีสารสนเทศ",
              approverId: adminId,
              status: "APPROVED",
              comment: "เห็นควรอนุมัติเพื่อพัฒนาศักยภาพคณาจารย์และบุคลากร",
              signatureUrl: "DIGITAL_SIGNATURE_OK",
              actionAt: new Date(Date.now() - 86400000),
            },
            {
              stepNumber: 2,
              approverRole: "รองคณบดีฝ่ายบริหารและยุทธศาสตร์",
              status: "PENDING",
            },
            {
              stepNumber: 3,
              approverRole: "คณบดีคณะวิทยาการจัดการ",
              status: "PENDING",
            },
          ],
        },
        comments: {
          create: [
            {
              userId: staffId,
              comment: "ได้แนบรายละเอียดโครงการและตารางวิทยากรเรียบร้อยแล้วครับ",
            },
          ],
        },
      },
    });

    // Doc 2: APPROVED memo
    await prisma.document.create({
      data: {
        tenantId: core.tenantId,
        docNo: "ศธ 0514.1/089",
        title: "ประกาศแนวปฏิบัติการเบิกจ่ายงบประมาณวิจัย ประจำปีงบประมาณ 2569",
        docType: "ANNOUNCEMENT",
        urgency: "NORMAL",
        confidentiality: "NORMAL",
        creatorId: adminId,
        currentStep: 2,
        totalSteps: 2,
        status: "APPROVED",
        content: "ประกาศแนวปฏิบัติเพื่อให้การเบิกจ่ายงบประมาณเงินรายได้และงบประมาณแผ่นดินเป็นไปด้วยความถูกต้องและโปร่งใส",
        attachmentUrl: "https://drive.google.com/file/d/fms-research-guideline-2569",
        tags: ["วิจัย", "ประกาศคณะ", "การเงิน"],
        workflowSteps: {
          create: [
            {
              stepNumber: 1,
              approverRole: "หัวหน้าฝ่ายงานคลังและพัสดุ",
              approverId: adminId,
              status: "APPROVED",
              comment: "ตรวจสอบข้อบังคับและระเบียบถูกต้อง",
              signatureUrl: "DIGITAL_SIGNATURE_OK",
              actionAt: new Date(Date.now() - 172800000),
            },
            {
              stepNumber: 2,
              approverRole: "คณบดีคณะวิทยาการจัดการ",
              approverId: adminId,
              status: "APPROVED",
              comment: "อนุมัติและลงนามประกาศ",
              signatureUrl: "DIGITAL_SIGNATURE_OK",
              actionAt: new Date(Date.now() - 86400000),
            },
          ],
        },
      },
    });
  }

  // Seed Departments
  const deptData = [
    { code: "D-LOG", nameTh: "ภาควิชาการจัดการโลจิสติกส์และโซ่อุปทาน", nameEn: "Department of Logistics and Supply Chain Management", description: "จัดการเรียนการสอนและพัฒนางานวิจัยด้านโลจิสติกส์ โซ่อุปทาน การจัดซื้อ และการขนส่ง" },
    { code: "D-BIS", nameTh: "ภาควิชาระบบสารสนเทศและธุรกิจดิจิทัล", nameEn: "Department of Business Information Systems", description: "พัฒนาบัณฑิตด้านเทคโนโลยีสารสนเทศธุรกิจ นวัตกรรมดิจิทัล และการวิเคราะห์ข้อมูล" },
    { code: "D-MGT", nameTh: "ภาควิชาการจัดการ", nameEn: "Department of Management", description: "สร้างผู้นำและนักบริหารองค์กรยุคใหม่ มีความเชี่ยวชาญการจัดการเชิงกลยุทธ์และการเป็นผู้ประกอบการ" },
    { code: "D-ACC", nameTh: "ภาควิชาการบัญชี", nameEn: "Department of Accountancy", description: "มุ่งเน้นการผลิตนักบัญชีมืออาชีพที่มีจรรยาบรรณ และความเชี่ยวชาญเทคโนโลยีทางการบัญชี" },
    { code: "D-MKT", nameTh: "ภาควิชาการตลาด", nameEn: "Department of Marketing", description: "ผลิตนักการตลาดดิจิทัล การสร้างตราสินค้า และการสื่อสารการตลาดแบบบูรณาการ" },
  ];

  const deptMap: Record<string, string> = {};
  for (const d of deptData) {
    const row = await prisma.department.upsert({
      where: { tenantId_code: { tenantId: core.tenantId, code: d.code } },
      update: { nameTh: d.nameTh, nameEn: d.nameEn, description: d.description },
      create: { tenantId: core.tenantId, code: d.code, nameTh: d.nameTh, nameEn: d.nameEn, description: d.description, status: "ACTIVE" },
    });
    deptMap[d.code] = row.id;
  }

  // Seed sample Curriculums and Subjects
  const existingCurriculum = await prisma.curriculum.findFirst({ where: { tenantId: core.tenantId } });
  if (!existingCurriculum) {
    // 1. Create Subjects
    const subData = [
      { code: "MGT1001", nameTh: "หลักการจัดการ", nameEn: "Principles of Management", credits: 3, creditInfo: "3(3-0-6)", description: "แนวคิด ทฤษฎี และกระบวนการจัดการ การวางแผน การจัดองค์การ การชักนำ และการควบคุมองค์การในยุคดิจิทัล" },
      { code: "ACC1001", nameTh: "การบัญชีการเงินเบื้องต้น", nameEn: "Introduction to Financial Accounting", credits: 3, creditInfo: "3(3-0-6)", description: "หลักการและวิธีการบันทึกบัญชี วงจรบัญชี การจัดทำงบการเงินสำหรับกิจการให้บริการและพาณิชยกรรม" },
      { code: "LOG2001", nameTh: "การจัดการโลจิสติกส์และโซ่อุปทาน", nameEn: "Logistics and Supply Chain Management", credits: 3, creditInfo: "3(3-0-6)", description: "กิจกรรมโลจิสติกส์ การจัดซื้อ การจัดการสินค้าคงคลัง การขนส่ง และการบูรณาการโซ่อุปทานระดับสากล" },
      { code: "LOG3002", nameTh: "การจัดการคลังสินค้าและการกระจายสินค้า", nameEn: "Warehouse and Distribution Management", credits: 3, creditInfo: "3(2-2-5)", description: "การออกแบบคลังสินค้า ระบบจัดเก็บและเบิกจ่าย เทคโนโลยีบาร์โค้ดและ RFID การบริหารยานพาหนะขนส่ง" },
      { code: "BIS2001", nameTh: "ระบบสารสนเทศเพื่อการจัดการ", nameEn: "Management Information Systems", credits: 3, creditInfo: "3(3-0-6)", description: "บทบาทของสารสนเทศในองค์กร ระบบ ERP การพาณิชย์อิเล็กทรอนิกส์ ความมั่นคงปลอดภัยสารสนเทศ" },
      { code: "BIS3003", nameTh: "การวิเคราะห์และออกแบบระบบเชิงธุรกิจ", nameEn: "Business Systems Analysis and Design", credits: 3, creditInfo: "3(2-2-5)", description: "วงจรการพัฒนาระบบ การวิเคราะห์ความต้องการเชิงธุรกิจ แผนภาพ UML การออกแบบฐานข้อมูลและส่วนติดต่อผู้ใช้" },
      { code: "GEN1001", nameTh: "ภาษาอังกฤษเพื่อการสื่อสารในการทำงาน", nameEn: "English for Workplace Communication", credits: 3, creditInfo: "3(3-0-6)", description: "การพัฒนาทักษะการฟัง พูด อ่าน และเขียนภาษาอังกฤษที่ใช้ในการติดต่อธุรกิจและการนำเสนองาน" },
      { code: "GEN1002", nameTh: "ทักษะดิจิทัลและความฉลาดรู้สารสนเทศ", nameEn: "Digital Skills and Information Literacy", credits: 3, creditInfo: "3(2-2-5)", description: "การประยุกต์ใช้ซอฟต์แวร์สำนักงาน การใช้ระบบคลาวด์ การรู้เท่าทันสื่อดิจิทัลและความปลอดภัยทางไซเบอร์" },
    ];

    const subjectMap: Record<string, string> = {};
    for (const s of subData) {
      const created = await prisma.subject.create({
        data: {
          tenantId: core.tenantId,
          code: s.code,
          nameTh: s.nameTh,
          nameEn: s.nameEn,
          credits: s.credits,
          creditInfo: s.creditInfo,
          description: s.description,
          status: "ACTIVE",
        },
      });
      subjectMap[s.code] = created.id;
    }

    // 2. Create Curriculum 1: Logistics
    await prisma.curriculum.create({
      data: {
        tenantId: core.tenantId,
        departmentId: deptMap["D-LOG"],
        code: "BBA-LOG-2565",
        nameTh: "หลักสูตรบริหารธุรกิจบัณฑิต สาขาวิชาการจัดการโลจิสติกส์และโซ่อุปทาน",
        nameEn: "Bachelor of Business Administration Program in Logistics and Supply Chain Management",
        degreeTh: "บริหารธุรกิจบัณฑิต (การจัดการโลจิสติกส์และโซ่อุปทาน)",
        degreeEn: "Bachelor of Business Administration (Logistics and Supply Chain Management)",
        faculty: "คณะวิทยาการจัดการ",
        totalCredits: 126,
        revisionYear: 2565,
        status: "ACTIVE",
        subjects: {
          create: [
            { subjectId: subjectMap["GEN1001"], category: "หมวดวิชาศึกษาทั่วไป", isCompulsory: true },
            { subjectId: subjectMap["GEN1002"], category: "หมวดวิชาศึกษาทั่วไป", isCompulsory: true },
            { subjectId: subjectMap["MGT1001"], category: "หมวดวิชาเฉพาะ / พื้นฐานวิชาชีพ", isCompulsory: true },
            { subjectId: subjectMap["ACC1001"], category: "หมวดวิชาเฉพาะ / พื้นฐานวิชาชีพ", isCompulsory: true },
            { subjectId: subjectMap["BIS2001"], category: "หมวดวิชาเฉพาะ / พื้นฐานวิชาชีพ", isCompulsory: true },
            { subjectId: subjectMap["LOG2001"], category: "หมวดวิชาเอก / บังคับ", isCompulsory: true },
            { subjectId: subjectMap["LOG3002"], category: "หมวดวิชาเอกเลือก", isCompulsory: false },
          ],
        },
      },
    });

    // 3. Create Curriculum 2: Digital Business
    await prisma.curriculum.create({
      data: {
        tenantId: core.tenantId,
        departmentId: deptMap["D-BIS"],
        code: "BBA-BIS-2566",
        nameTh: "หลักสูตรบริหารธุรกิจบัณฑิต สาขาวิชาระบบสารสนเทศเพื่อการจัดการและธุรกิจดิจิทัล",
        nameEn: "Bachelor of Business Administration Program in Digital Business and Information Systems",
        degreeTh: "บริหารธุรกิจบัณฑิต (ระบบสารสนเทศเพื่อการจัดการและธุรกิจดิจิทัล)",
        degreeEn: "Bachelor of Business Administration (Digital Business and Information Systems)",
        faculty: "คณะวิทยาการจัดการ",
        totalCredits: 124,
        revisionYear: 2566,
        status: "ACTIVE",
        subjects: {
          create: [
            { subjectId: subjectMap["GEN1001"], category: "หมวดวิชาศึกษาทั่วไป", isCompulsory: true },
            { subjectId: subjectMap["GEN1002"], category: "หมวดวิชาศึกษาทั่วไป", isCompulsory: true },
            { subjectId: subjectMap["MGT1001"], category: "หมวดวิชาเฉพาะ / พื้นฐานวิชาชีพ", isCompulsory: true },
            { subjectId: subjectMap["BIS2001"], category: "หมวดวิชาเฉพาะ / พื้นฐานวิชาชีพ", isCompulsory: true },
            { subjectId: subjectMap["BIS3003"], category: "หมวดวิชาเอก / บังคับ", isCompulsory: true },
          ],
        },
      },
    });
  } else {
    // If curriculums were already seeded, associate them with departments
    await prisma.curriculum.updateMany({
      where: { tenantId: core.tenantId, code: "BBA-LOG-2565", departmentId: null },
      data: { departmentId: deptMap["D-LOG"] },
    });
    await prisma.curriculum.updateMany({
      where: { tenantId: core.tenantId, code: "BBA-BIS-2566", departmentId: null },
      data: { departmentId: deptMap["D-BIS"] },
    });
  }

  console.log(`[seed] เสร็จ — login: admin@app.local / ${DEV_PASSWORD}`);
}

main().finally(() => prisma.$disconnect());

