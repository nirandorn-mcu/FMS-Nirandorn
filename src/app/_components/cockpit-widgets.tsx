import Link from "next/link";
import {
  GraduationCap,
  CreditCard,
  PieChart,
  ArrowRight,
  Activity,
  TrendingUp,
  FolderKanban,
  BadgeCheck,
} from "lucide-react";

export function CockpitWidgets() {
  return (
    <div id="cockpit" className="mt-8 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
      {/* Card 1: Student Petitions Cockpit */}
      <div className="p-5 rounded-3xl bg-card/85 dark:bg-card/65 border border-blue-500/25 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center gap-1">
              <Activity className="h-3 w-3 animate-pulse" /> Live Status
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-muted-foreground">MODULE 06</div>
          <h3 className="font-bold text-sm text-foreground mt-0.5">ระบบคำร้องนิสิตออนไลน์</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            ยื่นคำร้องเพิ่ม/ถอน ลาพัก และผ่อนผัน พร้อมขั้นตอนตรวจรับรอง 3 ขั้น
          </p>

          {/* Mini Workflow Status Preview */}
          <div className="mt-4 p-3 rounded-2xl bg-muted/50 border border-border/50 space-y-2 text-[11px]">
            <div className="flex items-center justify-between text-foreground font-semibold">
              <span className="flex items-center gap-1.5">
                <BadgeCheck className="h-3.5 w-3.5 text-blue-500" /> คำร้องล่าสุด
              </span>
              <span className="text-blue-500 font-mono text-[10px]">#REQ-2569-001</span>
            </div>
            <div className="w-full bg-border/60 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-2/3 rounded-full" />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>อาจารย์ที่ปรึกษา</span>
              <span className="text-blue-500 font-semibold">เจ้าหน้าที่กำลังตรวจ</span>
              <span>คณบดีอนุมัติ</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
          <Link href="/petitions" className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1">
            ยื่นคำร้องทันที
            <ArrowRight className="h-3 w-3" />
          </Link>
          <span className="text-[10px] text-muted-foreground">ไม่ต้องล็อกอิน</span>
        </div>
      </div>

      {/* Card 2: Advance Payment & Budget Cockpit */}
      <div className="p-5 rounded-3xl bg-card/85 dark:bg-card/65 border border-amber-500/25 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500">
              <CreditCard className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Real-time Finance
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-muted-foreground">MODULE 07</div>
          <h3 className="font-bold text-sm text-foreground mt-0.5">ระบบเงินยืมทดลองจ่าย & เคลียร์เงิน</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            ยื่นขอยืมเงินโครงการ เคลียร์ใบเสร็จ และส่งหลักฐานปิดยอด
          </p>

          {/* Mini Budget Stat Preview */}
          <div className="mt-4 p-3 rounded-2xl bg-muted/50 border border-border/50 space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">วงเงินยืมจัดสรร</span>
              <span className="font-bold font-mono text-foreground">฿500,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">ยอดเคลียร์ใบเสร็จ</span>
              <span className="font-bold font-mono text-emerald-500">฿380,000 (76%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">คงเหลือปิดยอด</span>
              <span className="font-bold font-mono text-amber-500">฿120,000</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
          <Link href="/advance-payment" className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1">
            จัดการเงินยืม
            <ArrowRight className="h-3 w-3" />
          </Link>
          <span className="text-[10px] text-muted-foreground">Staff & Finance</span>
        </div>
      </div>

      {/* Card 3: Project & Budget Cockpit */}
      <div className="p-5 rounded-3xl bg-card/85 dark:bg-card/65 border border-emerald-500/25 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <PieChart className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <FolderKanban className="h-3 w-3" /> KPI & Analytics
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-muted-foreground">MODULE 08</div>
          <h3 className="font-bold text-sm text-foreground mt-0.5">ระบบโครงการและงบประมาณ</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            บริหารจัดการแผนงาน จัดสรรงบประมาณแผ่นดิน/รายได้ และติดตาม KPI
          </p>

          {/* Mini KPI Preview */}
          <div className="mt-4 p-3 rounded-2xl bg-muted/50 border border-border/50 space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between font-semibold text-foreground">
              <span>ตัวชี้วัดความสำเร็จ (KPI)</span>
              <span className="text-emerald-500 font-mono text-[10px]">On Track</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>ความก้าวหน้าโครงการ</span>
              <span className="font-bold font-mono text-foreground">88.5%</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>แหล่งงบประมาณ</span>
              <span className="text-foreground">งบประมาณแผ่นดิน</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
          <Link href="/projects" className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1">
            ติดตามโครงการ
            <ArrowRight className="h-3 w-3" />
          </Link>
          <span className="text-[10px] text-muted-foreground">Project Lead</span>
        </div>
      </div>
    </div>
  );
}
