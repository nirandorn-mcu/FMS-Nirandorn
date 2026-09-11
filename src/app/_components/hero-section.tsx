"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Zap,
  GraduationCap,
  CreditCard,
  PieChart,
  Compass,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const quickPrompts = [
  { label: "ยื่นคำร้องนิสิต", href: "/petitions", icon: GraduationCap },
  { label: "เงินยืมทดลองจ่าย", href: "/advance-payment", icon: CreditCard },
  { label: "งบประมาณโครงการ", href: "/projects", icon: PieChart },
  { label: "คู่มือการใช้งาน", href: "#guide", icon: Compass },
  { label: "เข้าสู่ระบบ Admin", href: "/login", icon: Key },
];

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section id="hero" className="relative pt-16 pb-12 md:pt-24 md:pb-20 px-4 max-w-6xl mx-auto w-full text-center flex flex-col items-center">
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
    </section>
  );
}
