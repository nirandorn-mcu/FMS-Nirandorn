"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Zap, Sun, Moon, ArrowRight } from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Button } from "@/components/ui/button";
import { useTenantStore } from "@/components/layout/tenant-store";
import { getTenantInfoAction } from "@/features/identity/actions";
import { useLocale } from "@/shared/lib/i18n/client";

export function PublicNavbar() {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const { nameTh, nameEn, logoUrl, loaded, setTenantInfo } = useTenantStore();

  useEffect(() => {
    if (!loaded) {
      getTenantInfoAction().then((res) => {
        if (res.ok) {
          setTenantInfo({
            nameTh: res.data.nameTh,
            nameEn: res.data.nameEn,
            logoUrl: res.data.logoUrl,
          });
        }
      });
    }
  }, [loaded, setTenantInfo]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const displayName = (locale === "en" ? nameEn || nameTh : nameTh || nameEn) || "FMS NEXA";
  const subName = (locale === "en" ? nameTh : nameEn) || "Intelligent Faculty Operating Platform";

  return (
    <header className="sticky top-4 z-50 max-w-6xl mx-auto w-[94%] px-4 py-2 rounded-full backdrop-blur-2xl bg-card/80 dark:bg-card/70 border border-border/70 shadow-xl shadow-black/5 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          {logoUrl ? (
            <div className="h-10 w-10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt={displayName}
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary via-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 fill-current" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-foreground">{displayName}</span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                Modular Vibe
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground hidden sm:block">{subName}</p>
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
  );
}
