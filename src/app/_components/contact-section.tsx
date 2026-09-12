"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Globe,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenantStore } from "@/components/layout/tenant-store";
import type { PublicTenantInfo } from "@/features/identity";

interface ContactSectionProps {
  contact?: PublicTenantInfo;
}

export function ContactSection({ contact: propContact }: ContactSectionProps) {
  const storeContact = useTenantStore();
  const contact = propContact || storeContact;

  const displayName = contact.nameTh || "คณะการบริหารและนวัตกรรมดิจิทัล";
  const address =
    contact.contactAddress ||
    "อาคารเฉลิมพระเกียรติฯ ชั้น 4-8 มหาวิทยาลัยเทคโนโลยีฯ เลขที่ 123 ถนนวิทยานิเวศน์ แขวงทุ่งสองห้อง เขตหลักสี่ กรุงเทพฯ 10210";
  const phone = contact.contactPhone || "02-123-4567 ต่อ 8001-8005";
  const email = contact.contactEmail || "contact@fms.ac.th";
  const officeHours =
    contact.contactOfficeHours ||
    "วันจันทร์ - วันศุกร์ เวลา 08:30 - 16:30 น.";

  const extEdu = contact.quickExtEdu || "ext. 8002";
  const extFinance = contact.quickExtFinance || "ext. 8004";
  const extPlan = contact.quickExtPlan || "ext. 8005";

  const facebook = contact.contactFacebook;
  const line = contact.contactLine;
  const website = contact.contactWebsite;

  return (
    <section id="contact" className="py-14 px-4 max-w-6xl mx-auto w-full scroll-mt-20">
      <div className="p-8 sm:p-10 rounded-3xl bg-card/80 border border-border/70 backdrop-blur-xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
              <MapPin className="h-3.5 w-3.5" />
              Contact Information
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              ติดต่อ{displayName}
            </h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed whitespace-pre-line">
              {address}
            </p>

            <div className="mt-6 space-y-3 text-xs">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="p-2 rounded-xl bg-muted text-foreground shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <span>โทรศัพท์: {phone}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="p-2 rounded-xl bg-muted text-foreground shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <span>
                  อีเมลติดต่อ:{" "}
                  <a
                    href={`mailto:${email}`}
                    className="text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
                  >
                    {email}
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="p-2 rounded-xl bg-muted text-foreground shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <span>วันและเวลาทำการ: {officeHours}</span>
              </div>
            </div>

            {/* Social / Online Channels */}
            {(facebook || line || website) && (
              <div className="mt-6 pt-5 border-t border-border/60">
                <div className="flex items-center gap-2 text-xs font-medium text-foreground mb-2">
                  <Share2 className="h-3.5 w-3.5 text-primary" />
                  <span>ช่องทางออนไลน์อื่น ๆ</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {line && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium text-[11px]">
                      <MessageCircle className="h-3 w-3" />
                      LINE: {line}
                    </span>
                  )}
                  {facebook && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium text-[11px]">
                      Facebook: {facebook}
                    </span>
                  )}
                  {website && (
                    <a
                      href={website.startsWith("http") ? website : `https://${website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors font-medium text-[11px]"
                    >
                      <Globe className="h-3 w-3" />
                      เว็บไซต์: {website}
                    </a>
                  )}
                </div>
              </div>
            )}
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
                  <span className="text-primary font-mono font-semibold">{extEdu}</span>
                </div>
                <div className="p-3 rounded-xl bg-background border border-border/50 text-xs flex items-center justify-between">
                  <span className="font-medium text-foreground">งานการเงินและพัสดุ (เงินยืมทดลองจ่าย)</span>
                  <span className="text-primary font-mono font-semibold">{extFinance}</span>
                </div>
                <div className="p-3 rounded-xl bg-background border border-border/50 text-xs flex items-center justify-between">
                  <span className="font-medium text-foreground">งานแผนงานและงบประมาณ</span>
                  <span className="text-primary font-mono font-semibold">{extPlan}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-right">
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
