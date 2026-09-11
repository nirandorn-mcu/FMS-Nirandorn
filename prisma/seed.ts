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

  console.log(`[seed] เสร็จ — login: admin@app.local / ${DEV_PASSWORD}`);
}

main().finally(() => prisma.$disconnect());

