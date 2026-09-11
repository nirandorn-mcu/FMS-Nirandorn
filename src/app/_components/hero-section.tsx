"use client";

import Link from "next/link";
import {
  Star,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative pt-6 pb-14 md:pt-12 md:pb-20 px-4 max-w-6xl mx-auto w-full flex flex-col justify-center"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* ─── LEFT COLUMN: Enlango Style Typography, CTA & Metrics ─── */}
        <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
          
          {/* Rating Pill Badge (Enlango 4.9 on TrustPilot style) */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/90 dark:bg-card/75 border border-border/80 shadow-xs text-xs font-semibold text-foreground backdrop-blur-md">
            <div className="h-5 w-5 rounded-full bg-primary/15 text-primary flex items-center justify-center">
              <Star className="h-3 w-3 fill-primary text-primary" />
            </div>
            <span className="font-bold">4.9</span>
            <span className="text-muted-foreground">ความพึงพอใจการให้บริการ</span>
          </div>

          {/* Headline with inline avatars & stylized italic keyword */}
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight text-foreground leading-[1.14]">
            เชื่อมโยง
            <br />
            ทุกบริการ{" "}
            <span className="inline-flex items-center align-middle -mt-1 mx-1">
              <span className="flex -space-x-2.5 overflow-hidden py-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-background object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Student 1"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-background object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Student 2"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-background object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                  alt="Student 3"
                />
              </span>
            </span>{" "}
            <span className="italic font-serif font-medium text-primary underline decoration-primary/40 decoration-wavy">
              สู่อนาคต
            </span>
            <br />
            ด้วยระบบดิจิทัล
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg font-normal">
            แพลตฟอร์มศูนย์กลางบริการการศึกษาและบริหารงานคณะ พัฒนาด้วยสถาปัตยกรรม <strong>Modular Monolith</strong> เชื่อมโยงระบบคำร้องนิสิต การเงินยืมทดลองจ่าย และงบประมาณโครงการ ไร้รอยต่อ สะดวก และโปร่งใส
          </p>

          {/* Enlango-style Rounded Action Button */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link href="/petitions">
              <Button
                size="lg"
                className="rounded-full px-7 text-xs sm:text-sm font-bold shadow-lg shadow-primary/25 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 transition-all cursor-pointer h-11"
              >
                เริ่มต้นใช้งาน - บริการออนไลน์
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#guide">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-5 text-xs sm:text-sm font-semibold border-border/80 hover:bg-accent gap-2 h-11"
              >
                คู่มือการใช้งาน
              </Button>
            </Link>
          </div>

          {/* 3 Enlango-style Metrics (100%, 12+, 100K+ layout) */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/60 max-w-lg w-full">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                100%
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 font-medium">
                บริการออนไลน์
              </p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                8+
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 font-medium">
                โมดูลอัจฉริยะ
              </p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                5,000+
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 font-medium">
                นิสิตและบุคลากร
              </p>
            </div>
          </div>

        </div>

        {/* ─── RIGHT COLUMN: Enlango Photo Container with Floating Overlay Badges ─── */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-cyan-500/15 to-emerald-500/10 blur-[90px] rounded-full -z-10" />

          {/* Main Photo Wrapper Frame */}
          <div className="relative w-full max-w-[440px] pt-4 pb-6 px-4">
            
            {/* Dot Matrix Decorative Background (Enlango style) */}
            <div className="absolute top-0 right-2 w-3/4 h-3/4 bg-[radial-gradient(#80808025_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#ffffff15_1.5px,transparent_1.5px)] bg-[size:16px_16px] rounded-3xl -z-10" />

            {/* Central Main Rounded Image Frame */}
            <div className="relative w-full h-[380px] sm:h-[420px] rounded-[36px] sm:rounded-[42px] overflow-hidden border-2 border-border/70 shadow-2xl bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-students.jpg"
                alt="มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย วิทยาเขตขอนแก่น"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* 1. Floating Pill Top Right: Group Courses style (ระบบคำร้องนิสิต) */}
            <div className="absolute top-8 right-0 sm:-right-3 z-20 px-3.5 py-1.5 rounded-full bg-card/95 dark:bg-card/90 border border-border/80 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-semibold text-foreground animate-in fade-in duration-500">
              <div className="h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </div>
              <span>ระบบคำร้องนิสิต</span>
            </div>

            {/* 2. Floating Pill Below Top Right: One-to-One Session style (บริการเงินยืมทดลองจ่าย) */}
            <div className="absolute top-20 right-2 sm:-right-1 z-20 px-3.5 py-1.5 rounded-full bg-card/95 dark:bg-card/90 border border-border/80 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-semibold text-foreground animate-in fade-in duration-700">
              <div className="h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </div>
              <span>เงินยืมทดลองจ่าย</span>
            </div>

            {/* 3. Floating Card Middle Left: 50+ Global Language Support style */}
            <div className="absolute top-36 -left-2 sm:-left-6 z-20 p-3.5 rounded-2xl bg-primary text-primary-foreground shadow-2xl w-36 sm:w-40 border border-primary/20 backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-black leading-none">8+</div>
              <p className="text-[11px] font-bold mt-1 leading-tight">โมดูลงานดิจิทัล</p>
              <p className="text-[9px] opacity-80 mt-0.5">Faculty Ecosystem</p>
            </div>

            {/* 4. Floating Card Bottom Left: Add your skills style (บริการด่วน) */}
            <div className="absolute bottom-4 -left-1 sm:-left-4 z-30 p-3.5 rounded-2xl bg-card/95 dark:bg-card/90 border border-border/80 shadow-2xl backdrop-blur-xl max-w-[240px]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>บริการด่วนออนไลน์</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Link
                  href="/petitions"
                  className="px-2 py-0.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-semibold border border-primary/20 transition-colors"
                >
                  + คำร้อง
                </Link>
                <Link
                  href="/advance-payment"
                  className="px-2 py-0.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-semibold border border-primary/20 transition-colors"
                >
                  + เงินยืม
                </Link>
                <Link
                  href="/projects"
                  className="px-2 py-0.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-semibold border border-primary/20 transition-colors"
                >
                  + โครงการ
                </Link>
              </div>
            </div>

            {/* 5. Floating Card Bottom Right: 1500+ free Lessons style */}
            <div className="absolute bottom-2 -right-2 sm:-right-4 z-20 p-3.5 rounded-2xl bg-primary text-primary-foreground shadow-2xl w-36 sm:w-40 border border-primary/20 backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-black leading-none">100%</div>
              <p className="text-[11px] font-bold mt-1 leading-tight">ติดตามสถานะสด</p>
              <p className="text-[9px] opacity-80 mt-0.5">Real-time Tracking</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

