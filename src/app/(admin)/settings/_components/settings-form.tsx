"use client";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiyonCard, LiyonField, PalettePicker } from "@/shared/components/liyon";
import { useT } from "@/shared/lib/i18n/client";
import type { PaletteId } from "@/shared/lib/palette";
import type { TenantSettings } from "@/features/identity";
import { updateSettingsAction, uploadLogoAction } from "@/features/identity/actions";
import { useTenantStore } from "@/components/layout/tenant-store";

export function SettingsForm({ initial }: { initial: TenantSettings }) {
  const t = useT();
  const router = useRouter();
  const setTenantInfo = useTenantStore((s) => s.setTenantInfo);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    nameTh: initial.nameTh,
    nameEn: initial.nameEn,
    logoUrl: initial.logoUrl ?? "",
    palette: initial.palette as PaletteId,
    smtpEmail: initial.smtpEmail ?? "",
    smtpPassword: initial.smtpPassword ?? "",
    contactAddress: initial.contactAddress ?? "",
    contactPhone: initial.contactPhone ?? "",
    contactEmail: initial.contactEmail ?? "",
    contactOfficeHours: initial.contactOfficeHours ?? "",
    quickExtEdu: initial.quickExtEdu ?? "",
    quickExtFinance: initial.quickExtFinance ?? "",
    quickExtPlan: initial.quickExtPlan ?? "",
    contactFacebook: initial.contactFacebook ?? "",
    contactLine: initial.contactLine ?? "",
    contactWebsite: initial.contactWebsite ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [pending, start] = useTransition();
  const [uploading, setUploading] = useState(false);

  function save() {
    start(async () => {
      const r = await updateSettingsAction(form);
      if (!r.ok) {
        setErrors(r.error.fieldErrors ?? {});
        if (!r.error.fieldErrors) toast.error(r.error.message || t(`error.${r.error.code}`));
        return;
      }
      setTenantInfo({
        nameTh: form.nameTh,
        nameEn: form.nameEn,
        logoUrl: form.logoUrl || null,
        contactAddress: form.contactAddress,
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
        contactOfficeHours: form.contactOfficeHours,
        quickExtEdu: form.quickExtEdu,
        quickExtFinance: form.quickExtFinance,
        quickExtPlan: form.quickExtPlan,
        contactFacebook: form.contactFacebook,
        contactLine: form.contactLine,
        contactWebsite: form.contactWebsite,
      });
      setErrors({});
      toast.success(t("settings.saveOk"));
      router.refresh();
    });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadLogoAction(formData);
      if (!res.ok) {
        toast.error(res.error.message || "อัพโหลดรูปภาพไม่สำเร็จ");
        return;
      }

      setForm((prev) => ({ ...prev, logoUrl: res.data.url }));
      toast.success(t("settings.uploadSuccess"));
    } catch {
      toast.error("เกิดข้อผิดพลาดในการอัพโหลด");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <>
      <header className="ph">
        <h1>{t("settings.title")}</h1>
      </header>
      <div className="set-cards">
        <LiyonCard>
          <h2>{t("settings.orgTitle")}</h2>
          <div className="fields">
            <LiyonField
              label={t("settings.nameTh")}
              htmlFor="s-name-th"
              error={errors.nameTh?.[0]}
            >
              <input
                id="s-name-th"
                value={form.nameTh}
                onChange={(e) => setForm({ ...form, nameTh: e.target.value })}
              />
            </LiyonField>
            <LiyonField
              label={t("settings.nameEn")}
              htmlFor="s-name-en"
              error={errors.nameEn?.[0]}
            >
              <input
                id="s-name-en"
                value={form.nameEn}
                onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
              />
            </LiyonField>

            {/* Logo Section with File Upload & Preview */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold text-foreground/80 block">
                {t("settings.logoUrl")}
              </label>

              <div className="logo-up">
                <div className="prev">
                  {form.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.logoUrl}
                      alt={t("settings.preview")}
                      className="max-h-full max-w-full object-contain"
                      onError={() => {
                        toast.error("ไม่สามารถโหลดรูปภาพจาก URL ที่ระบุได้");
                      }}
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground/60" />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="text-xs inline-flex items-center gap-1.5"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>{t("settings.uploading")}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-3.5 w-3.5" />
                          <span>{t("settings.uploadLogo")}</span>
                        </>
                      )}
                    </Button>

                    {form.logoUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setForm({ ...form, logoUrl: "" })}
                        disabled={uploading}
                        className="text-xs text-destructive hover:text-destructive/80 inline-flex items-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>{t("settings.removeLogo")}</span>
                      </Button>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {t("settings.uploadHint")}
                  </span>
                </div>
              </div>

              <LiyonField
                label={t("settings.orUrl")}
                htmlFor="s-logo"
                hint={t("common.optional")}
                error={errors.logoUrl?.[0]}
              >
                <input
                  id="s-logo"
                  type="text"
                  placeholder="https://... หรือ /uploads/..."
                  value={form.logoUrl}
                  onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                />
              </LiyonField>
            </div>
          </div>
        </LiyonCard>

        <LiyonCard>
          <h2>{t("settings.brandTitle")}</h2>
          <p>{t("settings.brandDesc")}</p>
          <PalettePicker
            value={form.palette}
            onChange={(p) => setForm({ ...form, palette: p })}
            label={t("settings.paletteLabel")}
          />
          {form.palette === "coral" && (
            <p className="warn" role="note">
              {t("settings.coralWarn")}
            </p>
          )}
        </LiyonCard>

        <LiyonCard>
          <h2>การตั้งค่าส่งอีเมล (SMTP Gmail)</h2>
          <p>ตั้งค่าอีเมลองค์กรสำหรับใช้ส่งแจ้งเตือนและรหัสผ่าน (แนะนำให้ใช้รหัสผ่าน App Password จาก Google Account)</p>
          <div className="fields">
            <LiyonField
              label="อีเมล (Gmail)"
              htmlFor="s-smtp-email"
              error={errors.smtpEmail?.[0]}
              hint="ตัวอย่าง: admin@gmail.com (เว้นว่างเพื่อใช้ค่าระบบ)"
            >
              <input
                id="s-smtp-email"
                type="email"
                placeholder="admin@gmail.com"
                value={form.smtpEmail}
                onChange={(e) => setForm({ ...form, smtpEmail: e.target.value })}
              />
            </LiyonField>
            <LiyonField
              label="รหัสผ่าน App Password"
              htmlFor="s-smtp-pass"
              error={errors.smtpPassword?.[0]}
              hint="รหัสผ่าน 16 หลัก ที่ได้จากหน้า Security ของ Google (เว้นว่างหากไม่เปลี่ยน)"
            >
              <input
                id="s-smtp-pass"
                type="password"
                placeholder="••••••••••••••••"
                value={form.smtpPassword}
                onChange={(e) => setForm({ ...form, smtpPassword: e.target.value })}
              />
            </LiyonField>
          </div>
        </LiyonCard>

        <LiyonCard>
          <h2>{t("settings.contactTitle")}</h2>
          <p>{t("settings.contactDesc")}</p>
          <div className="fields">
            <LiyonField
              label={t("settings.contactAddress")}
              htmlFor="s-contact-address"
              hint={t("common.optional")}
              error={errors.contactAddress?.[0]}
            >
              <textarea
                id="s-contact-address"
                rows={2}
                placeholder="อาคารเฉลิมพระเกียรติฯ เลขที่..."
                value={form.contactAddress}
                onChange={(e) => setForm({ ...form, contactAddress: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </LiyonField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LiyonField
                label={t("settings.contactPhone")}
                htmlFor="s-contact-phone"
                hint={t("common.optional")}
                error={errors.contactPhone?.[0]}
              >
                <input
                  id="s-contact-phone"
                  type="text"
                  placeholder="02-123-4567 ต่อ 8001-8005"
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                />
              </LiyonField>

              <LiyonField
                label={t("settings.contactEmail")}
                htmlFor="s-contact-email"
                hint={t("common.optional")}
                error={errors.contactEmail?.[0]}
              >
                <input
                  id="s-contact-email"
                  type="email"
                  placeholder="contact@fms.ac.th"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                />
              </LiyonField>
            </div>

            <LiyonField
              label={t("settings.contactOfficeHours")}
              htmlFor="s-contact-hours"
              hint={t("common.optional")}
              error={errors.contactOfficeHours?.[0]}
            >
              <input
                id="s-contact-hours"
                type="text"
                placeholder="วันจันทร์ - วันศุกร์ เวลา 08:30 - 16:30 น."
                value={form.contactOfficeHours}
                onChange={(e) => setForm({ ...form, contactOfficeHours: e.target.value })}
              />
            </LiyonField>

            <div className="pt-2">
              <h3 className="text-sm font-semibold text-foreground mb-2">{t("settings.quickExtTitle")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <LiyonField
                  label={t("settings.quickExtEdu")}
                  htmlFor="s-ext-edu"
                  hint="ตัวอย่าง: ext. 8002"
                  error={errors.quickExtEdu?.[0]}
                >
                  <input
                    id="s-ext-edu"
                    type="text"
                    placeholder="ext. 8002"
                    value={form.quickExtEdu}
                    onChange={(e) => setForm({ ...form, quickExtEdu: e.target.value })}
                  />
                </LiyonField>

                <LiyonField
                  label={t("settings.quickExtFinance")}
                  htmlFor="s-ext-finance"
                  hint="ตัวอย่าง: ext. 8004"
                  error={errors.quickExtFinance?.[0]}
                >
                  <input
                    id="s-ext-finance"
                    type="text"
                    placeholder="ext. 8004"
                    value={form.quickExtFinance}
                    onChange={(e) => setForm({ ...form, quickExtFinance: e.target.value })}
                  />
                </LiyonField>

                <LiyonField
                  label={t("settings.quickExtPlan")}
                  htmlFor="s-ext-plan"
                  hint="ตัวอย่าง: ext. 8005"
                  error={errors.quickExtPlan?.[0]}
                >
                  <input
                    id="s-ext-plan"
                    type="text"
                    placeholder="ext. 8005"
                    value={form.quickExtPlan}
                    onChange={(e) => setForm({ ...form, quickExtPlan: e.target.value })}
                  />
                </LiyonField>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-semibold text-foreground mb-2">{t("settings.socialTitle")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <LiyonField
                  label={t("settings.contactFacebook")}
                  htmlFor="s-facebook"
                  hint={t("common.optional")}
                  error={errors.contactFacebook?.[0]}
                >
                  <input
                    id="s-facebook"
                    type="text"
                    placeholder="fms.official"
                    value={form.contactFacebook}
                    onChange={(e) => setForm({ ...form, contactFacebook: e.target.value })}
                  />
                </LiyonField>

                <LiyonField
                  label={t("settings.contactLine")}
                  htmlFor="s-line"
                  hint={t("common.optional")}
                  error={errors.contactLine?.[0]}
                >
                  <input
                    id="s-line"
                    type="text"
                    placeholder="@fms-official"
                    value={form.contactLine}
                    onChange={(e) => setForm({ ...form, contactLine: e.target.value })}
                  />
                </LiyonField>

                <LiyonField
                  label={t("settings.contactWebsite")}
                  htmlFor="s-website"
                  hint={t("common.optional")}
                  error={errors.contactWebsite?.[0]}
                >
                  <input
                    id="s-website"
                    type="text"
                    placeholder="https://fms.ac.th"
                    value={form.contactWebsite}
                    onChange={(e) => setForm({ ...form, contactWebsite: e.target.value })}
                  />
                </LiyonField>
              </div>
            </div>
          </div>
        </LiyonCard>

        <div className="savebar">
          <Button type="button" onClick={save} disabled={pending || uploading}>
            {t("common.save")}
          </Button>
        </div>
      </div>
    </>
  );
}
