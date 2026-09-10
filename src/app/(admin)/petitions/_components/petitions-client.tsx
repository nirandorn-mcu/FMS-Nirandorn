"use client";

import { useState, useTransition, useMemo } from "react";
import {
  Plus,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  GraduationCap,
  Ban,
  Check,
  Building2,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import { formatDate } from "@/shared/lib/format";
import {
  LiyonCard,
  DataTable,
  StatusPill,
  LiyonDialog,
  LiyonDialogHeader,
  LiyonDialogBody,
  LiyonDialogFooter,
  LiyonDialogCloseButton,
  LiyonField,
  LiyonSelect,
  RowMenuItem,
  type DataTableColumn,
  type StatusPillTone,
} from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import type {
  StudentPetitionDto,
  PetitionStatsDto,
} from "@/features/student-petition";
import {
  getPetitionsAction,
  getPetitionStatsAction,
  createPetitionAction,
  reviewByAdvisorAction,
  reviewByOfficerAction,
  reviewByDeanAction,
  rejectPetitionAction,
  cancelPetitionAction,
} from "@/features/student-petition/actions";

interface Props {
  initialPetitions: StudentPetitionDto[];
  initialStats: PetitionStatsDto;
  currentUserId: string;
  currentUserEmail: string;
  currentUserName: string;
  canCreate: boolean;
  canAdvisor: boolean;
  canOfficer: boolean;
  canDean: boolean;
  canManage: boolean;
}

export function PetitionsClient({
  initialPetitions,
  initialStats,
  currentUserId,
  currentUserEmail,
  currentUserName,
  canCreate,
  canAdvisor,
  canOfficer,
  canDean,
  canManage,
}: Props) {
  const t = useT();
  const locale = useLocale();
  const [petitions, setPetitions] = useState<StudentPetitionDto[]>(initialPetitions);
  const [stats, setStats] = useState<PetitionStatsDto>(initialStats);
  const [isPending, startTransition] = useTransition();

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<StudentPetitionDto | null>(null);
  const [rejectItem, setRejectItem] = useState<StudentPetitionDto | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [reviewActionItem, setReviewActionItem] = useState<{
    item: StudentPetitionDto;
    type: "advisor" | "officer" | "dean";
  } | null>(null);
  const [reviewComment, setReviewComment] = useState("");

  // Create Form State
  const [studentCode, setStudentCode] = useState("");
  const [studentName, setStudentName] = useState(currentUserName || "");
  const [studentEmail, setStudentEmail] = useState(currentUserEmail || "");
  const [major, setMajor] = useState("");
  const [yearLevel, setYearLevel] = useState<number>(1);
  const [petitionType, setPetitionType] = useState<
    "LATE_ENROLL" | "LEAVE" | "RESIGN" | "TUITION_WAIVER" | "COURSE_ADD_DROP" | "GENERAL"
  >("LATE_ENROLL");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");

  const refreshData = async () => {
    const [resP, resS] = await Promise.all([
      getPetitionsAction(),
      getPetitionStatsAction(),
    ]);
    if (resP.ok) setPetitions(resP.data);
    if (resS.ok) setStats(resS.data);
  };

  const openCreateDialog = () => {
    setStudentCode("");
    setStudentName(currentUserName || "");
    setStudentEmail(currentUserEmail || "");
    setMajor("");
    setYearLevel(1);
    setPetitionType("LATE_ENROLL");
    setTitle("");
    setDetails("");
    setEvidenceUrl("");
    setCreateOpen(true);
  };

  const handleCreateSubmit = () => {
    if (!studentCode.trim() || !studentName.trim() || !studentEmail.trim() || !title.trim() || !details.trim()) {
      toast.error(t("error.validation"));
      return;
    }

    startTransition(async () => {
      const res = await createPetitionAction({
        studentCode: studentCode.trim(),
        studentName: studentName.trim(),
        studentEmail: studentEmail.trim(),
        major: major.trim() || "วิทยาการคอมพิวเตอร์",
        yearLevel,
        petitionType,
        title: title.trim(),
        details: details.trim(),
        evidenceUrls: evidenceUrl.trim() ? [evidenceUrl.trim()] : [],
      });

      if (res.ok) {
        toast.success(t("petition.createSuccess"));
        setCreateOpen(false);
        await refreshData();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const handleReviewSubmit = () => {
    if (!reviewActionItem) return;
    const { item, type } = reviewActionItem;

    startTransition(async () => {
      let res;
      if (type === "advisor") {
        res = await reviewByAdvisorAction({ id: item.id, comment: reviewComment.trim() || undefined });
      } else if (type === "officer") {
        res = await reviewByOfficerAction({ id: item.id, comment: reviewComment.trim() || undefined });
      } else {
        res = await reviewByDeanAction({ id: item.id, comment: reviewComment.trim() || undefined });
      }

      if (res.ok) {
        toast.success(
          type === "advisor"
            ? t("petition.advisorSuccess")
            : type === "officer"
            ? t("petition.officerSuccess")
            : t("petition.deanSuccess")
        );
        setReviewActionItem(null);
        setReviewComment("");
        await refreshData();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const handleRejectSubmit = () => {
    if (!rejectItem || !rejectReason.trim()) return;
    startTransition(async () => {
      const res = await rejectPetitionAction({
        id: rejectItem.id,
        reason: rejectReason.trim(),
      });
      if (res.ok) {
        toast.success(t("petition.rejectSuccess"));
        setRejectItem(null);
        setRejectReason("");
        await refreshData();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const handleCancel = (p: StudentPetitionDto) => {
    startTransition(async () => {
      const res = await cancelPetitionAction({ id: p.id });
      if (res.ok) {
        toast.success(t("petition.cancelSuccess"));
        await refreshData();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const filteredPetitions = useMemo(() => {
    if (statusFilter === "ALL") return petitions;
    return petitions.filter((p) => p.status === statusFilter);
  }, [petitions, statusFilter]);

  const getStatusTone = (status: string): StatusPillTone => {
    switch (status) {
      case "SUBMITTED":
        return "info";
      case "ADVISOR_APPROVED":
      case "OFFICER_APPROVED":
        return "warn";
      case "DEAN_APPROVED":
        return "ok";
      case "REJECTED":
        return "bad";
      case "CANCELLED":
        return "off";
      default:
        return "off";
    }
  };

  const columns: DataTableColumn<StudentPetitionDto>[] = [
    {
      key: "ticketNo",
      header: t("petition.ticketNo"),
      render: (row) => <span className="font-mono text-xs font-semibold text-primary">{row.ticketNo}</span>,
    },
    {
      key: "type",
      header: t("petition.type"),
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {t(`petition.type.${row.petitionType}`)}
        </span>
      ),
    },
    {
      key: "student",
      header: t("petition.studentName"),
      render: (row) => (
        <div>
          <span className="font-medium text-foreground block">{row.studentName}</span>
          <span className="text-xs text-muted-foreground font-mono">{row.studentCode} ({row.major})</span>
        </div>
      ),
    },
    {
      key: "title",
      header: t("petition.titleField"),
      render: (row) => <span className="text-sm font-medium text-foreground">{row.title}</span>,
    },
    {
      key: "submittedAt",
      header: t("petition.submittedAt"),
      className: "nowrap text-xs text-muted-foreground",
      render: (row) => <span>{formatDate(new Date(row.createdAt), locale)}</span>,
    },
    {
      key: "status",
      header: t("petition.status.all"),
      render: (row) => (
        <StatusPill tone={getStatusTone(row.status)}>
          {t(`petition.status.${row.status}`)}
        </StatusPill>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("petition.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("petition.subtitle")}</p>
        </div>
        {canCreate && (
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("petition.create")}
          </Button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="rounded-xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{t("petition.kpi.total")}</p>
            <p className="text-2xl font-bold mt-1 text-foreground">{stats.totalCount}</p>
          </div>
          <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{t("petition.kpi.pendingAdvisor")}</p>
            <p className="text-2xl font-bold mt-1 text-blue-600">{stats.pendingAdvisorCount}</p>
          </div>
          <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-lg">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{t("petition.kpi.pendingOfficer")}</p>
            <p className="text-2xl font-bold mt-1 text-amber-600">{stats.pendingOfficerCount}</p>
          </div>
          <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-lg">
            <Building2 className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{t("petition.kpi.pendingDean")}</p>
            <p className="text-2xl font-bold mt-1 text-purple-600">{stats.pendingDeanCount}</p>
          </div>
          <div className="p-2.5 bg-purple-500/10 text-purple-600 rounded-lg">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{t("petition.kpi.completed")}</p>
            <p className="text-2xl font-bold mt-1 text-emerald-600">{stats.completedCount}</p>
          </div>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-lg">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <LiyonCard>
        <div className="p-4 border-b flex flex-wrap gap-2">
          {["ALL", "SUBMITTED", "ADVISOR_APPROVED", "OFFICER_APPROVED", "DEAN_APPROVED", "REJECTED", "CANCELLED"].map(
            (statusKey) => (
              <button
                key={statusKey}
                type="button"
                onClick={() => setStatusFilter(statusKey)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === statusKey
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {statusKey === "ALL" ? t("petition.status.all") : t(`petition.status.${statusKey}`)}
              </button>
            ),
          )}
        </div>

        <DataTable<StudentPetitionDto>
          state={filteredPetitions.length === 0 ? "empty" : "data"}
          headHeading={t("petition.title")}
          rows={filteredPetitions}
          columns={columns}
          getRowId={(row) => row.id}
          renderRowMenu={(row) => {
            const isOwner = row.studentId === currentUserId;
            return (
              <>
                <RowMenuItem onSelect={() => setDetailItem(row)} icon={<FileText className="h-4 w-4" />}>
                  {t("petition.action.viewDetail")}
                </RowMenuItem>

                {/* Advisor step */}
                {canAdvisor && row.status === "SUBMITTED" && (
                  <>
                    <RowMenuItem
                      onSelect={() => {
                        setReviewActionItem({ item: row, type: "advisor" });
                        setReviewComment("");
                      }}
                      icon={<CheckCircle2 className="h-4 w-4 text-blue-600" />}
                    >
                      {t("petition.action.advisorApprove")}
                    </RowMenuItem>
                    <RowMenuItem
                      onSelect={() => {
                        setRejectItem(row);
                        setRejectReason("");
                      }}
                      danger
                      icon={<XCircle className="h-4 w-4" />}
                    >
                      {t("petition.action.reject")}
                    </RowMenuItem>
                  </>
                )}

                {/* Officer step */}
                {canOfficer && row.status === "ADVISOR_APPROVED" && (
                  <>
                    <RowMenuItem
                      onSelect={() => {
                        setReviewActionItem({ item: row, type: "officer" });
                        setReviewComment("");
                      }}
                      icon={<CheckCircle2 className="h-4 w-4 text-amber-600" />}
                    >
                      {t("petition.action.officerApprove")}
                    </RowMenuItem>
                    <RowMenuItem
                      onSelect={() => {
                        setRejectItem(row);
                        setRejectReason("");
                      }}
                      danger
                      icon={<XCircle className="h-4 w-4" />}
                    >
                      {t("petition.action.reject")}
                    </RowMenuItem>
                  </>
                )}

                {/* Dean step */}
                {canDean && row.status === "OFFICER_APPROVED" && (
                  <>
                    <RowMenuItem
                      onSelect={() => {
                        setReviewActionItem({ item: row, type: "dean" });
                        setReviewComment("");
                      }}
                      icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                    >
                      {t("petition.action.deanApprove")}
                    </RowMenuItem>
                    <RowMenuItem
                      onSelect={() => {
                        setRejectItem(row);
                        setRejectReason("");
                      }}
                      danger
                      icon={<XCircle className="h-4 w-4" />}
                    >
                      {t("petition.action.reject")}
                    </RowMenuItem>
                  </>
                )}

                {/* Student Cancel */}
                {(isOwner || canManage) && row.status === "SUBMITTED" && (
                  <RowMenuItem onSelect={() => handleCancel(row)} danger icon={<Ban className="h-4 w-4" />}>
                    {t("petition.action.cancel")}
                  </RowMenuItem>
                )}
              </>
            );
          }}
          empty={{
            icon: <GraduationCap className="h-10 w-10 text-muted-foreground/50" />,
            title: t("petition.empty"),
            description: t("petition.emptyDesc"),
          }}
          error={{
            icon: <AlertTriangle className="h-10 w-10 text-destructive" />,
            title: t("common.error"),
          }}
        />
      </LiyonCard>

      {/* Dialog 1: ยื่นคำร้องใหม่ */}
      <LiyonDialog open={createOpen} onOpenChange={setCreateOpen} wide>
        <LiyonDialogCloseButton label={t("common.close")} />
        <LiyonDialogHeader
          title={t("petition.create")}
          description={t("petition.subtitle")}
        />
        <LiyonDialogBody>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LiyonField label={t("petition.studentCode")} htmlFor="stu-code">
                <input
                  id="stu-code"
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  placeholder="เช่น 66010001"
                  required
                />
              </LiyonField>

              <LiyonField label={t("petition.studentName")} htmlFor="stu-name">
                <input
                  id="stu-name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="ชื่อ-นามสกุล"
                  required
                />
              </LiyonField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <LiyonField label={t("petition.studentEmail")} htmlFor="stu-email">
                <input
                  id="stu-email"
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="name@student.ac.th"
                  required
                />
              </LiyonField>

              <LiyonField label={t("petition.major")} htmlFor="stu-major">
                <input
                  id="stu-major"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="เช่น วิทยาการคอมพิวเตอร์"
                  required
                />
              </LiyonField>

              <LiyonField label={t("petition.yearLevel")} htmlFor="stu-year">
                <LiyonSelect
                  id="stu-year"
                  value={yearLevel.toString()}
                  onChange={(e) => setYearLevel(parseInt(e.target.value, 10))}
                >
                  <option value="1">ชั้นปีที่ 1</option>
                  <option value="2">ชั้นปีที่ 2</option>
                  <option value="3">ชั้นปีที่ 3</option>
                  <option value="4">ชั้นปีที่ 4</option>
                  <option value="5">ชั้นปีที่ 5 ขึ้นไป</option>
                </LiyonSelect>
              </LiyonField>
            </div>

            <LiyonField label={t("petition.type")} htmlFor="pet-type">
              <LiyonSelect
                id="pet-type"
                value={petitionType}
                onChange={(e) => setPetitionType(e.target.value as typeof petitionType)}
              >
                <option value="LATE_ENROLL">{t("petition.type.LATE_ENROLL")}</option>
                <option value="COURSE_ADD_DROP">{t("petition.type.COURSE_ADD_DROP")}</option>
                <option value="LEAVE">{t("petition.type.LEAVE")}</option>
                <option value="TUITION_WAIVER">{t("petition.type.TUITION_WAIVER")}</option>
                <option value="RESIGN">{t("petition.type.RESIGN")}</option>
                <option value="GENERAL">{t("petition.type.GENERAL")}</option>
              </LiyonSelect>
            </LiyonField>

            <LiyonField label={t("petition.titleField")} htmlFor="pet-title">
              <input
                id="pet-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ระบุหัวข้อคำร้อง..."
                required
              />
            </LiyonField>

            <LiyonField label={t("petition.detailsField")} htmlFor="pet-details">
              <textarea
                id="pet-details"
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="อธิบายเหตุผลความจำเป็นและรายละเอียดของคำร้อง..."
                required
              />
            </LiyonField>

            <LiyonField label={t("petition.evidenceUrl")} htmlFor="pet-evidence">
              <input
                id="pet-evidence"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://drive.google.com/... หรือ ลิงก์ไฟล์เอกสารแนบ"
              />
            </LiyonField>
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={isPending}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleCreateSubmit} disabled={isPending}>
            {t("petition.create")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Dialog 2: รายละเอียดคำร้อง + Visual Stepper & Audit Log */}
      {detailItem && (
        <LiyonDialog open={!!detailItem} onOpenChange={(open) => !open && setDetailItem(null)} wide>
          <LiyonDialogCloseButton label={t("common.close")} />
          <LiyonDialogHeader
            title={`${t("petition.ticketNo")}: ${detailItem.ticketNo}`}
            description={t(`petition.type.${detailItem.petitionType}`)}
          />
          <LiyonDialogBody>
            <div className="space-y-5 py-2 text-sm">
              {/* Stepper Progress */}
              <div className="border rounded-xl p-4 bg-muted/20">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className={`flex flex-col items-center gap-1.5 ${detailItem.status !== "CANCELLED" ? "text-primary font-bold" : "text-muted-foreground"}`}>
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] leading-tight">{t("petition.step.submitted")}</span>
                  </div>

                  <div className={`flex flex-col items-center gap-1.5 ${detailItem.status === "ADVISOR_APPROVED" || detailItem.status === "OFFICER_APPROVED" || detailItem.status === "DEAN_APPROVED" ? "text-primary font-bold" : "text-muted-foreground"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${detailItem.status === "ADVISOR_APPROVED" || detailItem.status === "OFFICER_APPROVED" || detailItem.status === "DEAN_APPROVED" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      2
                    </div>
                    <span className="text-[11px] leading-tight">{t("petition.step.advisor")}</span>
                  </div>

                  <div className={`flex flex-col items-center gap-1.5 ${detailItem.status === "OFFICER_APPROVED" || detailItem.status === "DEAN_APPROVED" ? "text-primary font-bold" : "text-muted-foreground"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${detailItem.status === "OFFICER_APPROVED" || detailItem.status === "DEAN_APPROVED" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      3
                    </div>
                    <span className="text-[11px] leading-tight">{t("petition.step.officer")}</span>
                  </div>

                  <div className={`flex flex-col items-center gap-1.5 ${detailItem.status === "DEAN_APPROVED" ? "text-emerald-600 font-bold" : "text-muted-foreground"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${detailItem.status === "DEAN_APPROVED" ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"}`}>
                      4
                    </div>
                    <span className="text-[11px] leading-tight">{t("petition.step.dean")}</span>
                  </div>
                </div>
              </div>

              {/* Student Info Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-muted/40 rounded-lg text-xs">
                <div>
                  <span className="text-muted-foreground">{t("petition.studentName")}:</span>
                  <p className="font-semibold text-foreground">{detailItem.studentName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("petition.studentCode")}:</span>
                  <p className="font-semibold text-foreground font-mono">{detailItem.studentCode}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("petition.major")}:</span>
                  <p className="font-semibold text-foreground">{detailItem.major} (ปี {detailItem.yearLevel})</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("petition.submittedAt")}:</span>
                  <p className="font-semibold text-foreground">{formatDate(new Date(detailItem.createdAt), locale)}</p>
                </div>
              </div>

              {/* Petition Content */}
              <div className="p-4 border rounded-lg space-y-2">
                <h4 className="font-semibold text-foreground">{detailItem.title}</h4>
                <p className="text-muted-foreground whitespace-pre-wrap text-xs leading-relaxed">{detailItem.details}</p>

                {detailItem.evidenceUrls.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-medium text-foreground block mb-1">{t("petition.evidenceUrl")}:</span>
                    {detailItem.evidenceUrls.map((url, idx) => (
                      <a key={idx} href={url} target="_blank" rel="noreferrer" className="text-xs text-primary underline block">
                        {url}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Review Comments */}
              <div className="space-y-2">
                {detailItem.advisorComment && (
                  <div className="p-3 border-l-4 border-blue-500 bg-blue-50/40 rounded-r text-xs">
                    <span className="font-bold text-blue-900 block">• ความเห็นอาจารย์ที่ปรึกษา ({detailItem.advisorName}):</span>
                    <p className="text-blue-950 mt-0.5">{detailItem.advisorComment}</p>
                  </div>
                )}

                {detailItem.officerComment && (
                  <div className="p-3 border-l-4 border-amber-500 bg-amber-50/40 rounded-r text-xs">
                    <span className="font-bold text-amber-900 block">• ความเห็นฝ่ายทะเบียน ({detailItem.officerName}):</span>
                    <p className="text-amber-950 mt-0.5">{detailItem.officerComment}</p>
                  </div>
                )}

                {detailItem.deanComment && (
                  <div className="p-3 border-l-4 border-purple-500 bg-purple-50/40 rounded-r text-xs">
                    <span className="font-bold text-purple-900 block">• ความเห็นคณบดี ({detailItem.deanName}):</span>
                    <p className="text-purple-950 mt-0.5">{detailItem.deanComment}</p>
                  </div>
                )}

                {detailItem.rejectionReason && (
                  <div className="p-3 border-l-4 border-destructive bg-destructive/10 rounded-r text-xs">
                    <span className="font-bold text-destructive block">• เหตุผลที่ไม่อนุมัติ / ตีกลับ:</span>
                    <p className="text-destructive mt-0.5">{detailItem.rejectionReason}</p>
                  </div>
                )}
              </div>

              {/* History Logs */}
              <div className="border-t pt-3">
                <h5 className="font-semibold text-xs text-muted-foreground mb-2">{t("petition.history.title")}</h5>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {detailItem.logs.map((log) => (
                    <div key={log.id} className="flex justify-between items-center py-1 border-b border-muted/50 last:border-0">
                      <div>
                        <span className="font-medium text-foreground">{log.actorName}:</span> {log.comment}
                      </div>
                      <span className="font-mono text-[11px]">{formatDate(new Date(log.createdAt), locale)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </LiyonDialogBody>
          <LiyonDialogFooter>
            <Button variant="outline" onClick={() => setDetailItem(null)}>
              {t("common.close")}
            </Button>
          </LiyonDialogFooter>
        </LiyonDialog>
      )}

      {/* Dialog 3: ให้ความเห็นชอบ / ตรวจสอบ / อนุมัติ (Review Dialog) */}
      {reviewActionItem && (
        <LiyonDialog open={!!reviewActionItem} onOpenChange={(open) => !open && setReviewActionItem(null)}>
          <LiyonDialogCloseButton label={t("common.close")} />
          <LiyonDialogHeader
            title={
              reviewActionItem.type === "advisor"
                ? t("petition.action.advisorApprove")
                : reviewActionItem.type === "officer"
                ? t("petition.action.officerApprove")
                : t("petition.action.deanApprove")
            }
            description={`${t("petition.ticketNo")}: ${reviewActionItem.item.ticketNo} - ${reviewActionItem.item.title}`}
          />
          <LiyonDialogBody>
            <div className="py-2">
              <LiyonField label={t("petition.comment")} htmlFor="rev-comment">
                <textarea
                  id="rev-comment"
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={t("petition.commentPh")}
                />
              </LiyonField>
            </div>
          </LiyonDialogBody>
          <LiyonDialogFooter>
            <Button variant="outline" onClick={() => setReviewActionItem(null)} disabled={isPending}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleReviewSubmit} disabled={isPending}>
              {t("common.save")}
            </Button>
          </LiyonDialogFooter>
        </LiyonDialog>
      )}

      {/* Dialog 4: ไม่อนุมัติ / ตีกลับ */}
      {rejectItem && (
        <LiyonDialog open={!!rejectItem} onOpenChange={(open) => !open && setRejectItem(null)} danger>
          <LiyonDialogCloseButton label={t("common.close")} />
          <LiyonDialogHeader
            title={t("petition.action.reject")}
            description={`${t("petition.ticketNo")}: ${rejectItem.ticketNo}`}
          />
          <LiyonDialogBody>
            <div className="py-2">
              <LiyonField label={t("petition.rejectReason")} htmlFor="pet-reject">
                <textarea
                  id="pet-reject"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder={t("petition.rejectReasonPh")}
                  required
                />
              </LiyonField>
            </div>
          </LiyonDialogBody>
          <LiyonDialogFooter>
            <Button variant="outline" onClick={() => setRejectItem(null)} disabled={isPending}>
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleRejectSubmit} disabled={isPending || !rejectReason.trim()}>
              {t("petition.action.reject")}
            </Button>
          </LiyonDialogFooter>
        </LiyonDialog>
      )}
    </div>
  );
}
