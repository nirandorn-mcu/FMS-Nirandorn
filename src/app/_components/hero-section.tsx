"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Star,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Calendar,
  MessageSquare,
  FileCheck,
  Zap,
  Users,
  CreditCard,
  GraduationCap,
  PieChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/petitions?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <section
      id="hero"
      className="relative pt-8 pb-16 md:pt-14 md:pb-24 px-4 max-w-6xl mx-auto w-full flex flex-col justify-center"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* ─── LEFT COLUMN: Typography, CTA, Metrics & Rating ─── */}
        <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-xl text-primary text-xs font-bold tracking-wide uppercase shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span>✦ Intelligent Faculty Platform</span>
          </div>

          {/* Main Hero Headline with Monotree Underline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-foreground leading-[1.14]">
            ขับเคลื่อนทุกบริการ
            <br />
            <span className="relative inline-block">
              เพื่อผู้ใช้งาน
              {/* Monotree hand-drawn curved underline accent */}
              <svg
                className="absolute -bottom-2.5 left-0 w-full text-emerald-500 dark:text-emerald-400 h-3.5 overflow-visible"
                viewBox="0 0 250 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 13C65 3 185 3 247 13"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M20 16C75 8 175 8 230 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeOpacity="0.6"
                />
              </svg>
            </span>
            {" "}เป็นอันดับแรก
          </h1>

          {/* Subtitle description */}
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg font-normal">
            รวดเร็ว ใช้งานง่าย และเชื่อมโยงทุกกระบวนการ — ยกระดับงานบริการการศึกษา คำร้องนิสิต เงินยืมทดลองจ่าย และงบประมาณโครงการ ด้วยแพลตฟอร์ม Modular Monolith ที่ตอบโจทย์การทำงานอย่างแท้จริง
          </p>

          {/* Action Input CTA Bar (Monotree Style) */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-center gap-2 p-1.5 sm:p-2 rounded-2xl sm:rounded-full bg-card/90 dark:bg-card/75 border border-border/80 shadow-xl backdrop-blur-xl w-full max-w-md"
          >
            <div className="flex items-center gap-2.5 px-3 w-full sm:w-auto flex-1">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาคำร้อง, ติดตามสถานะ..."
                className="bg-transparent border-none outline-none text-xs sm:text-sm text-foreground placeholder:text-muted-foreground w-full"
              />
            </div>
            <Link href="/petitions" className="w-full sm:w-auto">
              <Button
                type="button"
                size="sm"
                className="rounded-full px-5 text-xs font-bold w-full sm:w-auto gap-1.5 shadow-md bg-emerald-500 hover:bg-emerald-600 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-all cursor-pointer"
              >
                เริ่มต้นใช้งาน
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </form>

          {/* Key Metrics Section (75.2% & ~20k style) */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-border/60 max-w-md w-full">
            <div>
              <div className="text-3xl font-extrabold text-foreground tracking-tight flex items-baseline gap-1">
                <span>99.8%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                ความพร้อมของระบบ (SLA)
              </p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground tracking-tight">
                ~5,000+
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                นิสิตและบุคลากรในระบบ
              </p>
            </div>
          </div>

          {/* Star Rating Badge */}
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground pt-1">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <span className="font-bold text-foreground">4.9 / 5.0</span>
            <span className="text-muted-foreground/80">ความพึงพอใจของผู้ใช้งาน</span>
          </div>

        </div>

        {/* ─── RIGHT COLUMN: Isometric 3D Layered Mockups (Monotree Style) ─── */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[420px] lg:min-h-[480px]">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-cyan-500/15 to-emerald-500/10 blur-[90px] rounded-full -z-10" />

          {/* Isometric Perspective Container */}
          <div className="relative w-full max-w-[460px] h-[440px] flex items-center justify-center">
            
            {/* Background 3D Phone Outline Art */}
            <div className="absolute right-4 top-4 w-64 h-[380px] rounded-[36px] border-2 border-foreground/15 dark:border-foreground/20 bg-card/40 dark:bg-card/30 backdrop-blur-xl shadow-2xl rotate-6 transform-gpu transition-transform hover:rotate-3 duration-500 overflow-hidden">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full bg-foreground/10" />
            </div>

            {/* 1. Floating Top Left Card: Schedule / Calendar */}
            <div className="absolute top-2 left-2 sm:left-4 z-20 p-3 rounded-2xl bg-card/95 dark:bg-card/90 border border-border/80 shadow-xl backdrop-blur-md -rotate-6 hover:rotate-0 transition-transform duration-300 w-44">
              <div className="flex items-center justify-between text-[11px] font-bold text-foreground mb-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  ตารางงานวันนี้
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">TUE, 12</span>
              </div>
              <div className="space-y-1.5 text-[10px]">
                <div className="p-1.5 rounded-lg bg-muted/60 border border-border/50 flex items-center justify-between">
                  <span className="text-foreground font-medium truncate">ตรวจสอบคำร้อง</span>
                  <span className="text-muted-foreground text-[9px]">09:00</span>
                </div>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-between">
                  <span className="font-medium truncate">อนุมัติเบิกจ่าย</span>
                  <span className="text-[9px]">10:30</span>
                </div>
              </div>
            </div>

            {/* 2. Floating Center Card: Chat & Hub Notification */}
            <div className="absolute top-16 right-0 sm:right-2 z-30 p-4 rounded-2xl bg-card/95 dark:bg-card/90 border border-border/80 shadow-2xl backdrop-blur-xl w-60 rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">
                    <MessageSquare className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-foreground">FMS Hub</span>
                </div>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>42 ออนไลน์</span>
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="p-2 rounded-xl bg-muted/50 text-[11px] text-foreground leading-snug">
                  <span className="text-primary font-bold text-[10px] block mb-0.5">ระบบคำร้อง</span>
                  อนุมัติคำร้องขอเทียบโอนรายวิชาเรียบร้อยแล้ว
                </div>
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-600 dark:text-emerald-400 leading-snug">
                  <span className="font-bold text-[10px] block mb-0.5">การเงินและพัสดุ</span>
                  โอนเงินยืมทดลองจ่ายโครงการสำเร็จ ฿45,000
                </div>
              </div>
            </div>

            {/* 3. Floating Bottom Left Card: Interactive To-Do Checklist */}
            <div className="absolute bottom-6 left-0 sm:left-4 z-40 p-4 rounded-2xl bg-card/95 dark:bg-card/90 border border-border/80 shadow-2xl backdrop-blur-xl w-64 -rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <FileCheck className="h-3.5 w-3.5 text-emerald-500" />
                  To-do list (รายการงาน)
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  3 เสร็จสิ้น
                </span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="truncate">คำร้องขอผ่อนผันค่าธรรมเนียม</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="truncate">สัญญายืมเงินจัดสัมมนาวิชาการ</span>
                </div>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="truncate">รายงานความก้าวหน้าโครงการ</span>
                </div>
              </div>

              {/* Bottom Mini App Dock inside To-Do Card */}
              <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between px-1 text-muted-foreground">
                <div className="p-1.5 rounded-lg bg-muted/70 hover:text-primary transition-colors">
                  <GraduationCap className="h-3.5 w-3.5" />
                </div>
                <div className="p-1.5 rounded-lg bg-muted/70 hover:text-primary transition-colors">
                  <CreditCard className="h-3.5 w-3.5" />
                </div>
                <div className="p-1.5 rounded-lg bg-muted/70 hover:text-primary transition-colors">
                  <PieChart className="h-3.5 w-3.5" />
                </div>
                <div className="p-1.5 rounded-lg bg-muted/70 hover:text-primary transition-colors">
                  <Zap className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

            {/* 4. Floating Performance Metric Card (Bottom Right) */}
            <div className="absolute bottom-12 right-2 sm:right-6 z-30 p-3 rounded-2xl bg-card/95 dark:bg-card/90 border border-border/80 shadow-xl backdrop-blur-md rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span>Overall Performance</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-foreground">88.5%</span>
                <span className="text-[10px] font-bold text-emerald-500">▲ +12.4%</span>
              </div>
              {/* Mini visual bar */}
              <div className="mt-1.5 w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[88%]" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

