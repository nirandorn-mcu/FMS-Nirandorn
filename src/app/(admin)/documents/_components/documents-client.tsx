"use client";

import { useState, useTransition, useMemo } from "react";
import {
  Plus,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  Tag,
  Trash2,
  AlertTriangle,
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
  DocumentDto,
  DocumentStatsDto,
} from "@/features/document-flow";
import {
  getDocumentsAction,
  getDocumentStatsAction,
  createDocumentAction,
  submitDocumentAction,
  approveStepAction,
  rejectStepAction,
  addDocumentCommentAction,
} from "@/features/document-flow/actions";

interface Props {
  initialDocuments: DocumentDto[];
  initialStats: DocumentStatsDto;
  currentUserId: string;
  canCreate: boolean;
  canApprove: boolean;
  canManage: boolean;
}

interface WorkflowStepInput {
  id: string;
  approverRole: string;
}

export function DocumentsClient({
  initialDocuments,
  initialStats,
  canCreate,
  canApprove,
}: Props) {
  const t = useT();
  const locale = useLocale();
  const [documents, setDocuments] = useState<DocumentDto[]>(initialDocuments);
  const [stats, setStats] = useState<DocumentStatsDto>(initialStats);
  const [isPending, startTransition] = useTransition();

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<DocumentDto | null>(null);
  const [approveStepItem, setApproveStepItem] = useState<{ docId: string; stepId: string; stepNo: number; role: string } | null>(null);
  const [rejectStepItem, setRejectStepItem] = useState<{ docId: string; stepId: string; stepNo: number; role: string } | null>(null);

  // Form states
  const [docNo, setDocNo] = useState("");
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState<"MEMO" | "ANNOUNCEMENT" | "ORDER" | "PETITION" | "CONTRACT" | "REPORT" | "OTHER">("MEMO");
  const [urgency, setUrgency] = useState<"NORMAL" | "URGENT" | "VERY_URGENT" | "MOST_URGENT">("NORMAL");
  const [confidentiality, setConfidentiality] = useState<"NORMAL" | "CONFIDENTIAL" | "VERY_CONFIDENTIAL" | "TOP_SECRET">("NORMAL");
  const [content, setContent] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStepInput[]>([
    { id: "1", approverRole: "หัวหน้าภาควิชา / หัวหน้างาน" },
    { id: "2", approverRole: "รองคณบดีฝ่ายบริหารและวิชาการ" },
    { id: "3", approverRole: "คณบดีคณะวิทยาการจัดการ" },
  ]);

  // Approval / Comment form states
  const [approveComment, setApproveComment] = useState("");
  const [rejectComment, setRejectComment] = useState("");
  const [newComment, setNewComment] = useState("");

  const refreshData = () => {
    startTransition(async () => {
      const [docsRes, statsRes] = await Promise.all([
        getDocumentsAction(),
        getDocumentStatsAction(),
      ]);
      if (docsRes.ok) setDocuments(docsRes.data);
      if (statsRes.ok) setStats(statsRes.data);

      if (detailItem && docsRes.ok) {
        const updated = docsRes.data.find((d) => d.id === detailItem.id);
        if (updated) setDetailItem(updated);
      }
    });
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNo.trim() || !title.trim()) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (workflowSteps.length === 0) {
      toast.error("ต้องมีขั้นตอนการพิจารณาอย่างน้อย 1 ขั้นตอน");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    startTransition(async () => {
      const res = await createDocumentAction({
        docNo,
        title,
        docType,
        urgency,
        confidentiality,
        content: content.trim() || null,
        attachmentUrl: attachmentUrl.trim() || null,
        tags,
        workflowSteps: workflowSteps.map((s, idx) => ({
          stepNumber: idx + 1,
          approverRole: s.approverRole,
        })),
      });

      if (!res.ok) {
        toast.error(res.error.message || "ไม่สามารถสร้างเอกสารได้");
        return;
      }

      toast.success(t("doc.createSuccess"));
      setCreateOpen(false);
      resetCreateForm();
      refreshData();
    });
  };

  const handleSubmitDocument = (id: string) => {
    startTransition(async () => {
      const res = await submitDocumentAction({ id });
      if (!res.ok) {
        toast.error(res.error.message || "ไม่สามารถส่งเอกสารได้");
        return;
      }
      toast.success(t("doc.submitSuccess"));
      refreshData();
    });
  };

  const handleApproveStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approveStepItem) return;

    startTransition(async () => {
      const res = await approveStepAction({
        stepId: approveStepItem.stepId,
        comment: approveComment.trim() || null,
        signatureUrl: "DIGITAL_VERIFIED_SIGNATURE",
      });

      if (!res.ok) {
        toast.error(res.error.message || "ไม่สามารถอนุมัติได้");
        return;
      }

      toast.success(t("doc.approveSuccess"));
      setApproveStepItem(null);
      setApproveComment("");
      refreshData();
    });
  };

  const handleRejectStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectStepItem) return;
    if (!rejectComment.trim()) {
      toast.error("กรุณาระบุเหตุผลการส่งกลับ");
      return;
    }

    startTransition(async () => {
      const res = await rejectStepAction({
        stepId: rejectStepItem.stepId,
        comment: rejectComment.trim(),
      });

      if (!res.ok) {
        toast.error(res.error.message || "ไม่สามารถส่งกลับเอกสารได้");
        return;
      }

      toast.success(t("doc.rejectSuccess"));
      setRejectStepItem(null);
      setRejectComment("");
      refreshData();
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailItem || !newComment.trim()) return;

    startTransition(async () => {
      const res = await addDocumentCommentAction({
        documentId: detailItem.id,
        comment: newComment.trim(),
      });

      if (!res.ok) {
        toast.error(res.error.message || "ไม่สามารถเพิ่มความคิดเห็นได้");
        return;
      }

      toast.success(t("doc.commentSuccess"));
      setNewComment("");
      refreshData();
    });
  };

  const resetCreateForm = () => {
    setDocNo(`ศธ 0514.1/${Math.floor(100 + Math.random() * 900)}`);
    setTitle("");
    setDocType("MEMO");
    setUrgency("NORMAL");
    setConfidentiality("NORMAL");
    setContent("");
    setAttachmentUrl("");
    setTagsInput("");
    setWorkflowSteps([
      { id: "1", approverRole: "หัวหน้าภาควิชา / หัวหน้างาน" },
      { id: "2", approverRole: "รองคณบดีฝ่ายบริหารและวิชาการ" },
      { id: "3", approverRole: "คณบดีคณะวิทยาการจัดการ" },
    ]);
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter((d) => {
      if (statusFilter !== "ALL" && d.status !== statusFilter) return false;
      if (typeFilter !== "ALL" && d.docType !== typeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          d.docNo.toLowerCase().includes(q) ||
          d.title.toLowerCase().includes(q) ||
          d.creatorName.toLowerCase().includes(q) ||
          d.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [documents, statusFilter, typeFilter, searchQuery]);

  const getStatusTone = (status: string): StatusPillTone => {
    switch (status) {
      case "APPROVED":
        return "ok";
      case "PENDING_APPROVAL":
        return "warn";
      case "REJECTED":
        return "bad";
      case "DRAFT":
      case "CANCELLED":
      default:
        return "off";
    }
  };

  const getUrgencyBadge = (u: string) => {
    switch (u) {
      case "MOST_URGENT":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-300">ด่วนที่สุด</span>;
      case "VERY_URGENT":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-300">ด่วนมาก</span>;
      case "URGENT":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">ด่วน</span>;
      default:
        return null;
    }
  };

  const columns: DataTableColumn<DocumentDto>[] = [
    {
      key: "docNo",
      header: t("doc.docNo"),
      render: (row: DocumentDto) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{row.docNo}</span>
          <span className="text-xs text-muted-foreground">{t(`doc.type.${row.docType}`)}</span>
        </div>
      ),
    },
    {
      key: "title",
      header: t("doc.titleField"),
      render: (row: DocumentDto) => (
        <div className="flex flex-col max-w-md">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground line-clamp-1">{row.title}</span>
            {getUrgencyBadge(row.urgency)}
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span>{row.creatorName}</span>
            <span>•</span>
            <span>{formatDate(row.createdAt, locale)}</span>
            {row.tags.length > 0 && (
              <div className="flex gap-1">
                {row.tags.slice(0, 2).map((tg: string, i: number) => (
                  <span key={i} className="inline-flex items-center px-1.5 py-0.5 bg-muted text-muted-foreground rounded text-[10px]">
                    #{tg}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "workflow",
      header: t("doc.currentStep"),
      render: (row: DocumentDto) => {
        const activeStep = row.workflowSteps.find((s) => s.stepNumber === row.currentStep);
        const progressPct = row.status === "APPROVED" ? 100 : Math.round(((row.currentStep - 1) / row.totalSteps) * 100);
        return (
          <div className="flex flex-col min-w-[160px]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-foreground">
                ขั้นที่ {row.currentStep}/{row.totalSteps}
              </span>
              <span className="text-muted-foreground">{progressPct}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  row.status === "APPROVED" ? "bg-emerald-500" : row.status === "REJECTED" ? "bg-red-500" : "bg-primary"
                }`}
                style={{ width: `${Math.max(5, progressPct)}%` }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground mt-1 truncate">
              {activeStep ? activeStep.approverRole : "เสร็จสิ้น"}
            </span>
          </div>
        );
      },
    },
    {
      key: "status",
      header: t("doc.status"),
      render: (row: DocumentDto) => (
        <StatusPill tone={getStatusTone(row.status)}>
          {t(`doc.status.${row.status}`)}
        </StatusPill>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{t("doc.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("doc.subtitle")}</p>
        </div>
        {canCreate && (
          <Button
            onClick={() => {
              resetCreateForm();
              setCreateOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>{t("doc.create")}</span>
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <LiyonCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">{t("doc.metric.total")}</div>
            <div className="text-2xl font-bold text-foreground">{stats.totalDocuments}</div>
          </div>
        </LiyonCard>

        <LiyonCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">{t("doc.metric.pending")}</div>
            <div className="text-2xl font-bold text-amber-600">{stats.pendingCount}</div>
          </div>
        </LiyonCard>

        <LiyonCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">{t("doc.metric.approved")}</div>
            <div className="text-2xl font-bold text-emerald-600">{stats.approvedCount}</div>
          </div>
        </LiyonCard>

        <LiyonCard className="p-4 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 text-red-600 rounded-xl">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">{t("doc.metric.rejected")}</div>
            <div className="text-2xl font-bold text-red-600">{stats.rejectedCount}</div>
          </div>
        </LiyonCard>
      </div>

      {/* Filter and Search Bar */}
      <LiyonCard className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="w-full sm:w-80">
            <input
              type="text"
              placeholder="ค้นหาเลขที่หนังสือ, ชื่อเรื่อง, ผู้เสนอ, ป้ายกำกับ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="w-44">
              <LiyonSelect
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="ALL">ทุกประเภทเอกสาร</option>
                <option value="MEMO">{t("doc.type.MEMO")}</option>
                <option value="ANNOUNCEMENT">{t("doc.type.ANNOUNCEMENT")}</option>
                <option value="ORDER">{t("doc.type.ORDER")}</option>
                <option value="PETITION">{t("doc.type.PETITION")}</option>
                <option value="CONTRACT">{t("doc.type.CONTRACT")}</option>
                <option value="REPORT">{t("doc.type.REPORT")}</option>
                <option value="OTHER">{t("doc.type.OTHER")}</option>
              </LiyonSelect>
            </div>

            <div className="w-44">
              <LiyonSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">{t("doc.status.all")}</option>
                <option value="DRAFT">{t("doc.status.DRAFT")}</option>
                <option value="PENDING_APPROVAL">{t("doc.status.PENDING_APPROVAL")}</option>
                <option value="APPROVED">{t("doc.status.APPROVED")}</option>
                <option value="REJECTED">{t("doc.status.REJECTED")}</option>
              </LiyonSelect>
            </div>
          </div>
        </div>
      </LiyonCard>

      {/* Main Table */}
      <LiyonCard className="overflow-hidden">
        <DataTable<DocumentDto>
          state={filteredDocuments.length === 0 ? "empty" : "data"}
          headHeading={t("doc.title")}
          rows={filteredDocuments}
          columns={columns}
          getRowId={(row) => row.id}
          renderRowMenu={(row) => {
            const isDraft = row.status === "DRAFT";
            const isPendingApproval = row.status === "PENDING_APPROVAL";
            const activeStep = row.workflowSteps.find((s) => s.stepNumber === row.currentStep);

            return (
              <>
                <RowMenuItem
                  onSelect={() => setDetailItem(row)}
                  icon={<FileText className="h-4 w-4" />}
                >
                  {t("doc.action.viewDetail")}
                </RowMenuItem>

                {isDraft && (
                  <RowMenuItem
                    onSelect={() => handleSubmitDocument(row.id)}
                    icon={<Send className="h-4 w-4 text-primary" />}
                  >
                    {t("doc.action.submit")}
                  </RowMenuItem>
                )}

                {isPendingApproval && canApprove && activeStep && (
                  <>
                    <RowMenuItem
                      onSelect={() =>
                        setApproveStepItem({
                          docId: row.id,
                          stepId: activeStep.id,
                          stepNo: row.currentStep,
                          role: activeStep.approverRole,
                        })
                      }
                      icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                    >
                      {t("doc.action.approve")}
                    </RowMenuItem>
                    <RowMenuItem
                      onSelect={() =>
                        setRejectStepItem({
                          docId: row.id,
                          stepId: activeStep.id,
                          stepNo: row.currentStep,
                          role: activeStep.approverRole,
                        })
                      }
                      icon={<XCircle className="h-4 w-4 text-destructive" />}
                    >
                      {t("doc.action.reject")}
                    </RowMenuItem>
                  </>
                )}
              </>
            );
          }}
          empty={{
            icon: <FileText className="h-10 w-10 text-muted-foreground/50" />,
            title: t("doc.empty"),
            description: t("doc.emptyDesc"),
          }}
          error={{
            icon: <AlertTriangle className="h-10 w-10 text-destructive" />,
            title: t("common.error"),
          }}
        />
      </LiyonCard>

      {/* Create Document Modal */}
      <LiyonDialog open={createOpen} onOpenChange={setCreateOpen} wide>
        <LiyonDialogCloseButton label={t("common.close")} />
        <LiyonDialogHeader title={t("doc.create")} description={t("doc.subtitle")} />
        <form onSubmit={handleCreateDocument}>
          <LiyonDialogBody>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LiyonField label={t("doc.docNo")} htmlFor="doc-no">
                  <input
                    id="doc-no"
                    type="text"
                    required
                    value={docNo}
                    onChange={(e) => setDocNo(e.target.value)}
                    placeholder="เช่น ศธ 0514.1/101"
                  />
                </LiyonField>

                <LiyonField label={t("doc.docType")} htmlFor="doc-type">
                  <LiyonSelect
                    id="doc-type"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as typeof docType)}
                  >
                    <option value="MEMO">{t("doc.type.MEMO")}</option>
                    <option value="ANNOUNCEMENT">{t("doc.type.ANNOUNCEMENT")}</option>
                    <option value="ORDER">{t("doc.type.ORDER")}</option>
                    <option value="PETITION">{t("doc.type.PETITION")}</option>
                    <option value="CONTRACT">{t("doc.type.CONTRACT")}</option>
                    <option value="REPORT">{t("doc.type.REPORT")}</option>
                    <option value="OTHER">{t("doc.type.OTHER")}</option>
                  </LiyonSelect>
                </LiyonField>
              </div>

              <LiyonField label={t("doc.titleField")} htmlFor="doc-title">
                <input
                  id="doc-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ระบุชื่อเรื่อง / หัวข้อบันทึกข้อความ"
                />
              </LiyonField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LiyonField label={t("doc.urgency")} htmlFor="doc-urgency">
                  <LiyonSelect
                    id="doc-urgency"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as typeof urgency)}
                  >
                    <option value="NORMAL">{t("doc.urgency.NORMAL")}</option>
                    <option value="URGENT">{t("doc.urgency.URGENT")}</option>
                    <option value="VERY_URGENT">{t("doc.urgency.VERY_URGENT")}</option>
                    <option value="MOST_URGENT">{t("doc.urgency.MOST_URGENT")}</option>
                  </LiyonSelect>
                </LiyonField>

                <LiyonField label={t("doc.confidentiality")} htmlFor="doc-confidentiality">
                  <LiyonSelect
                    id="doc-confidentiality"
                    value={confidentiality}
                    onChange={(e) => setConfidentiality(e.target.value as typeof confidentiality)}
                  >
                    <option value="NORMAL">{t("doc.confidentiality.NORMAL")}</option>
                    <option value="CONFIDENTIAL">{t("doc.confidentiality.CONFIDENTIAL")}</option>
                    <option value="VERY_CONFIDENTIAL">{t("doc.confidentiality.VERY_CONFIDENTIAL")}</option>
                    <option value="TOP_SECRET">{t("doc.confidentiality.TOP_SECRET")}</option>
                  </LiyonSelect>
                </LiyonField>
              </div>

              <LiyonField label={t("doc.content")} htmlFor="doc-content">
                <textarea
                  id="doc-content"
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="รายละเอียดบันทึกข้อความ หรือสาระสำคัญของการขออนุมัติ..."
                />
              </LiyonField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LiyonField label={t("doc.attachmentUrl")} htmlFor="doc-url">
                  <input
                    id="doc-url"
                    type="url"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                  />
                </LiyonField>

                <LiyonField label={t("doc.tags")} htmlFor="doc-tags">
                  <input
                    id="doc-tags"
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="เช่น งบประมาณ, สัมมนา (คั่นด้วยจุลภาค)"
                  />
                </LiyonField>
              </div>

              {/* Workflow Steps Builder */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground">
                    {t("doc.workflow.title")}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setWorkflowSteps([
                        ...workflowSteps,
                        { id: Date.now().toString(), approverRole: "" },
                      ])
                    }
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    เพิ่มขั้นตอน
                  </Button>
                </div>

                <div className="space-y-2">
                  {workflowSteps.map((step, idx) => (
                    <div key={step.id} className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="ระบุตำแหน่งผู้พิจารณา เช่น หัวหน้าภาควิชา, รองคณบดี..."
                        value={step.approverRole}
                        onChange={(e) => {
                          const updated = [...workflowSteps];
                          updated[idx].approverRole = e.target.value;
                          setWorkflowSteps(updated);
                        }}
                        className="flex-1 px-3 py-1.5 border rounded-md text-sm bg-background"
                      />
                      {workflowSteps.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setWorkflowSteps(workflowSteps.filter((_, i) => i !== idx))
                          }
                          className="text-destructive hover:text-destructive/80 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </LiyonDialogBody>

          <LiyonDialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary text-primary-foreground"
            >
              {isPending ? "กำลังบันทึก..." : t("doc.action.saveDraft")}
            </Button>
          </LiyonDialogFooter>
        </form>
      </LiyonDialog>

      {/* Detail & Timeline Modal */}
      {detailItem && (
        <LiyonDialog open={true} onOpenChange={(open) => !open && setDetailItem(null)} wide>
          <LiyonDialogCloseButton label={t("common.close")} />
          <LiyonDialogHeader
            title={detailItem.docNo}
            description={t(`doc.type.${detailItem.docType}`)}
          />

          <LiyonDialogBody>
            <div className="space-y-6 py-2">
              {/* Subject and Meta */}
              <div className="bg-muted/50 rounded-xl p-4 border">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-bold text-foreground">{detailItem.title}</h3>
                  <StatusPill tone={getStatusTone(detailItem.status)}>
                    {t(`doc.status.${detailItem.status}`)}
                  </StatusPill>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block">ผู้เสนอ:</span>
                    <span className="font-medium text-foreground">{detailItem.creatorName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">วันที่สร้าง:</span>
                    <span className="font-medium text-foreground">{formatDate(detailItem.createdAt, locale)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">ชั้นความเร็ว:</span>
                    <span className="font-medium text-foreground">{t(`doc.urgency.${detailItem.urgency}`)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">ชั้นความลับ:</span>
                    <span className="font-medium text-foreground">{t(`doc.confidentiality.${detailItem.confidentiality}`)}</span>
                  </div>
                </div>

                {detailItem.content && (
                  <div className="mt-4 pt-3 border-t text-sm text-foreground/90 whitespace-pre-wrap">
                    {detailItem.content}
                  </div>
                )}

                {detailItem.attachmentUrl && (
                  <div className="mt-3 pt-2 border-t flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-primary" />
                    <a
                      href={detailItem.attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      ดูไฟล์แนบ / เอกสารประกอบภายนอก
                    </a>
                  </div>
                )}

                {detailItem.tags.length > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                    {detailItem.tags.map((tg, i) => (
                      <span key={i} className="px-2 py-0.5 bg-background border text-foreground rounded-full text-xs">
                        #{tg}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Workflow Steps Timeline */}
              <div>
                <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  {t("doc.workflow.title")}
                </h4>

                <div className="space-y-3">
                  {detailItem.workflowSteps.map((step) => {
                    const isCurrent = detailItem.status === "PENDING_APPROVAL" && detailItem.currentStep === step.stepNumber;
                    const isApproved = step.status === "APPROVED";
                    const isRejected = step.status === "REJECTED";

                    return (
                      <div
                        key={step.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isCurrent
                            ? "bg-primary/5 border-primary/40 shadow-xs"
                            : isApproved
                            ? "bg-emerald-500/5 border-emerald-500/30"
                            : isRejected
                            ? "bg-destructive/5 border-destructive/30"
                            : "bg-card border"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                isApproved
                                  ? "bg-emerald-600 text-white"
                                  : isRejected
                                  ? "bg-destructive text-destructive-foreground"
                                  : isCurrent
                                  ? "bg-primary text-primary-foreground animate-pulse"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {step.stepNumber}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-foreground">
                                {step.approverRole}
                              </div>
                              {step.approverName && (
                                <div className="text-xs text-muted-foreground">
                                  ผู้ลงนาม: {step.approverName}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <StatusPill
                              tone={
                                isApproved
                                  ? "ok"
                                  : isRejected
                                  ? "bad"
                                  : isCurrent
                                  ? "warn"
                                  : "off"
                              }
                            >
                              {isCurrent
                                ? "รอการพิจารณาขณะนี้"
                                : t(`doc.workflow.${step.status}`)}
                            </StatusPill>
                          </div>
                        </div>

                        {step.comment && (
                          <div className="mt-2 text-xs bg-background p-2.5 rounded-lg border text-foreground/90 italic">
                            &ldquo;{step.comment}&rdquo;
                          </div>
                        )}

                        {step.actionAt && (
                          <div className="mt-1 text-[11px] text-muted-foreground text-right">
                            วันที่ลงนาม: {formatDate(step.actionAt, locale)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  {t("doc.comments.title")}
                </h4>

                <div className="space-y-2 mb-4">
                  {detailItem.comments.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">{t("doc.comments.empty")}</p>
                  ) : (
                    detailItem.comments.map((c) => (
                      <div key={c.id} className="bg-muted/40 p-3 rounded-lg text-xs">
                        <div className="flex items-center justify-between font-semibold text-foreground">
                          <span>{c.userName}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatDate(c.createdAt, locale)}
                          </span>
                        </div>
                        <p className="mt-1 text-foreground/90">{c.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t("doc.comments.placeholder")}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 px-3 py-1.5 border rounded-lg text-xs bg-background"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isPending || !newComment.trim()}
                    className="bg-primary text-primary-foreground text-xs"
                  >
                    <Send className="h-3 w-3 mr-1" />
                    ส่งความเห็น
                  </Button>
                </form>
              </div>
            </div>
          </LiyonDialogBody>

          <LiyonDialogFooter>
            <div className="flex items-center justify-between w-full">
              <div>
                {detailItem.status === "DRAFT" && (
                  <Button
                    onClick={() => {
                      handleSubmitDocument(detailItem.id);
                      setDetailItem(null);
                    }}
                    className="bg-primary text-primary-foreground text-xs"
                  >
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    {t("doc.action.submit")}
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setDetailItem(null)}>
                  {t("common.close")}
                </Button>
              </div>
            </div>
          </LiyonDialogFooter>
        </LiyonDialog>
      )}

      {/* Approve Step Modal */}
      {approveStepItem && (
        <LiyonDialog open={true} onOpenChange={(open) => !open && setApproveStepItem(null)}>
          <LiyonDialogCloseButton label={t("common.close")} />
          <LiyonDialogHeader
            title={`${t("doc.action.approve")} (ขั้นที่ ${approveStepItem.stepNo})`}
            description={approveStepItem.role}
          />
          <form onSubmit={handleApproveStep}>
            <LiyonDialogBody>
              <div className="space-y-4 py-2">
                <div className="bg-emerald-500/10 text-emerald-700 p-3 rounded-lg text-xs">
                  ตำแหน่งผู้พิจารณา: <strong>{approveStepItem.role}</strong>
                  <br />
                  การลงนามนี้จะบันทึกรหัสลายมือชื่อดิจิทัลและส่งต่อเอกสารไปยังขั้นตอนถัดไป
                </div>

                <LiyonField label={t("doc.workflow.comment")} htmlFor="appr-comment">
                  <textarea
                    id="appr-comment"
                    rows={3}
                    value={approveComment}
                    onChange={(e) => setApproveComment(e.target.value)}
                    placeholder="ระบุความเห็นหรือข้อสั่งการ (ถ้ามี) เช่น เห็นชอบตามเสนอ..."
                  />
                </LiyonField>
              </div>
            </LiyonDialogBody>

            <LiyonDialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setApproveStepItem(null)}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isPending ? "กำลังบันทึก..." : "ยืนยันการอนุมัติ"}
              </Button>
            </LiyonDialogFooter>
          </form>
        </LiyonDialog>
      )}

      {/* Reject Step Modal */}
      {rejectStepItem && (
        <LiyonDialog open={true} onOpenChange={(open) => !open && setRejectStepItem(null)}>
          <LiyonDialogCloseButton label={t("common.close")} />
          <LiyonDialogHeader
            title={`${t("doc.action.reject")} (ขั้นที่ ${rejectStepItem.stepNo})`}
            description={rejectStepItem.role}
          />
          <form onSubmit={handleRejectStep}>
            <LiyonDialogBody>
              <div className="space-y-4 py-2">
                <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-xs">
                  เอกสารจะถูกเปลี่ยนสถานะเป็น <strong>&ldquo;ไม่อนุมัติ / ส่งกลับ&rdquo;</strong> และยุติกระบวนการเวียนเอกสาร
                </div>

                <LiyonField label="เหตุผลการส่งกลับ / ข้อเสนอแนะเพื่อแก้ไข" htmlFor="rej-comment">
                  <textarea
                    id="rej-comment"
                    rows={3}
                    required
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                    placeholder="กรุณาระบุข้อบกพร่อง หรือเหตุผลในการไม่อนุมัติ..."
                  />
                </LiyonField>
              </div>
            </LiyonDialogBody>

            <LiyonDialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRejectStepItem(null)}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isPending || !rejectComment.trim()}
                className="bg-destructive text-destructive-foreground"
              >
                {isPending ? "กำลังบันทึก..." : "ยืนยันการไม่อนุมัติ"}
              </Button>
            </LiyonDialogFooter>
          </form>
        </LiyonDialog>
      )}
    </div>
  );
}
