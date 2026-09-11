import Link from "next/link";
import {
  Shield,
  ArrowRight,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function ArchitectureTrust() {
  return (
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
  );
}
