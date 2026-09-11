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

        <div className="savebar">
          <Button type="button" onClick={save} disabled={pending || uploading}>
            {t("common.save")}
          </Button>
        </div>
      </div>
    </>
  );
}
