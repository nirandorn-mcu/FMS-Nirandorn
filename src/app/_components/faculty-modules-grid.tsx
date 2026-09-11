import Link from "next/link";
import {
  GraduationCap,
  CreditCard,
  PieChart,
  Newspaper,
  Users,
  BookOpen,
  FileCheck,
  CalendarCheck2,
  Layers,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function FacultyModulesGrid() {
  return (
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
  );
}
