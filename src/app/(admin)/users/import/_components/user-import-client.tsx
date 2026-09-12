"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ArrowLeft,
  RefreshCw,
  Users,
  Check,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LiyonCard } from "@/shared/components/liyon/card";
import { StatusPill } from "@/shared/components/liyon/status-pill";
import { useT } from "@/shared/lib/i18n/client";
import { generateCsv, parseCsv, csvRowsToObjects } from "@/shared/lib/csv";
import {
  listRolesForPickerAction,
  validateUsersImportAction,
  importUsersAction,
} from "@/features/identity/actions";
import type {
  UserImportPreviewItem,
  UserImportResultItem,
} from "@/features/identity";

interface RoleOption {
  id: string;
  code: string;
  nameTh: string;
  nameEn: string;
}

export function UserImportClient() {
  const t = useT();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [defaultRoleId, setDefaultRoleId] = useState<string>("");
  const [sendInviteEmail, setSendInviteEmail] = useState<boolean>(true);

  // File & parsed state
  const [fileName, setFileName] = useState<string>("");
  const [rawRows, setRawRows] = useState<
    { email: string; name: string; roleCode?: string; status?: string }[]
  >([]);
  const [previewItems, setPreviewItems] = useState<UserImportPreviewItem[]>([]);
  const [previewFilter, setPreviewFilter] = useState<"all" | "valid" | "invalid">("all");
  const [isValidating, setIsValidating] = useState<boolean>(false);

  // Import execution result
  const [pending, startTransition] = useTransition();
  const [importSummary, setImportSummary] = useState<{
    total: number;
    importedCount: number;
    failedCount: number;
    results: UserImportResultItem[];
  } | null>(null);

  // Load available roles
  useEffect(() => {
    listRolesForPickerAction().then((r) => {
      if (r.ok && r.data.length > 0) {
        setRoles(r.data);
        // Default to first non-super role if available, or just the first role
        const studentRole = r.data.find((role) => role.code === "STUDENT");
        const defaultPick = studentRole || r.data[0];
        if (defaultPick) {
          setDefaultRoleId(defaultPick.id);
        }
      }
    });
  }, []);

  // Download CSV template
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        email: "somchai.j@mcu.ac.th",
        name: "สมชาย ใจดี",
        role: "ADMIN",
        status: "ACTIVE",
      },
      {
        email: "somying.k@mcu.ac.th",
        name: "สมหญิง เก่งมาก",
        role: "INSTRUCTOR",
        status: "ACTIVE",
      },
      {
        email: "prasert.s@mcu.ac.th",
        name: "ประเสริฐ สุขี",
        role: "STUDENT",
        status: "ACTIVE",
      },
      {
        email: "boonsong.p@mcu.ac.th",
        name: "บุญส่ง พรหมประสิทธิ์",
        role: "STAFF",
        status: "ACTIVE",
      },
    ];

    const columns = [
      { key: "email", header: "email" },
      { key: "name", header: "name" },
      { key: "role", header: "role" },
      { key: "status", header: "status" },
    ];

    const csvContent = generateCsv(templateData, columns);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_import_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("ดาวน์โหลดเทมเพลตตัวอย่างเรียบร้อยแล้ว");
  };

  // Process selected file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processCsvFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processCsvFile(file);
  };

  const processCsvFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("กรุณาเลือกไฟล์ .csv เท่านั้น");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      const text = evt.target?.result;
      if (typeof text !== "string") {
        toast.error("ไม่สามารถอ่านข้อมูลในไฟล์ได้");
        return;
      }

      try {
        const rows = parseCsv(text);
        if (rows.length < 2) {
          toast.error("ไฟล์ CSV ไม่มีข้อมูล หรือไม่มีแถวส่วนหัว");
          return;
        }

        const objects = csvRowsToObjects(rows);
        if (objects.length === 0) {
          toast.error("ไม่พบแถวข้อมูลในไฟล์ CSV");
          return;
        }

        if (objects.length > 500) {
          toast.warning("ไฟล์มีข้อมูลเกิน 500 รายการ ระบบจะนำเข้าเพียง 500 รายการแรก");
        }

        // Normalize columns (handle Thai/English headers)
        const normalized = objects.slice(0, 500).map((obj) => {
          const email =
            obj.email ||
            obj.mail ||
            obj["e-mail"] ||
            obj["อีเมล"] ||
            obj["user email"] ||
            "";
          const name =
            obj.name ||
            obj.fullname ||
            obj.displayname ||
            obj["ชื่อ"] ||
            obj["ชื่อ-นามสกุล"] ||
            obj["ชื่อผู้ใช้"] ||
            "";
          const roleCode =
            obj.role ||
            obj.rolecode ||
            obj.roles ||
            obj["บทบาท"] ||
            obj["รหัสบทบาท"] ||
            "";
          const status = obj.status || obj["สถานะ"] || "ACTIVE";

          return {
            email: email.trim(),
            name: name.trim(),
            roleCode: roleCode ? roleCode.trim() : undefined,
            status: status ? status.trim() : "ACTIVE",
          };
        });

        setRawRows(normalized);
        await runValidation(normalized, defaultRoleId);
        setStep(2);
      } catch (err: unknown) {
        toast.error(
          err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการแปลงไฟล์ CSV"
        );
      }
    };

    reader.readAsText(file);
  };

  const runValidation = async (
    rows: { email: string; name: string; roleCode?: string; status?: string }[],
    defRoleId?: string
  ) => {
    setIsValidating(true);
    try {
      const res = await validateUsersImportAction({
        users: rows,
        defaultRoleId: defRoleId || undefined,
      });

      if (!res.ok) {
        toast.error(res.error.message || t("common.error"));
        return;
      }

      setPreviewItems(res.data);
    } catch {
      toast.error(t("common.error"));
    } finally {
      setIsValidating(false);
    }
  };

  const handleDefaultRoleChange = (newRoleId: string) => {
    setDefaultRoleId(newRoleId);
    if (rawRows.length > 0) {
      runValidation(rawRows, newRoleId);
    }
  };

  // Submit batch import
  const handleConfirmImport = () => {
    const validRows = previewItems
      .filter((p) => p.isValid)
      .map((p) => ({
        email: p.email,
        name: p.name,
        roleCode: p.roleCode,
        status: p.status,
      }));

    if (validRows.length === 0) {
      toast.error("ไม่มีรายการข้อมูลที่พร้อมนำเข้า");
      return;
    }

    startTransition(async () => {
      const res = await importUsersAction({
        users: validRows,
        defaultRoleId: defaultRoleId || undefined,
        sendInviteEmail,
      });

      if (!res.ok) {
        toast.error(res.error.message || "นำเข้าข้อมูลไม่สำเร็จ");
        return;
      }

      setImportSummary(res.data);
      setStep(3);
      toast.success(
        t("users.importSuccessCount", { n: res.data.importedCount })
      );
    });
  };

  // Download setup links CSV
  const handleDownloadSetupLinks = () => {
    if (!importSummary || importSummary.results.length === 0) return;

    const data = importSummary.results
      .filter((r) => r.link)
      .map((r) => ({
        email: r.email,
        name: r.name,
        roleCode: r.roleCode || "-",
        status: r.status,
        link: r.link || "",
        mailDelivered: r.mailDelivered ? "Yes" : "No",
      }));

    const columns = [
      { key: "email", header: "Email" },
      { key: "name", header: "Name" },
      { key: "roleCode", header: "Role" },
      { key: "status", header: "Status" },
      { key: "link", header: "PasswordSetupLink" },
      { key: "mailDelivered", header: "EmailSent" },
    ];

    const csvContent = generateCsv(data, columns);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    a.href = url;
    a.download = `user_setup_links_${dateStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("ดาวน์โหลดไฟล์ลิงก์เรียบร้อยแล้ว");
  };

  const validCount = previewItems.filter((i) => i.isValid).length;
  const invalidCount = previewItems.filter((i) => !i.isValid).length;

  const filteredPreviewItems = previewItems.filter((item) => {
    if (previewFilter === "valid") return item.isValid;
    if (previewFilter === "invalid") return !item.isValid;
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href="/users">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t("users.backToUsers")}
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("users.importTitle")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("users.importSubtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1.5"
          >
            <Download className="h-4 w-4 text-emerald-600" />
            {t("users.downloadTemplate")}
          </Button>
        </div>
      </div>

      {/* Stepper Wizard Indicator */}
      <div className="grid grid-cols-3 gap-2 border-b pb-4">
        <div
          className={`flex items-center gap-3 p-3 rounded-xl border ${
            step === 1
              ? "bg-primary/5 border-primary text-primary font-medium"
              : step > 1
              ? "bg-emerald-50/50 border-emerald-200 text-emerald-700"
              : "border-border text-muted-foreground"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 1
                ? "bg-primary text-primary-foreground"
                : step > 1
                ? "bg-emerald-600 text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {step > 1 ? <Check className="h-4 w-4" /> : "1"}
          </div>
          <span className="text-sm">{t("users.step1")}</span>
        </div>

        <div
          className={`flex items-center gap-3 p-3 rounded-xl border ${
            step === 2
              ? "bg-primary/5 border-primary text-primary font-medium"
              : step > 2
              ? "bg-emerald-50/50 border-emerald-200 text-emerald-700"
              : "border-border text-muted-foreground"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 2
                ? "bg-primary text-primary-foreground"
                : step > 2
                ? "bg-emerald-600 text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {step > 2 ? <Check className="h-4 w-4" /> : "2"}
          </div>
          <span className="text-sm">{t("users.step2")}</span>
        </div>

        <div
          className={`flex items-center gap-3 p-3 rounded-xl border ${
            step === 3
              ? "bg-primary/5 border-primary text-primary font-medium"
              : "border-border text-muted-foreground"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 3
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            3
          </div>
          <span className="text-sm">{t("users.step3")}</span>
        </div>
      </div>

      {/* STEP 1: Upload & Drag Drop */}
      {step === 1 && (
        <div className="space-y-6">
          <LiyonCard>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-primary/60 hover:bg-primary/[0.02] rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[280px]"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-inner">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {t("users.dropzone")}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                {t("users.dropzoneHint")}
              </p>
              <Button type="button" variant="outline" className="pointer-events-none">
                <FileSpreadsheet className="h-4 w-4 mr-1.5 text-primary" />
                เลือกไฟล์จากอุปกรณ์
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </LiyonCard>

          <LiyonCard className="p-6 bg-muted/30">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              คำแนะนำโครงสร้างไฟล์ CSV
            </h4>
            <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
              <li>
                <strong>email:</strong> อีเมลสำหรับเข้าใช้งานระบบ (ต้องไม่ซ้ำกับผู้ใช้ที่มีอยู่แล้ว)
              </li>
              <li>
                <strong>name:</strong> ชื่อ-นามสกุล หรือชื่อแสดงของผู้ใช้
              </li>
              <li>
                <strong>role:</strong> รหัสบทบาทในระบบ เช่น{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-primary">
                  ADMIN
                </code>
                ,{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-primary">
                  INSTRUCTOR
                </code>
                ,{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-primary">
                  STUDENT
                </code>
                ,{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-primary">
                  STAFF
                </code>{" "}
                (หากเว้นว่างไว้จะใช้บทบาทเริ่มต้นที่ท่านเลือก)
              </li>
              <li>
                <strong>status:</strong> สถานะบัญชี เช่น{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono">ACTIVE</code> หรือ{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono">INACTIVE</code>
              </li>
            </ul>
          </LiyonCard>
        </div>
      )}

      {/* STEP 2: Preview & Validation Table */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Options & Configuration Bar */}
          <LiyonCard className="p-4 bg-muted/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {t("users.defaultRole")}
                  </label>
                  <select
                    value={defaultRoleId}
                    onChange={(e) => handleDefaultRoleChange(e.target.value)}
                    className="text-xs border rounded-lg px-2.5 py-1.5 bg-background text-foreground focus:ring-1 focus:ring-primary outline-none"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nameTh} ({r.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 md:pt-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={sendInviteEmail}
                      onChange={(e) => setSendInviteEmail(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-foreground">{t("users.sendInvite")}</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStep(1);
                    setPreviewItems([]);
                    setRawRows([]);
                  }}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  {t("users.reupload")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={validCount === 0 || pending || isValidating}
                  onClick={handleConfirmImport}
                >
                  {pending ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      กำลังนำเข้า...
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1.5" />
                      {t("users.confirmImport", { n: validCount })}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </LiyonCard>

          {/* Stat Pills & Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">ไฟล์:</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted">
                {fileName}
              </span>
              <span className="text-xs text-muted-foreground">
                (ทั้งหมด {previewItems.length} รายการ)
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setPreviewFilter("all")}
                className={`px-3 py-1 rounded-full border transition-colors ${
                  previewFilter === "all"
                    ? "bg-foreground text-background font-medium"
                    : "bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                ทั้งหมด ({previewItems.length})
              </button>
              <button
                type="button"
                onClick={() => setPreviewFilter("valid")}
                className={`px-3 py-1 rounded-full border transition-colors flex items-center gap-1 ${
                  previewFilter === "valid"
                    ? "bg-emerald-600 text-white font-medium border-emerald-600"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70"
                }`}
              >
                <CheckCircle2 className="h-3 w-3" />
                พร้อมนำเข้า ({validCount})
              </button>
              {invalidCount > 0 && (
                <button
                  type="button"
                  onClick={() => setPreviewFilter("invalid")}
                  className={`px-3 py-1 rounded-full border transition-colors flex items-center gap-1 ${
                    previewFilter === "invalid"
                      ? "bg-rose-600 text-white font-medium border-rose-600"
                      : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/70"
                  }`}
                >
                  <XCircle className="h-3 w-3" />
                  พบข้อผิดพลาด ({invalidCount})
                </button>
              )}
            </div>
          </div>

          {/* Preview Table */}
          <LiyonCard className="overflow-hidden p-0 border">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 text-muted-foreground border-b uppercase font-medium">
                  <tr>
                    <th className="px-4 py-3 w-12 text-center">#</th>
                    <th className="px-4 py-3">อีเมล (Email)</th>
                    <th className="px-4 py-3">ชื่อที่แสดง (Name)</th>
                    <th className="px-4 py-3">บทบาทที่จะได้รับ (Role)</th>
                    <th className="px-4 py-3">สถานะ</th>
                    <th className="px-4 py-3 text-right">
                      {t("users.colPreviewStatus")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPreviewItems.map((item, idx) => {
                    let statusLabel = t("users.statusValid");
                    let statusTone: "ok" | "warn" | "bad" = "ok";

                    if (!item.isValid) {
                      if (item.error === "duplicate_in_file") {
                        statusLabel = t("users.statusDuplicateFile");
                        statusTone = "bad";
                      } else if (item.error === "email_already_exists") {
                        statusLabel = t("users.statusDuplicateDb");
                        statusTone = "warn";
                      } else if (item.error === "role_not_found") {
                        statusLabel = t("users.statusRoleNotFound");
                        statusTone = "bad";
                      } else {
                        statusLabel = t("users.statusInvalid");
                        statusTone = "bad";
                      }
                    }

                    return (
                      <tr
                        key={idx}
                        className={`hover:bg-muted/30 transition-colors ${
                          !item.isValid ? "bg-rose-50/20" : ""
                        }`}
                      >
                        <td className="px-4 py-2.5 text-center text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-foreground">
                          {item.email}
                        </td>
                        <td className="px-4 py-2.5">{item.name}</td>
                        <td className="px-4 py-2.5">
                          {item.resolvedRoleName ? (
                            <span className="font-medium text-primary">
                              {item.resolvedRoleName}
                            </span>
                          ) : (
                            <span className="text-rose-500 italic">
                              {item.roleCode || "ไม่ระบุ"}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-muted-foreground">
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <StatusPill tone={statusTone}>{statusLabel}</StatusPill>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredPreviewItems.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-muted-foreground"
                      >
                        ไม่พบรายการข้อมูลในตัวกรองนี้
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </LiyonCard>
        </div>
      )}

      {/* STEP 3: Results Screen */}
      {step === 3 && importSummary && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <LiyonCard className="p-5 border-l-4 border-l-primary flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  รายการทั้งหมด
                </p>
                <p className="text-2xl font-bold">{importSummary.total}</p>
              </div>
            </LiyonCard>

            <LiyonCard className="p-5 border-l-4 border-l-emerald-600 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  นำเข้าสำเร็จ
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  {importSummary.importedCount}
                </p>
              </div>
            </LiyonCard>

            <LiyonCard className="p-5 border-l-4 border-l-rose-500 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  ข้าม / ไม่สำเร็จ
                </p>
                <p className="text-2xl font-bold text-rose-600">
                  {importSummary.failedCount}
                </p>
              </div>
            </LiyonCard>
          </div>

          {/* Action options after import */}
          <LiyonCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/20">
            <div className="text-xs text-muted-foreground">
              นำเข้าผู้ใช้เสร็จสิ้นแล้ว สามารถดาวน์โหลดไฟล์สรุปลิงก์ตั้งรหัสผ่านสำหรับส่งให้นิสิต/บุคลากรได้
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadSetupLinks}
              >
                <Download className="h-4 w-4 mr-1.5 text-emerald-600" />
                {t("users.downloadLinksCsv")}
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={() => router.push("/users")}
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                {t("users.backToUsers")}
              </Button>
            </div>
          </LiyonCard>

          {/* Results Table */}
          <LiyonCard className="overflow-hidden p-0 border">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 text-muted-foreground border-b uppercase font-medium">
                  <tr>
                    <th className="px-4 py-3 w-12 text-center">#</th>
                    <th className="px-4 py-3">อีเมล</th>
                    <th className="px-4 py-3">ชื่อ</th>
                    <th className="px-4 py-3">บทบาท</th>
                    <th className="px-4 py-3">ผลการนำเข้า</th>
                    <th className="px-4 py-3">การส่งอีเมล</th>
                    <th className="px-4 py-3 text-right">ลิงก์ตั้งรหัสผ่าน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {importSummary.results.map((res, idx) => (
                    <tr key={idx} className="hover:bg-muted/30">
                      <td className="px-4 py-2.5 text-center text-muted-foreground">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-2.5 font-medium">{res.email}</td>
                      <td className="px-4 py-2.5">{res.name}</td>
                      <td className="px-4 py-2.5">{res.roleCode || "-"}</td>
                      <td className="px-4 py-2.5">
                        {res.status === "success" ? (
                          <StatusPill tone="ok">สำเร็จ</StatusPill>
                        ) : (
                          <StatusPill tone="bad">
                            {res.error || "ไม่สำเร็จ"}
                          </StatusPill>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        {res.mailDelivered ? (
                          <span className="text-emerald-600 font-medium">
                            ส่งแล้ว
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            ไม่ได้ส่ง
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-[11px]">
                        {res.link ? (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(res.link!);
                              toast.success("คัดลอกลิงก์แล้ว");
                            }}
                            className="text-primary hover:underline"
                          >
                            คัดลอกลิงก์
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LiyonCard>
        </div>
      )}
    </div>
  );
}
