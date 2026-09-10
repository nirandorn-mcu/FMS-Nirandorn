"use client";

import { useState, useTransition, useMemo } from "react";
import {
  Plus,
  CheckCircle2,
  XCircle,
  Banknote,
  Receipt,
  Clock,
  AlertTriangle,
  FileText,
  Trash2,
  CreditCard,
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
  RowMenuItem,
  type DataTableColumn,
  type StatusPillTone,
} from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import type {
  AdvanceRequestDto,
  AdvanceStatsDto,
  AdvanceItemDto,
  AdvanceClearingItemDto,
} from "@/features/advance-payment";
import {
  getAdvanceRequestsAction,
  getAdvanceStatsAction,
  createAdvanceRequestAction,
  approveAdvanceRequestAction,
  rejectAdvanceRequestAction,
  disburseAdvanceRequestAction,
  submitClearingAction,
  approveClearingAction,
} from "@/features/advance-payment/actions";

interface Props {
  initialRequests: AdvanceRequestDto[];
  initialStats: AdvanceStatsDto;
  currentUserId: string;
  canCreate: boolean;
  canApprove: boolean;
  canFinance: boolean;
  canManage: boolean;
}

interface NewAdvanceItem {
  id: string;
  itemDescription: string;
  estimatedAmount: string;
}

interface NewClearingItem {
  id: string;
  receiptNo: string;
  receiptDate: string;
  expenseTitle: string;
  amount: string;
}

