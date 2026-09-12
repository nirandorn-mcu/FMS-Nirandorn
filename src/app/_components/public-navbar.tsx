"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import {
  Zap,
  Sun,
  Moon,
  ArrowRight,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTenantStore } from "@/components/layout/tenant-store";
import { getTenantInfoAction } from "@/features/identity/actions";
import { useLocale } from "@/shared/lib/i18n/client";
import { useAppSession } from "@/hooks/use-session";
import { localizedName } from "@/shared/lib/format";
import { hasPermission, P } from "@/features/identity";

export function PublicNavbar() {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const { user, roles, permissions, isSuperAdmin, isLoading } = useAppSession();
  const { nameTh, nameEn, logoUrl, loaded, setTenantInfo } = useTenantStore();
  const ctx = { roles, permissions, isSuperAdmin };

  useEffect(() => {
    if (!loaded) {
      getTenantInfoAction().then((res) => {
        if (res.ok) {
          setTenantInfo(res.data);
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

        {!isLoading && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-accent/60 hover:bg-accent border border-border/80 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <div className="h-7 w-7 rounded-full bg-primary/15 text-primary font-bold text-xs flex items-center justify-center overflow-hidden border border-primary/30">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.image} alt={user.name ?? ""} className="h-full w-full object-cover" />
                  ) : (
                    (user.name ?? "?").trim().charAt(0).toUpperCase() || "?"
                  )}
                </div>
                <span className="text-xs font-semibold max-w-[110px] truncate hidden sm:inline-block text-foreground">
                  {user.name}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-xl border-border/80 shadow-xl backdrop-blur-xl">
              <DropdownMenuLabel className="font-normal px-2.5 py-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-xs font-semibold leading-none text-foreground">{user.name}</p>
                  <p className="text-[11px] leading-none text-muted-foreground truncate">{user.email}</p>
                  {roles[0] && (
                    <span className="mt-1.5 w-fit text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
                      {localizedName(roles[0], locale)}
                    </span>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer flex items-center gap-2 text-xs py-2 px-2.5 rounded-lg">
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  <span>คอนโซลเจ้าหน้าที่ (Staff Console)</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/me" className="cursor-pointer flex items-center gap-2 text-xs py-2 px-2.5 rounded-lg">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>ข้อมูลส่วนตัว (Profile)</span>
                </Link>
              </DropdownMenuItem>
              {hasPermission(ctx, P.settingsManage) && (
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer flex items-center gap-2 text-xs py-2 px-2.5 rounded-lg">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span>ตั้งค่าองค์กร (Settings)</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/" })}
                className="cursor-pointer flex items-center gap-2 text-xs py-2 px-2.5 rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                <span>ออกจากระบบ</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button size="sm" className="rounded-full px-4 text-xs font-semibold shadow-md shadow-primary/20 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              เข้าสู่ระบบ
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
