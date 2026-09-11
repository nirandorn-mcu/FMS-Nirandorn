"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  Terminal,
  ExternalLink,
  CheckCircle2,
  Clock,
  Shield,
  CreditCard,
  PieChart,
  ArrowRight,
  Key,
  Check,
  Layers,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function OnboardingGuide() {
  const [activeTab, setActiveTab] = useState<"student" | "staff" | "dev">("student");
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  return (
    <section id="guide" className="py-16 px-4 max-w-6xl mx-auto w-full scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3 border border-primary/20">
          <Terminal className="h-3.5 w-3.5" />
          ONBOARDING & QUICKSTART GUIDE
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          แนะนำการใช้งานในโปรเจกต์นี้
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2">
          เลือกบทบาทของคุณเพื่อดูแนวทางการใช้งานระบบ ขั้นตอนการดำเนินงาน และฟังก์ชันที่เกี่ยวข้อง
        </p>
      </div>

      {/* Role Tabs */}
      <div className="flex justify-center mb-8">
        <div className="p-1.5 rounded-full bg-muted/80 border border-border/60 flex gap-1 shadow-inner">
          <button
            onClick={() => setActiveTab("student")}
            className={`px-4 sm:px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "student"
                ? "bg-card text-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap className="h-4 w-4 text-blue-500" />
            1. นิสิต & บุคคลภายนอก
          </button>
          <button
            onClick={() => setActiveTab("staff")}
            className={`px-4 sm:px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "staff"
                ? "bg-card text-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4 text-amber-500" />
            2. อาจารย์ & บุคลากร
          </button>
          <button
            onClick={() => setActiveTab("dev")}
            className={`px-4 sm:px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "dev"
                ? "bg-card text-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Terminal className="h-4 w-4 text-emerald-500" />
            3. นักพัฒนา & ผู้ดูแลระบบ
          </button>
        </div>
      </div>

      {/* Tab Content Display */}
      <div className="rounded-3xl border border-border/80 bg-card/80 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
        {/* Tab 1: Student Guide */}
        {activeTab === "student" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-500" />
                  คู่มือสำหรับนิสิต (Student Guide & Online Petitions)
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  บริการคำร้องทางวิชาการแบบไร้กระดาษ ลดระยะเวลาการเดินเอกสาร และติดตามสถานะแบบโปร่งใส
                </p>
              </div>
              <Link href="/petitions">
                <Button size="sm" className="rounded-full text-xs font-bold gap-1.5 shadow-md shadow-primary/20">
                  ไปยังหน้าระบบคำร้อง
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-muted/40 border border-border/50 flex flex-col justify-between">
                <div>
                  <div className="h-8 w-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 font-extrabold text-xs flex items-center justify-center mb-3">
                    01
                  </div>
                  <h4 className="font-bold text-sm text-foreground">กรอกข้อมูลและแนบหลักฐาน</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    เลือกประเภทคำร้อง (ลงทะเบียนล่าช้า, ขอพักการเรียน, ผ่อนผันค่าเทอม ฯลฯ) กรอกรหัสนิสิตและแนบไฟล์หลักฐาน
                  </p>
                </div>
                <div className="mt-4 text-[11px] text-blue-500 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> ไม่ต้องล็อกอิน
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-muted/40 border border-border/50 flex flex-col justify-between">
                <div>
                  <div className="h-8 w-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-extrabold text-xs flex items-center justify-center mb-3">
                    02
                  </div>
                  <h4 className="font-bold text-sm text-foreground">การพิจารณา 3 ระดับ</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    คำร้องจะถูกส่งต่ออัตโนมัติ: อาจารย์ที่ปรึกษาเห็นชอบ -&gt; เจ้าหน้าที่ตรวจสอบเอกสาร -&gt; คณบดีลงนามอนุมัติ
                  </p>
                </div>
                <div className="mt-4 text-[11px] text-amber-500 font-medium flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> ทราบผลใน 1-3 วันทำการ
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-muted/40 border border-border/50 flex flex-col justify-between">
                <div>
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center justify-center mb-3">
                    03
                  </div>
                  <h4 className="font-bold text-sm text-foreground">ติดตามสถานะ & ประวัติ</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    ตรวจสอบสถานะและดูเหตุผลการพิจารณาย้อนหลังได้ตลอดเวลาผ่านรหัสคำร้อง พร้อมระบบ Audit Trail บันทึกทุกขั้นตอน
                  </p>
                </div>
                <div className="mt-4 text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" /> ปลอดภัย & โปร่งใส
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Staff Guide */}
        {activeTab === "staff" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-amber-500" />
                  คู่มือสำหรับคณาจารย์และเจ้าหน้าที่ (Staff Operations)
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  การบริหารจัดการเงินยืมทดลองจ่าย แผนงานโครงการ และการติดตามงบประมาณประจำปี
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/advance-payment">
                  <Button variant="outline" size="sm" className="rounded-full text-xs font-bold gap-1">
                    <CreditCard className="h-3.5 w-3.5 text-amber-500" />
                    ระบบเงินยืม
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button size="sm" className="rounded-full text-xs font-bold gap-1">
                    <PieChart className="h-3.5 w-3.5 text-emerald-500" />
                    ระบบงบประมาณ
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/25 flex flex-col">
                <div className="flex items-center gap-2 mb-2 font-bold text-sm text-foreground">
                  <CreditCard className="h-4 w-4 text-amber-500" />
                  วงจรเงินยืมทดลองจ่าย (Advance & Clearing)
                </div>
                <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>ยื่นขอยืมเงิน:</strong> ระบุโครงการ วัตถุประสงค์ และแจกแจงรายการค่าใช้จ่าย</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>อนุมัติ & โอนเงิน:</strong> หัวหน้าโครงการ/ฝ่ายการเงินตรวจสอบและบันทึกการโอนเงิน</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>เคลียร์ใบเสร็จ & คืนเงิน:</strong> แนบใบเสร็จตามจริง คำนวณยอดเงินคืน/เบิกเพิ่ม และปิดยอดบัญชี</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/25 flex flex-col">
                <div className="flex items-center gap-2 mb-2 font-bold text-sm text-foreground">
                  <PieChart className="h-4 w-4 text-emerald-500" />
                  การบริหารโครงการและงบประมาณ (Project & Budget)
                </div>
                <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>ตั้งโครงการ & แหล่งงบประมาณ:</strong> งบประมาณแผ่นดิน, งบรายได้, หรือทุนวิจัยภายนอก</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>กำหนดตัวชี้วัด KPI:</strong> ระบุค่าเป้าหมาย (Target) และรายงานผลจริง (Actual)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>บันทึกค่าใช้จ่าย:</strong> ติดตามยอดเบิกจ่ายสะสม และงบประมาณคงเหลือแบบเรียลไทม์</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Developer Guide */}
        {activeTab === "dev" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-emerald-500" />
                  คู่มือนักพัฒนา & สถาปัตยกรรม (Developer & Architect Quickstart)
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  ข้อมูลบัญชีทดสอบเริ่มต้น กฎความปลอดภัย และคำสั่งทดสอบระบบ
                </p>
              </div>
              <Link href="/login">
                <Button size="sm" className="rounded-full text-xs font-bold gap-1.5">
                  เข้าสู่ระบบด้วยบัญชี Admin
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {/* Seed Credentials Box */}
            <div className="p-4 rounded-2xl bg-muted/60 border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/15 text-primary">
                  <Key className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">บัญชีผู้ดูแลระบบเริ่มต้น (Seed Admin Account)</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">
                    Email: <span className="text-foreground font-bold">admin@app.local</span> · Password: <span className="text-foreground font-bold">Passw0rd!vibe</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard("admin@app.local / Passw0rd!vibe", "admin")}
                className="px-3.5 py-1.5 rounded-lg border border-border/80 bg-card hover:bg-muted text-[11px] font-bold text-foreground transition-all flex items-center gap-1.5"
              >
                {copiedAccount === "admin" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Terminal className="h-3.5 w-3.5" />}
                {copiedAccount === "admin" ? "คัดลอกแล้ว" : "คัดลอกข้อมูลเข้าสู่ระบบ"}
              </button>
            </div>

            {/* Architecture & Quality Gates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-2">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-primary" />
                  กฎความปลอดภัย & สถาปัตยกรรม (Strict Boundary)
                </div>
                <ul className="text-muted-foreground space-y-1.5 leading-relaxed">
                  <li>• โค้ดแต่ละฟีเจอร์แยกอิสระใน <code className="text-foreground font-mono font-semibold">src/features/&lt;name&gt;/</code></li>
                  <li>• <strong>ห้าม</strong> Import จากโฟลเดอร์ <code className="text-destructive font-mono font-semibold">_internal/</code> ข้ามฟีเจอร์</li>
                  <li>• ทุกธุรกรรมสำคัญบันทึก <code className="text-foreground font-mono">writeAudit</code> และผูก <code className="text-foreground font-mono">tenant_id</code></li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-2">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-cyan-500" />
                  คำสั่งตรวจสอบคุณภาพระบบ (Quality Gates)
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="p-1.5 rounded bg-background/80 border border-border/40 text-foreground">
                    npm run type-check <span className="text-muted-foreground"># Type Safety</span>
                  </div>
                  <div className="p-1.5 rounded bg-background/80 border border-border/40 text-foreground">
                    npm run test <span className="text-muted-foreground"># 148+ Unit Tests</span>
                  </div>
                  <div className="p-1.5 rounded bg-background/80 border border-border/40 text-foreground">
                    npm run deps:check <span className="text-muted-foreground"># Dependency Cruiser</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
