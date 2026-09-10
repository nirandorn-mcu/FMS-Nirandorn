"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  CreditCard,
  PieChart,
  FileCheck,
  Users,
  Newspaper,
  BookOpen,
  CalendarCheck2,
  Layers,
  Terminal,
  Key,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
  Compass,
  Clock,
  MapPin,
  Phone,
  Mail,
  Search,
  Zap,
  Shield,
  Check,
  TrendingUp,
  Cpu,
  Activity,
  FolderKanban,
  BadgeCheck,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Button } from "@/components/ui/button";

export function HomePageClient() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"student" | "staff" | "dev">("student");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  // 8 Modules Data
  const facultyModules = [
    {
      id: "petition",
      num: "06",
      title: "ระบบนิสิตยื่นคำร้องออนไลน์",
      titleEn: "Student Online Petitions",
      desc: "ยื่นคำร้องทางวิชาการ (เพิ่ม/ถอน/ลาพัก) ติดตามสถานะแบบ Real-time พร้อมกระบวนการตรวจรับรอง 3 ระดับ (ที่ปรึกษา -> เจ้าหน้าที่ -> คณบดี)",
      icon: GraduationCap,
      badge: "พร้อมใช้งาน",
      status: "ready",
      href: "/petitions",
      glowColor: "from-blue-500/20 via-cyan-500/10 to-transparent",
      accent: "text-blue-500",
      borderGlow: "hover:border-blue-500/50 hover:shadow-blue-500/10",
    },
    {
      id: "advance",
      num: "07",
      title: "ระบบเงินยืมทดลองจ่าย & เคลียร์เงิน",
      titleEn: "Advance Payment & Clearing",
      desc: "ยื่นคำขอยืมเงินโครงการ บันทึกการอนุมัติ โอนจ่าย และส่งหลักฐานใบเสร็จเคลียร์เงินคงเหลือ พร้อม Audit Trail ครบวงจร",
      icon: CreditCard,
      badge: "พร้อมใช้งาน",
      status: "ready",
      href: "/advance-payment",
      glowColor: "from-amber-500/20 via-orange-500/10 to-transparent",
      accent: "text-amber-500",
      borderGlow: "hover:border-amber-500/50 hover:shadow-amber-500/10",
    },
    {
      id: "project",
      num: "08",
      title: "ระบบโครงการและงบประมาณ",
      titleEn: "Project & Budget Management",
      desc: "บริหารจัดการแผนงานโครงการ จัดสรรงบประมาณแผ่นดิน/รายได้ ติดตามตัวชี้วัดความสำเร็จ (KPI) และยอดเบิกจ่ายแบบเรียลไทม์",
      icon: PieChart,
      badge: "พร้อมใช้งาน",
      status: "ready",
      href: "/projects",
      glowColor: "from-emerald-500/20 via-teal-500/10 to-transparent",
      accent: "text-emerald-500",
      borderGlow: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
    },
    {
      id: "news",
      num: "01",
      title: "ระบบข่าวสารและประชาสัมพันธ์",
      titleEn: "News & Public Relations",
      desc: "เผยแพร่ข่าวประกาศกิจกรรม จัดการหมวดหมู่ข่าว แกลเลอรี่ภาพ และป้ายประชาสัมพันธ์หน้าเว็บคณะ",
      icon: Newspaper,
      badge: "ระยะถัดไป",
      status: "upcoming",
      href: "#news",
      glowColor: "from-violet-500/20 via-purple-500/10 to-transparent",
      accent: "text-violet-500",
      borderGlow: "hover:border-violet-500/50 hover:shadow-violet-500/10",
    },
    {
      id: "directory",
      num: "02",
      title: "ทำเนียบคณาจารย์และบุคลากร",
      titleEn: "Staff & Faculty Directory",
      desc: "ค้นหาข้อมูลอาจารย์ สาขาวิชา ผลงานวิชาการ ตำแหน่งบริหาร และช่องทางการติดต่ออย่างเป็นทางการ",
      icon: Users,
      badge: "ระยะถัดไป",
      status: "upcoming",
      href: "#",
      glowColor: "from-sky-500/20 via-blue-500/10 to-transparent",
      accent: "text-sky-500",
      borderGlow: "hover:border-sky-500/50 hover:shadow-sky-500/10",
    },
    {
      id: "curriculum",
      num: "03",
      title: "ข้อมูลหลักสูตรการศึกษา",
      titleEn: "Curriculum Management",
      desc: "โครงสร้างหลักสูตร ป.ตรี/โท/เอก แผนการศึกษา คำอธิบายรายวิชา และผลลัพธ์การเรียนรู้ (PLO/CLO)",
      icon: BookOpen,
      badge: "ระยะถัดไป",
      status: "upcoming",
      href: "#curriculums",
      glowColor: "from-indigo-500/20 via-blue-500/10 to-transparent",
      accent: "text-indigo-500",
      borderGlow: "hover:border-indigo-500/50 hover:shadow-indigo-500/10",
    },
    {
      id: "document",
      num: "04",
      title: "ระบบขออนุมัติ & เอกสารอิเล็กทรอนิกส์",
      titleEn: "Document Approval Flow",
      desc: "การไหลเวียนเอกสารราชการ การลงนามดิจิทัล ติดตามสถานะหนังสือเวียน และจัดเก็บประวัติเอกสาร",
      icon: FileCheck,
      badge: "ระยะถัดไป",
      status: "upcoming",
      href: "#",
      glowColor: "from-rose-500/20 via-pink-500/10 to-transparent",
      accent: "text-rose-500",
      borderGlow: "hover:border-rose-500/50 hover:shadow-rose-500/10",
    },
    {
      id: "booking",
      num: "05",
      title: "ระบบจองห้องประชุมและยานพาหนะ",
      titleEn: "Facility & Vehicle Booking",
      desc: "ปฏิทินจองห้องสัมมนา ห้องเรียนพิเศษ ยานพาหนะส่วนกลาง พร้อมระบบตรวจสอบการทับซ้อนและอนุมัติ",
      icon: CalendarCheck2,
      badge: "ระยะถัดไป",
      status: "upcoming",
      href: "#",
      glowColor: "from-amber-500/20 via-yellow-500/10 to-transparent",
      accent: "text-amber-500",
      borderGlow: "hover:border-amber-500/50 hover:shadow-amber-500/10",
    },
  ];

  const quickPrompts = [
    { label: "ยื่นคำร้องนิสิต", href: "/petitions", icon: GraduationCap },
    { label: "เงินยืมทดลองจ่าย", href: "/advance-payment", icon: CreditCard },
    { label: "งบประมาณโครงการ", href: "/projects", icon: PieChart },
    { label: "คู่มือการใช้งาน", href: "#guide", icon: Compass },
    { label: "เข้าสู่ระบบ Admin", href: "/login", icon: Key },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/25 selection:text-primary relative overflow-x-hidden">
      {/* ─── Nexa-Style Ambient Mesh Background & Grid Lines ─── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Fine Matrix Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] bg-[size:36px_36px] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]" />

        {/* Ambient Radial Spotlights */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[550px] bg-gradient-to-tr from-primary/25 via-cyan-500/20 to-purple-600/15 blur-[150px] rounded-full opacity-80" />
        <div className="absolute top-[35%] -left-32 w-[500px] h-[500px] bg-amber-500/15 blur-[140px] rounded-full opacity-60" />
        <div className="absolute top-[60%] -right-32 w-[600px] h-[600px] bg-emerald-500/15 blur-[160px] rounded-full opacity-60" />
      </div>

      {/* ─── Floating Top Navbar ─── */}
      <header className="sticky top-4 z-50 max-w-6xl mx-auto w-[94%] px-4 py-2 rounded-full backdrop-blur-2xl bg-card/80 dark:bg-card/70 border border-border/70 shadow-xl shadow-black/5 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary via-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-foreground">FMS NEXA</span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                  Modular Vibe
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground hidden sm:block">Intelligent Faculty Operating Platform</p>
            </div>
          </Link>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
          <a href="#hero" className="hover:text-foreground transition-colors">หน้าแรก</a>
          <a href="#cockpit" className="hover:text-foreground transition-colors">ระบบบริการ</a>
          <a href="#guide" className="hover:text-foreground transition-colors">คู่มือการใช้งาน</a>
          <a href="#modules" className="hover:text-foreground transition-colors">8 โมดูลหลัก</a>
          <a href="#architecture" className="hover:text-foreground transition-colors">สถาปัตยกรรม</a>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher className="h-8 px-2.5 rounded-full text-xs font-semibold" />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            title="สลับโหมดสว่าง/มืด"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Link href="/login">
            <Button size="sm" className="rounded-full px-4 text-xs font-semibold shadow-md shadow-primary/20 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              เข้าสู่ระบบ
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* ─── Hero Section (Inspired by motionsites.ai/?prompt=nexa-talent) ─── */}
      <section id="hero" className="relative pt-16 pb-16 md:pt-24 md:pb-24 px-4 max-w-6xl mx-auto w-full text-center flex flex-col items-center">
        {/* Floating Pulsing Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-xl text-primary text-xs font-bold tracking-wide uppercase mb-6 shadow-inner animate-in fade-in duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-80"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span>✦ Intelligent Faculty Operating Platform · Modular Monolith</span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl leading-[1.12] text-foreground">
          ยกระดับการบริหารและบริการ
          <br />
          <span className="bg-gradient-to-r from-primary via-cyan-400 to-amber-400 bg-clip-text text-transparent">
            สู่อนาคตดิจิทัลเต็มรูปแบบ
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl font-normal leading-relaxed">
          แพลตฟอร์มศูนย์กลางการบริหารงานคณะและบริการการศึกษา พัฒนาด้วยสถาปัตยกรรม <strong className="text-foreground font-semibold">Modular Monolith</strong> บน Next.js 16 เชื่อมโยงระบบคำร้องนิสิต การเงินยืมทดลองจ่าย และการบริหารโครงการ-งบประมาณ ไร้รอยต่อ ปลอดภัย และมี Audit Trail ครบวงจร
        </p>

        {/* Nexa-Style Command & Prompt Search Bar */}
        <div className="mt-8 w-full max-w-2xl relative">
          <div className="p-2 rounded-2xl sm:rounded-full bg-card/90 dark:bg-card/75 border border-border/80 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-2 px-3 w-full sm:w-auto flex-1">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาบริการ, ยื่นคำร้อง, เงินยืมทดลองจ่าย, งบประมาณ..."
                className="bg-transparent border-none outline-none text-xs sm:text-sm text-foreground placeholder:text-muted-foreground w-full"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Link href="/petitions" className="w-full sm:w-auto">
                <Button size="sm" className="rounded-full px-5 text-xs font-bold w-full sm:w-auto gap-1.5 shadow-md shadow-primary/25">
                  <Zap className="h-3.5 w-3.5" />
                  เริ่มต้นใช้งาน
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Filter Tag Chips */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] text-muted-foreground font-medium">บริการด่วน:</span>
            {quickPrompts.map((p, idx) => {
              const Icon = p.icon;
              return (
                <Link
                  key={idx}
                  href={p.href}
                  className="px-3 py-1 rounded-full text-[11px] font-semibold bg-muted/60 hover:bg-primary/10 hover:text-primary border border-border/60 transition-all flex items-center gap-1 text-muted-foreground"
                >
                  <Icon className="h-3 w-3" />
                  {p.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ─── Floating Live Widgets Cockpit (Nexa-Talent Visual Interface) ─── */}
        <div id="cockpit" className="mt-14 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
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
      </section>

      {/* ─── Guide & Usage Section (แนะนำการใช้งานในโปรเจกต์นี้) ─── */}
      <section id="guide" className="py-16 px-4 max-w-6xl mx-auto w-full scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3 border border-primary/20">
            <Compass className="h-3.5 w-3.5" />
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

      {/* ─── 8 Faculty Modules Matrix ─── */}
      <section id="modules" className="py-16 px-4 max-w-6xl mx-auto w-full scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2.5">
              <Layers className="h-3.5 w-3.5" />
              FACULTY ECOSYSTEM
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              โครงสร้าง 8 โมดูลระบบงานคณะ
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              เชื่อมต่อทุกกระบวนการทำงานของคณะไว้ในแพลตฟอร์มเดียว พร้อมความปลอดภัยและการจัดการสิทธิ์ตามบทบาท (RBAC)
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="rounded-full text-xs font-bold gap-1.5 shrink-0">
              เข้าสู่แดชบอร์ดหลังบ้าน
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {facultyModules.map((item) => {
            const Icon = item.icon;
            const isReady = item.status === "ready";
            return (
              <div
                key={item.id}
                className={`group relative p-5 rounded-3xl bg-card/75 border border-border/70 backdrop-blur-md transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 ${item.borderGlow}`}
              >
                {/* Header item */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${item.glowColor} border border-border/50`}>
                      <Icon className={`h-5 w-5 ${item.accent}`} />
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        isReady
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : "bg-muted text-muted-foreground border-border/60"
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-muted-foreground font-bold tracking-wider mb-1">
                    MODULE {item.num}
                  </div>
                  <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-[11px] text-muted-foreground/80 font-medium mb-3">
                    {item.titleEn}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                </div>

                {/* Footer Link */}
                <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold">
                  {isReady ? (
                    <Link
                      href={item.href}
                      className="text-primary font-bold flex items-center gap-1 hover:underline transition-all"
                    >
                      เปิดใช้งานระบบ
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ) : (
                    <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                      อยู่ในแผนการพัฒนา
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Enterprise Architecture & Trust Section ─── */}
      <section id="architecture" className="py-16 px-4 max-w-6xl mx-auto w-full scroll-mt-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-card/95 via-card/75 to-card/50 border border-border/80 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
              <Shield className="h-3.5 w-3.5" />
              ENTERPRISE SECURITY & SCALABILITY
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              สถาปัตยกรรม Modular Monolith
              <br />
              <span className="text-muted-foreground font-medium text-xl sm:text-2xl">
                ปลอดภัย แยกส่วนชัดเจน และพร้อมขยายผล
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-3 leading-relaxed">
              โครงสร้างระบบถูกออกแบบให้แต่ละฟีเจอร์ถูก Encapsulate สมบูรณ์แบบภายในตัว ป้องกันการพึ่งพากันอย่างไร้ระเบียบ (Zero Boundary Leaks) ควบคุมสิทธิ์ด้วย RBAC ละเอียดระดับโมดูล และบันทึก Audit Logs ทุกรายการเปลี่ยนแปลง
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login">
                <Button className="rounded-full px-6 text-xs font-bold gap-1.5 shadow-md shadow-primary/20">
                  เริ่มต้นใช้งาน Admin Console
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="rounded-full px-6 text-xs font-bold border-border/80">
                  เข้าสู่หน้า Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-3.5 absolute top-10 right-10 w-80 opacity-90">
            <div className="p-4 rounded-2xl bg-muted/60 border border-border/60 backdrop-blur-md">
              <Cpu className="h-5 w-5 text-cyan-500 mb-2" />
              <div className="text-xs font-bold text-foreground">PostgreSQL 16</div>
              <div className="text-[11px] text-muted-foreground">Prisma 6 ORM</div>
            </div>
            <div className="p-4 rounded-2xl bg-muted/60 border border-border/60 backdrop-blur-md">
              <Shield className="h-5 w-5 text-emerald-500 mb-2" />
              <div className="text-xs font-bold text-foreground">Auth.js v5</div>
              <div className="text-[11px] text-muted-foreground">RBAC & Tenant Scoping</div>
            </div>
            <div className="p-4 rounded-2xl bg-muted/60 border border-border/60 backdrop-blur-md">
              <Layers className="h-5 w-5 text-primary mb-2" />
              <div className="text-xs font-bold text-foreground">Next.js 16</div>
              <div className="text-[11px] text-muted-foreground">React 19 App Router</div>
            </div>
            <div className="p-4 rounded-2xl bg-muted/60 border border-border/60 backdrop-blur-md">
              <Sparkles className="h-5 w-5 text-amber-500 mb-2" />
              <div className="text-xs font-bold text-foreground">Liyon System</div>
              <div className="text-[11px] text-muted-foreground">Tailwind CSS 4</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Contact Information ─── */}
      <section id="contact" className="py-14 px-4 max-w-6xl mx-auto w-full scroll-mt-20">
        <div className="p-8 sm:p-10 rounded-3xl bg-card/80 border border-border/70 backdrop-blur-xl shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
                <MapPin className="h-3.5 w-3.5" />
                Contact Information
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                ติดต่อคณะการบริหารและนวัตกรรมดิจิทัล
              </h2>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                อาคารเฉลิมพระเกียรติฯ ชั้น 4-8 มหาวิทยาลัยเทคโนโลยีฯ เลขที่ 123 ถนนวิทยานิเวศน์ แขวงทุ่งสองห้อง เขตหลักสี่ กรุงเทพฯ 10210
              </p>

              <div className="mt-6 space-y-3 text-xs">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="p-2 rounded-xl bg-muted text-foreground">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span>โทรศัพท์: 02-123-4567 ต่อ 8001-8005</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="p-2 rounded-xl bg-muted text-foreground">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span>อีเมลติดต่อ: contact@fms.ac.th</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="p-2 rounded-xl bg-muted text-foreground">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span>วันและเวลาทำการ: วันจันทร์ - วันศุกร์ เวลา 08:30 - 16:30 น.</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-muted/40 border border-border/60 flex flex-col justify-between h-full">
              <div>
                <h3 className="font-bold text-sm text-foreground mb-2">ช่องทางสอบถามด่วน</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  หากพบปัญหาการใช้งานระบบคำร้องหรือระบบการเงิน สามารถติดต่อหน่วยสนับสนุนระบบสารสนเทศ
                </p>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-background border border-border/50 text-xs flex items-center justify-between">
                    <span className="font-medium text-foreground">งานบริการการศึกษา (คำร้องนิสิต)</span>
                    <span className="text-primary font-mono font-semibold">ext. 8002</span>
                  </div>
                  <div className="p-3 rounded-xl bg-background border border-border/50 text-xs flex items-center justify-between">
                    <span className="font-medium text-foreground">งานการเงินและพัสดุ (เงินยืมทดลองจ่าย)</span>
                    <span className="text-primary font-mono font-semibold">ext. 8004</span>
                  </div>
                  <div className="p-3 rounded-xl bg-background border border-border/50 text-xs flex items-center justify-between">
                    <span className="font-medium text-foreground">งานแผนงานและงบประมาณ</span>
                    <span className="text-primary font-mono font-semibold">ext. 8005</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 text-right">
                <Link href="/login">
                  <Button size="sm" className="rounded-full text-xs font-bold gap-1.5">
                    เข้าสู่ระบบเจ้าหน้าที่
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="mt-auto border-t border-border/60 bg-card/50 backdrop-blur-md py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-foreground">Faculty of Management Sciences (FMS)</span>
              <span className="text-muted-foreground ml-1.5">· Nexa Vibe Platform</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 font-medium">
            <a href="#cockpit" className="hover:text-foreground transition-colors">บริการด่วน</a>
            <a href="#modules" className="hover:text-foreground transition-colors">8 โมดูล</a>
            <a href="#guide" className="hover:text-foreground transition-colors">คู่มือการใช้งาน</a>
            <Link href="/petitions" className="hover:text-foreground transition-colors">คำร้องนิสิต</Link>
            <Link href="/advance-payment" className="hover:text-foreground transition-colors">เงินยืมทดลองจ่าย</Link>
            <Link href="/login" className="hover:text-foreground transition-colors">เข้าสู่ระบบ</Link>
          </div>

          <div>
            © {new Date().getFullYear()} Faculty of Management Sciences. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
