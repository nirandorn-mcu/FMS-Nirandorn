import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactSection() {
  return (
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
  );
}
