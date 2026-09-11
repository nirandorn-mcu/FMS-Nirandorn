import Link from "next/link";
import { Zap } from "lucide-react";

export function PublicFooter() {
  return (
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
  );
}