export function AdvanceClient({
  initialRequests,
  initialStats,
  currentUserId,
  canCreate,
  canApprove,
  canFinance,
  canManage,
}: Props) {
  const t = useT();
  const locale = useLocale();
  const [requests, setRequests] = useState<AdvanceRequestDto[]>(initialRequests);
  const [stats, setStats] = useState<AdvanceStatsDto>(initialStats);
  const [isPending, startTransition] = useTransition();

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Dialog States
  const [createOpen, setCreateOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<AdvanceRequestDto | null>(null);
  const [rejectItem, setRejectItem] = useState<AdvanceRequestDto | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [clearingItem, setClearingItem] = useState<AdvanceRequestDto | null>(null);

  // Form states for Create Request
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNo, setBankAccountNo] = useState("");
  const [items, setItems] = useState<NewAdvanceItem[]>([
    { id: "1", itemDescription: "", estimatedAmount: "" },
  ]);

  // Form states for Clearing
  const [clearingNotes, setClearingNotes] = useState("");
  const [clearingProofUrl, setClearingProofUrl] = useState("");
  const [clearingItems, setClearingItems] = useState<NewClearingItem[]>([
    { id: "1", receiptNo: "", receiptDate: "", expenseTitle: "", amount: "" },
  ]);

  // Auto total calculation for create form
  const totalEstimatedAmount = useMemo(() => {
    return items.reduce((sum, it) => sum + (parseFloat(it.estimatedAmount) || 0), 0);
  }, [items]);

  // Auto total calculation for clearing form
  const totalActualExpense = useMemo(() => {
    return clearingItems.reduce((sum, it) => sum + (parseFloat(it.amount) || 0), 0);
  }, [clearingItems]);

  const refreshData = async () => {
    const [resReqs, resStats] = await Promise.all([
      getAdvanceRequestsAction(),
      getAdvanceStatsAction(),
    ]);
    if (resReqs.ok) setRequests(resReqs.data);
    if (resStats.ok) setStats(resStats.data);
  };

  const openCreateDialog = () => {
    setTitle("");
    setDescription("");
    setEventStartDate("");
    setEventEndDate("");
    setBankName("");
    setBankAccountName("");
    setBankAccountNo("");
    setItems([{ id: "1", itemDescription: "", estimatedAmount: "" }]);
    setCreateOpen(true);
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Math.random().toString(), itemDescription: "", estimatedAmount: "" },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((it) => it.id !== id));
    }
  };

  const handleItemChange = (id: string, field: "itemDescription" | "estimatedAmount", val: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: val } : it)),
    );
  };

  const handleCreateSubmit = () => {
    if (!title.trim() || !eventStartDate || !eventEndDate || totalEstimatedAmount <= 0) {
      toast.error(t("error.validation"));
      return;
    }

    const validItems = items
      .filter((it) => it.itemDescription.trim() && parseFloat(it.estimatedAmount) > 0)
      .map((it) => ({
        itemDescription: it.itemDescription.trim(),
        estimatedAmount: parseFloat(it.estimatedAmount),
      }));

    if (validItems.length === 0) {
      toast.error(t("error.validation"));
      return;
    }

    startTransition(async () => {
      const res = await createAdvanceRequestAction({
        title: title.trim(),
        description: description.trim() || undefined,
        amount: totalEstimatedAmount,
        eventStartDate,
        eventEndDate,
        bankName: bankName.trim() || undefined,
        bankAccountName: bankAccountName.trim() || undefined,
        bankAccountNo: bankAccountNo.trim() || undefined,
        items: validItems,
      });

      if (res.ok) {
        toast.success(t("advance.createSuccess"));
        setCreateOpen(false);
        await refreshData();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const handleApprove = (adv: AdvanceRequestDto) => {
    startTransition(async () => {
      const res = await approveAdvanceRequestAction({ id: adv.id });
      if (res.ok) {
        toast.success(t("advance.approveSuccess"));
        await refreshData();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const handleRejectSubmit = () => {
    if (!rejectItem || !rejectReason.trim()) return;
    startTransition(async () => {
      const res = await rejectAdvanceRequestAction({
        id: rejectItem.id,
        reason: rejectReason.trim(),
      });
      if (res.ok) {
        toast.success(t("advance.rejectSuccess"));
        setRejectItem(null);
        setRejectReason("");
        await refreshData();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const handleDisburse = (adv: AdvanceRequestDto) => {
    startTransition(async () => {
      const res = await disburseAdvanceRequestAction({ id: adv.id });
      if (res.ok) {
        toast.success(t("advance.disburseSuccess"));
        await refreshData();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const openClearingDialog = (adv: AdvanceRequestDto) => {
    setClearingItem(adv);
    setClearingNotes("");
    setClearingProofUrl("");
    setClearingItems([
      {
        id: "1",
        receiptNo: "",
        receiptDate: new Date().toISOString().split("T")[0],
        expenseTitle: "",
        amount: "",
      },
    ]);
  };

  const handleAddClearingItem = () => {
    setClearingItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        receiptNo: "",
        receiptDate: new Date().toISOString().split("T")[0],
        expenseTitle: "",
        amount: "",
      },
    ]);
  };

  const handleRemoveClearingItem = (id: string) => {
    if (clearingItems.length > 1) {
      setClearingItems((prev) => prev.filter((it) => it.id !== id));
    }
  };

  const handleClearingItemChange = (
    id: string,
    field: keyof NewClearingItem,
    val: string,
  ) => {
    setClearingItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: val } : it)),
    );
  };

  const handleClearingSubmit = () => {
    if (!clearingItem || totalActualExpense < 0) return;

    const validItems = clearingItems
      .filter((it) => it.expenseTitle.trim() && parseFloat(it.amount) > 0)
      .map((it) => ({
        receiptNo: it.receiptNo.trim() || undefined,
        receiptDate: it.receiptDate,
        expenseTitle: it.expenseTitle.trim(),
        amount: parseFloat(it.amount),
      }));

    if (validItems.length === 0) {
      toast.error(t("error.validation"));
      return;
    }

    startTransition(async () => {
      const res = await submitClearingAction({
        advanceRequestId: clearingItem.id,
        actualExpenseTotal: totalActualExpense,
        notes: clearingNotes.trim() || undefined,
        receiptProofUrl: clearingProofUrl.trim() || undefined,
        items: validItems,
      });

      if (res.ok) {
        toast.success(t("advance.clearSuccess"));
        setClearingItem(null);
        await refreshData();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const handleApproveClearing = (clearingId: string) => {
    startTransition(async () => {
      const res = await approveClearingAction({ clearingId });
      if (res.ok) {
        toast.success(t("advance.approveClearingSuccess"));
        await refreshData();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  // Filtered requests
  const filteredRequests = useMemo(() => {
    if (statusFilter === "ALL") return requests;
    return requests.filter((r) => r.status === statusFilter);
  }, [requests, statusFilter]);

  const getStatusTone = (status: string): StatusPillTone => {
    switch (status) {
      case "SUBMITTED":
        return "warn";
      case "APPROVED":
        return "info";
      case "DISBURSED":
        return "ok";
      case "CLEARED":
        return "ok";
      case "OVERDUE":
        return "bad";
      case "REJECTED":
        return "bad";
      default:
        return "off";
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 2,
    }).format(val);
  };

  const columns: DataTableColumn<AdvanceRequestDto>[] = [
    {
      key: "reqNo",
      header: t("advance.reqNo"),
      render: (row) => <span className="font-mono text-xs font-semibold text-primary">{row.reqNo}</span>,
    },
    {
      key: "title",
      header: t("advance.titleField"),
      render: (row) => (
        <div>
          <span className="font-medium text-foreground block">{row.title}</span>
          <span className="text-xs text-muted-foreground">{row.borrowerName}</span>
        </div>
      ),
    },
    {
      key: "amount",
      header: t("advance.amountField"),
      className: "num font-semibold text-right",
      render: (row) => <span>{formatCurrency(row.amount)}</span>,
    },
    {
      key: "eventDates",
      header: t("advance.eventStartDate"),
      className: "nowrap text-xs text-muted-foreground",
      render: (row) => (
        <span>
          {formatDate(new Date(row.eventStartDate), locale)} -{" "}
          {formatDate(new Date(row.eventEndDate), locale)}
        </span>
      ),
    },
    {
      key: "dueDateClearing",
      header: t("advance.dueDateClearing"),
      className: "nowrap text-xs text-muted-foreground",
      render: (row) => <span>{formatDate(new Date(row.dueDateClearing), locale)}</span>,
    },
    {
      key: "status",
      header: t("advance.status.all"),
      render: (row) => (
        <StatusPill tone={getStatusTone(row.status)}>
          {t(`advance.status.${row.status}`)}
        </StatusPill>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("advance.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("advance.subtitle")}</p>
        </div>
        {canCreate && (
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("advance.create")}
          </Button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{t("advance.kpi.totalOutstanding")}</p>
            <p className="text-xl font-bold mt-1 text-foreground">{formatCurrency(stats.totalOutstandingAmount)}</p>
          </div>
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            <Banknote className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{t("advance.kpi.pendingApproval")}</p>
            <p className="text-2xl font-bold mt-1 text-amber-600">{stats.pendingApprovalCount}</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-lg">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{t("advance.kpi.pendingClearing")}</p>
            <p className="text-2xl font-bold mt-1 text-blue-600">{stats.pendingClearingCount}</p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-600 rounded-lg">
            <Receipt className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{t("advance.kpi.overdue")}</p>
            <p className="text-2xl font-bold mt-1 text-destructive">{stats.overdueCount}</p>
          </div>
          <div className="p-3 bg-destructive/10 text-destructive rounded-lg">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <LiyonCard>
        <div className="p-4 border-b flex flex-wrap gap-2">
          {["ALL", "SUBMITTED", "APPROVED", "DISBURSED", "CLEARED", "OVERDUE"].map((statusKey) => (
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
              {statusKey === "ALL" ? t("advance.status.all") : t(`advance.status.${statusKey}`)}
            </button>
          ))}
        </div>

        <DataTable<AdvanceRequestDto>
          state={filteredRequests.length === 0 ? "empty" : "data"}
          headHeading={t("advance.title")}
          rows={filteredRequests}
          columns={columns}
          getRowId={(row) => row.id}
          renderRowMenu={(row) => {
            const isOwner = row.borrowerId === currentUserId;
            const hasClearingPending = row.clearing && row.clearing.status === "PENDING";
            return (
              <>
                <RowMenuItem onSelect={() => setDetailItem(row)} icon={<FileText className="h-4 w-4" />}>
                  {t("advance.action.viewDetail")}
                </RowMenuItem>

                {canApprove && row.status === "SUBMITTED" && (
                  <>
                    <RowMenuItem onSelect={() => handleApprove(row)} icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}>
                      {t("advance.action.approve")}
                    </RowMenuItem>
                    <RowMenuItem onSelect={() => { setRejectItem(row); setRejectReason(""); }} danger icon={<XCircle className="h-4 w-4" />}>
                      {t("advance.action.reject")}
                    </RowMenuItem>
                  </>
                )}

                {canFinance && row.status === "APPROVED" && (
                  <RowMenuItem onSelect={() => handleDisburse(row)} icon={<CreditCard className="h-4 w-4 text-blue-600" />}>
                    {t("advance.action.disburse")}
                  </RowMenuItem>
                )}

                {(isOwner || canManage) && (row.status === "DISBURSED" || row.status === "OVERDUE") && (
                  <RowMenuItem onSelect={() => openClearingDialog(row)} icon={<Receipt className="h-4 w-4 text-indigo-600" />}>
                    {t("advance.action.clear")}
                  </RowMenuItem>
                )}

                {canFinance && hasClearingPending && (
                  <RowMenuItem
                    onSelect={() => handleApproveClearing(row.clearing!.id)}
                    icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                  >
                    {t("advance.action.approveClearing")}
                  </RowMenuItem>
                )}
              </>
            );
          }}
          empty={{
            icon: <Banknote className="h-10 w-10 text-muted-foreground/50" />,
            title: t("advance.empty"),
            description: t("advance.emptyDesc"),
          }}
          error={{
            icon: <AlertTriangle className="h-10 w-10 text-destructive" />,
            title: t("common.error"),
          }}
        />
      </LiyonCard>

      {/* Dialog 1: สร้างคำขอยืมเงินใหม่ */}
      <LiyonDialog open={createOpen} onOpenChange={setCreateOpen} wide>
        <LiyonDialogCloseButton label={t("common.close")} />
        <LiyonDialogHeader
          title={t("advance.create")}
          description={t("advance.subtitle")}
        />
        <LiyonDialogBody>
          <div className="space-y-4 py-2">
            <LiyonField label={t("advance.titleField")} htmlFor="adv-title">
              <input
                id="adv-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น โครงการจัดอบรมพัฒนาทักษะดิจิทัล..."
                required
              />
            </LiyonField>

            <LiyonField label={t("advance.descriptionField")} htmlFor="adv-desc">
              <textarea
                id="adv-desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="รายละเอียดเพิ่มเติมของกิจกรรมหรือโครงการ..."
              />
            </LiyonField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LiyonField label={t("advance.eventStartDate")} htmlFor="adv-start">
                <input
                  id="adv-start"
                  type="date"
                  value={eventStartDate}
                  onChange={(e) => setEventStartDate(e.target.value)}
                  required
                />
              </LiyonField>

              <LiyonField label={t("advance.eventEndDate")} htmlFor="adv-end">
                <input
                  id="adv-end"
                  type="date"
                  value={eventEndDate}
                  onChange={(e) => setEventEndDate(e.target.value)}
                  required
                />
              </LiyonField>
            </div>

            <div className="border rounded-lg p-4 space-y-3 bg-muted/20">
              <h4 className="text-sm font-semibold">{t("advance.bankAccountName")}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <LiyonField label={t("advance.bankName")} htmlFor="adv-bank">
                  <input
                    id="adv-bank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="เช่น ธ.กรุงไทย"
                  />
                </LiyonField>
                <LiyonField label={t("advance.bankAccountName")} htmlFor="adv-acc-name">
                  <input
                    id="adv-acc-name"
                    value={bankAccountName}
                    onChange={(e) => setBankAccountName(e.target.value)}
                    placeholder="ชื่อบัญชี"
                  />
                </LiyonField>
                <LiyonField label={t("advance.bankAccountNo")} htmlFor="adv-acc-no">
                  <input
                    id="adv-acc-no"
                    value={bankAccountNo}
                    onChange={(e) => setBankAccountNo(e.target.value)}
                    placeholder="เลขที่บัญชี"
                  />
                </LiyonField>
              </div>
            </div>

            {/* Dynamic Items */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">{t("advance.items")}</h4>
                <Button type="button" variant="outline" size="sm" onClick={handleAddItem} className="gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  {t("advance.addItem")}
                </Button>
              </div>

              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <input
                      className="flex-1 text-sm"
                      placeholder={`รายการที่ ${idx + 1} เช่น ค่าอาหารว่างและเครื่องดื่ม`}
                      value={item.itemDescription}
                      onChange={(e) => handleItemChange(item.id, "itemDescription", e.target.value)}
                    />
                    <input
                      type="number"
                      className="w-32 text-sm text-right font-mono"
                      placeholder="จำนวนเงิน"
                      value={item.estimatedAmount}
                      onChange={(e) => handleItemChange(item.id, "estimatedAmount", e.target.value)}
                    />
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t flex justify-between items-center text-sm font-bold">
                <span>{t("advance.amountField")}:</span>
                <span className="text-primary text-base font-mono">{formatCurrency(totalEstimatedAmount)}</span>
              </div>
            </div>
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={isPending}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleCreateSubmit} disabled={isPending}>
            {t("advance.create")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Dialog 2: ดูรายละเอียดคำขอและไทม์ไลน์ */}
      {detailItem && (
        <LiyonDialog open={!!detailItem} onOpenChange={(open) => !open && setDetailItem(null)} wide>
          <LiyonDialogCloseButton label={t("common.close")} />
          <LiyonDialogHeader
            title={`${t("advance.reqNo")}: ${detailItem.reqNo}`}
            description={detailItem.title}
          />
          <LiyonDialogBody>
            <div className="space-y-4 py-2 text-sm">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="text-xs text-muted-foreground">{t("advance.borrower")}</p>
                  <p className="font-medium">{detailItem.borrowerName} ({detailItem.borrowerEmail})</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("advance.amountField")}</p>
                  <p className="font-bold text-primary font-mono text-base">{formatCurrency(detailItem.amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("advance.eventStartDate")}</p>
                  <p>{formatDate(new Date(detailItem.eventStartDate), locale)} - {formatDate(new Date(detailItem.eventEndDate), locale)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("advance.dueDateClearing")}</p>
                  <p className="font-medium text-amber-700">{formatDate(new Date(detailItem.dueDateClearing), locale)}</p>
                </div>
              </div>

              {detailItem.bankAccountNo && (
                <div className="p-3 border rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">{t("advance.bankAccountName")}</p>
                  <p>{detailItem.bankName} - {detailItem.bankAccountName} ({detailItem.bankAccountNo})</p>
                </div>
              )}

              {/* Items Breakdown */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted/50 p-2.5 font-semibold text-xs border-b">
                  {t("advance.items")}
                </div>
                <div className="divide-y text-xs">
                  {detailItem.items.map((it: AdvanceItemDto, idx: number) => (
                    <div key={it.id} className="p-2.5 flex justify-between">
                      <span>{idx + 1}. {it.itemDescription}</span>
                      <span className="font-mono font-medium">{formatCurrency(it.estimatedAmount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clearing Details if exists */}
              {detailItem.clearing && (
                <div className="border border-indigo-200 bg-indigo-50/30 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-indigo-950 flex items-center gap-1.5">
                      <Receipt className="h-4 w-4" />
                      {t("advance.clearing.title")}
                    </h4>
                    <StatusPill tone={detailItem.clearing.status === "APPROVED" ? "ok" : "warn"}>
                      {detailItem.clearing.status === "APPROVED" ? t("advance.status.CLEARED") : t("advance.status.SUBMITTED")}
                    </StatusPill>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">{t("advance.clearing.actualExpense")}:</span>
                      <p className="font-bold font-mono">{formatCurrency(detailItem.clearing.actualExpenseTotal)}</p>
                    </div>
                    {detailItem.clearing.refundAmount > 0 && (
                      <div>
                        <span className="text-emerald-700 font-medium">{t("advance.clearing.refundAmount")}:</span>
                        <p className="font-bold text-emerald-700 font-mono">{formatCurrency(detailItem.clearing.refundAmount)}</p>
                      </div>
                    )}
                    {detailItem.clearing.reimburseAmount > 0 && (
                      <div>
                        <span className="text-blue-700 font-medium">{t("advance.clearing.reimburseAmount")}:</span>
                        <p className="font-bold text-blue-700 font-mono">{formatCurrency(detailItem.clearing.reimburseAmount)}</p>
                      </div>
                    )}
                  </div>

                  {detailItem.clearing.items.length > 0 && (
                    <div className="divide-y border rounded bg-background text-xs">
                      {detailItem.clearing.items.map((ci: AdvanceClearingItemDto) => (
                        <div key={ci.id} className="p-2 flex justify-between">
                          <div>
                            <span className="font-medium">{ci.expenseTitle}</span>
                            {ci.receiptNo && <span className="text-muted-foreground ml-2">({ci.receiptNo})</span>}
                          </div>
                          <span className="font-mono">{formatCurrency(ci.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {detailItem.clearing.receiptProofUrl && (
                    <p className="text-xs">
                      <a href={detailItem.clearing.receiptProofUrl} target="_blank" rel="noreferrer" className="text-primary underline">
                        {t("advance.clearing.proofUrl")}
                      </a>
                    </p>
                  )}
                </div>
              )}

              {/* Status Timeline Info */}
              <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                {detailItem.approverName && <p>• อนุมัติโดย: {detailItem.approverName} เมื่อ {formatDate(new Date(detailItem.approvedAt!), locale)}</p>}
                {detailItem.disburserName && <p>• จ่ายเงินโดย: {detailItem.disburserName} เมื่อ {formatDate(new Date(detailItem.disbursedAt!), locale)}</p>}
                {detailItem.rejectionReason && <p className="text-destructive">• เหตุผลที่ไม่อนุมัติ: {detailItem.rejectionReason}</p>}
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

      {/* Dialog 3: ปฏิเสธคำขอ */}
      {rejectItem && (
        <LiyonDialog open={!!rejectItem} onOpenChange={(open) => !open && setRejectItem(null)} danger>
          <LiyonDialogCloseButton label={t("common.close")} />
          <LiyonDialogHeader
            title={t("advance.action.reject")}
            description={`${t("advance.reqNo")}: ${rejectItem.reqNo}`}
          />
          <LiyonDialogBody>
            <div className="py-2">
              <LiyonField label={t("advance.rejectReason")} htmlFor="reject-reason">
                <textarea
                  id="reject-reason"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder={t("advance.rejectReasonPh")}
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
              {t("advance.action.reject")}
            </Button>
          </LiyonDialogFooter>
        </LiyonDialog>
      )}

      {/* Dialog 4: ส่งใช้เงินยืม (Clearing Form) */}
      {clearingItem && (
        <LiyonDialog open={!!clearingItem} onOpenChange={(open) => !open && setClearingItem(null)} wide>
          <LiyonDialogCloseButton label={t("common.close")} />
          <LiyonDialogHeader
            title={t("advance.clearing.title")}
            description={`${t("advance.reqNo")}: ${clearingItem.reqNo} (${clearingItem.title})`}
          />
          <LiyonDialogBody>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 gap-3 p-3 bg-muted/40 rounded-lg text-sm">
                <div>
                  <span className="text-xs text-muted-foreground">{t("advance.clearing.borrowAmount")}</span>
                  <p className="font-bold text-foreground font-mono">{formatCurrency(clearingItem.amount)}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">{t("advance.clearing.actualExpense")}</span>
                  <p className="font-bold text-primary font-mono">{formatCurrency(totalActualExpense)}</p>
                </div>
                <div>
                  {totalActualExpense < clearingItem.amount ? (
                    <div>
                      <span className="text-xs text-emerald-700 font-semibold">{t("advance.clearing.refundAmount")}</span>
                      <p className="font-bold text-emerald-700 font-mono">
                        {formatCurrency(clearingItem.amount - totalActualExpense)}
                      </p>
                    </div>
                  ) : totalActualExpense > clearingItem.amount ? (
                    <div>
                      <span className="text-xs text-blue-700 font-semibold">{t("advance.clearing.reimburseAmount")}</span>
                      <p className="font-bold text-blue-700 font-mono">
                        {formatCurrency(totalActualExpense - clearingItem.amount)}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xs text-muted-foreground">ยอดเงินพอดี</span>
                      <p className="font-bold font-mono">0.00 ฿</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Receipts */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{t("advance.clearing.receipts")}</h4>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddClearingItem} className="gap-1">
                    <Plus className="h-3.5 w-3.5" />
                    {t("advance.clearing.addReceipt")}
                  </Button>
                </div>

                <div className="space-y-2">
                  {clearingItems.map((ci) => (
                    <div key={ci.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                      <input
                        className="sm:col-span-3 text-xs"
                        placeholder={t("advance.clearing.receiptNo")}
                        value={ci.receiptNo}
                        onChange={(e) => handleClearingItemChange(ci.id, "receiptNo", e.target.value)}
                      />
                      <input
                        type="date"
                        className="sm:col-span-3 text-xs"
                        value={ci.receiptDate}
                        onChange={(e) => handleClearingItemChange(ci.id, "receiptDate", e.target.value)}
                      />
                      <input
                        className="sm:col-span-4 text-xs"
                        placeholder={t("advance.clearing.expenseTitle")}
                        value={ci.expenseTitle}
                        onChange={(e) => handleClearingItemChange(ci.id, "expenseTitle", e.target.value)}
                      />
                      <div className="sm:col-span-2 flex items-center gap-1">
                        <input
                          type="number"
                          className="w-full text-xs text-right font-mono"
                          placeholder="0.00"
                          value={ci.amount}
                          onChange={(e) => handleClearingItemChange(ci.id, "amount", e.target.value)}
                        />
                        {clearingItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveClearingItem(ci.id)}
                            className="p-1 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <LiyonField label={t("advance.clearing.proofUrl")} htmlFor="clear-proof">
                <input
                  id="clear-proof"
                  value={clearingProofUrl}
                  onChange={(e) => setClearingProofUrl(e.target.value)}
                  placeholder="https://drive.google.com/... หรือ ลิงก์ไฟล์สแกนใบเสร็จ / สลิปโอนคืน"
                />
              </LiyonField>

              <LiyonField label={t("advance.clearing.notes")} htmlFor="clear-notes">
                <textarea
                  id="clear-notes"
                  rows={2}
                  value={clearingNotes}
                  onChange={(e) => setClearingNotes(e.target.value)}
                  placeholder="สรุปผลการดำเนินงานหรือหมายเหตุเพิ่มเติม..."
                />
              </LiyonField>
            </div>
          </LiyonDialogBody>
          <LiyonDialogFooter>
            <Button variant="outline" onClick={() => setClearingItem(null)} disabled={isPending}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleClearingSubmit} disabled={isPending || totalActualExpense <= 0}>
              {t("advance.action.clear")}
            </Button>
          </LiyonDialogFooter>
        </LiyonDialog>
      )}
    </div>
  );
}
