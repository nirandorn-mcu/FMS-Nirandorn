"use client";

import Link from "next/link";
import {
  Zap,
  ArrowUp,
  ShieldCheck,
  GraduationCap,
  CreditCard,
  PieChart,
  BookOpen,
  HelpCircle,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { useTenantStore } from "@/components/layout/tenant-store";
import { useLocale } from "@/shared/lib/i18n/client";

export function PublicFooter() {
  const locale = useLocale();
  const { nameTh, nameEn, logoUrl } = useTenantStore();

  const displayName = (locale === "en" ? nameEn || nameTh : nameTh || nameEn) || "คณะวิทยาการจัดการ";
  const subName = (locale === "en" ? nameTh : nameEn) || "Faculty of Management Sciences";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-20 border-t border-border/70 bg-card/75 dark:bg-card/50 backdrop-blur-2xl text-muted-foreground overflow-hidden">
      {/* Top luminous accent gradient border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      
      {/* Ambient background glow */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 pt-14 pb-8">
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-border/60">
          
          {/* Col 1 & 2: Brand Info & Description */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              {logoUrl ? (
                <div className="h-11 w-11 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoUrl}
                    alt={displayName}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary via-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
                  <Zap className="h-5 w-5 fill-current" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-foreground">{displayName}</span>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                    Live
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{subName}</p>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-muted-foreground/90 max-w-sm">
              แพลตฟอร์มศูนย์กลางการบริหารงานคณะและบริการการศึกษายุคใหม่ พัฒนาด้วยสถาปัตยกรรม <strong>Modular Monolith</strong> เชื่อมโยงระบบคำร้องนิสิต การเงินยืมทดลองจ่าย และงบประมาณโครงการ ไร้รอยต่อ ปลอดภัย และโปร่งใส
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ทุกระบบพร้อมให้บริการปกติ
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted/60 text-muted-foreground border border-border/50 text-[11px]">
                <ShieldCheck className="h-3 w-3 text-primary" />
                TLS 1.3 / ISO 27001
              </span>
            </div>
          </div>

          {/* Col 3: Quick Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" />
              บริการออนไลน์
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/petitions" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <GraduationCap className="h-3 w-3 text-muted-foreground" />
                  <span>ยื่นคำร้องนิสิตออนไลน์</span>
                </Link>
              </li>
              <li>
                <Link href="/advance-payment" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <CreditCard className="h-3 w-3 text-muted-foreground" />
                  <span>ระบบเงินยืมทดลองจ่าย</span>
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <PieChart className="h-3 w-3 text-muted-foreground" />
                  <span>โครงการและงบประมาณ</span>
                </Link>
              </li>
              <li>
                <Link href="/curriculums" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <BookOpen className="h-3 w-3 text-muted-foreground" />
                  <span>ระบบจัดการหลักสูตรการศึกษา</span>
                </Link>
              </li>
              <li>
                <a href="#cockpit" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-muted-foreground" />
                  <span>ตรวจสอบสถานะด่วน</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Guide & Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              คู่มือและระบบ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#guide" className="hover:text-primary transition-colors">
                  ขั้นตอนการใช้งานระบบ
                </a>
              </li>
              <li>
                <a href="#modules" className="hover:text-primary transition-colors">
                  8 โมดูลบริหารงานคณะ
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-primary transition-colors">
                  สถาปัตยกรรมความปลอดภัย
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary transition-colors">
                  ติดต่อฝ่ายสนับสนุน
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Staff & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-primary" />
              สำหรับเจ้าหน้าที่
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login" className="font-semibold text-primary hover:underline flex items-center gap-1">
                  <span>เข้าสู่ระบบ Staff Console</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Dashboard สรุปผล
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-primary transition-colors">
                  การตั้งค่าระบบองค์กร
                </Link>
              </li>
              <li>
                <Link href="/me" className="hover:text-primary transition-colors">
                  จัดการบัญชีผู้ใช้
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground/80">
          <div className="flex flex-wrap items-center gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} {displayName}. All rights reserved.</span>
            <span className="hidden sm:inline">·</span>
            <span className="text-foreground/70">ขับเคลื่อนด้วย Liyon Design System & Next.js 16</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#hero" className="hover:text-foreground transition-colors">
              หน้าแรก
            </a>
            <a href="#contact" className="hover:text-foreground transition-colors">
              ติดต่อเรา
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent hover:bg-accent/80 text-foreground border border-border/80 transition-all text-[11px] font-medium cursor-pointer shadow-xs"
              title="กลับสู่ด้านบน"
            >
              <ArrowUp className="h-3 w-3 text-primary" />
              <span>กลับขึ้นบน</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
