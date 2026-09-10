"use client";

import { useState, useTransition, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  FolderKanban,
  AlertTriangle,
  FileText,
  Target,
  ArrowUpRight,
  TrendingUp,
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
  ProjectDto,
  ProjectStatsDto,
  ProjectUserOption,
} from "@/features/project-budget";
import {
  getProjectsAction,
  getProjectStatsAction,
  createProjectAction,
  updateProjectAction,
  addProjectExpenseAction,
  deleteProjectExpenseAction,
  addProjectKpiAction,
  updateProjectKpiAction,
} from "@/features/project-budget/actions";

interface Props {
  initialProjects: ProjectDto[];
  initialStats: ProjectStatsDto;
  userOptions: ProjectUserOption[];
  currentUserId: string;
  canCreate: boolean;
  canManage: boolean;
  canPlan: boolean;
  canExecutive: boolean;
}

interface NewKpiItem {
  id: string;
  indicatorName: string;
  targetValue: string;
  unit: string;
}

export function ProjectsClient({
  initialProjects,
  initialStats,
  userOptions,
  currentUserId,
  canCreate,
  canManage,
  canPlan,
}: Props) {
  const t = useT();
  const locale = useLocale();
  const [projects, setProjects] = useState<ProjectDto[]>(initialProjects);
  const [stats, setStats] = useState<ProjectStatsDto>(initialStats);
  const [isPending, startTransition] = useTransition();

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [yearFilter, setYearFilter] = useState<string>("ALL");

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<ProjectDto | null>(null);
  const [detailItem, setDetailItem] = useState<ProjectDto | null>(null);

  // Create/Edit form states
  const [code, setCode] = useState("");
  const [nameTh, setNameTh] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [fiscalYear, setFiscalYear] = useState<number>(2569);
  const [strategicPlan, setStrategicPlan] = useState("");
  const [budgetSource, setBudgetSource] = useState<
    "GOVERNMENT" | "REVENUE" | "RESEARCH_GRANT" | "DONATION" | "OTHER"
  >("REVENUE");
  const [allocatedBudget, setAllocatedBudget] = useState<string>("");
  const [responsiblePersonId, setResponsiblePersonId] = useState<string>(
    userOptions[0]?.id || currentUserId,
  );
  const [status, setStatus] = useState<
    "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "SUSPENDED"
  >("PLANNED");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [kpis, setKpis] = useState<NewKpiItem[]>([
    { id: "1", indicatorName: "", targetValue: "", unit: "" },
  ]);

  // Expense form state
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [expenseReceiptRef, setExpenseReceiptRef] = useState("");

  // KPI add form state
  const [newKpiName, setNewKpiName] = useState("");
  const [newKpiTarget, setNewKpiTarget] = useState("");
  const [newKpiUnit, setNewKpiUnit] = useState("");

  // KPI update inline state
  const [editingKpiId, setEditingKpiId] = useState<string | null>(null);
  const [editingKpiActual, setEditingKpiActual] = useState("");
  const [editingKpiStatus, setEditingKpiStatus] = useState<
    "PENDING" | "ON_TRACK" | "AT_RISK" | "ACHIEVED"
  >("PENDING");

  const refreshData = async () => {
    const [resP, resS] = await Promise.all([
      getProjectsAction(),
      getProjectStatsAction(),
    ]);
    if (resP.ok) {
      setProjects(resP.data);
      // Update detailItem if open
      if (detailItem) {
        const found = resP.data.find((p) => p.id === detailItem.id);
        if (found) setDetailItem(found);
      }
    }
    if (resS.ok) setStats(resS.data);
  };

  const openCreateDialog = () => {
    setCode(`PRJ-${new Date().getFullYear() + 543}-${(projects.length + 1).toString().padStart(3, "0")}`);
    setNameTh("");
    setNameEn("");
    setFiscalYear(2569);
    setStrategicPlan("ยุทธศาสตร์ที่ 1: การพัฒนาบัณฑิตและนวัตกรรมการเรียนรู้");
    setBudgetSource("REVENUE");
    setAllocatedBudget("");
    setResponsiblePersonId(userOptions[0]?.id || currentUserId);
    setStatus("PLANNED");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setKpis([{ id: "1", indicatorName: "", targetValue: "", unit: "คน" }]);
    setCreateOpen(true);
  };

  const openEditDialog = (p: ProjectDto) => {
    setEditItem(p);
    setNameTh(p.nameTh);
    setNameEn(p.nameEn || "");
    setFiscalYear(p.fiscalYear);
    setStrategicPlan(p.strategicPlan || "");
    setBudgetSource(p.budgetSource);
    setAllocatedBudget(p.allocatedBudget.toString());
    setStatus(p.status);
    setStartDate(p.startDate);
    setEndDate(p.endDate);
    setDescription(p.description || "");
  };

  const handleAddKpiRow = () => {
    setKpis((prev) => [
      ...prev,
      { id: Math.random().toString(), indicatorName: "", targetValue: "", unit: "คน" },
    ]);
  };

  const handleRemoveKpiRow = (id: string) => {
    if (kpis.length > 1) {
      setKpis((prev) => prev.filter((k) => k.id !== id));
    }
  };

  const handleKpiRowChange = (id: string, field: keyof NewKpiItem, val: string) => {
    setKpis((prev) =>
      prev.map((k) => (k.id === id ? { ...k, [field]: val } : k)),
    );
  };

  const handleCreateSubmit = () => {
    const numBudget = parseFloat(allocatedBudget);
    if (!code.trim() || !nameTh.trim() || isNaN(numBudget) || numBudget <= 0 || !startDate || !endDate) {
      toast.error(t("error.validation"));
      return;
    }

    const validKpis = kpis
      .filter((k) => k.indicatorName.trim() && parseFloat(k.targetValue) > 0)
      .map((k) => ({
        indicatorName: k.indicatorName.trim(),
        targetValue: parseFloat(k.targetValue),
        unit: k.unit.trim() || "รายการ",
      }));

    startTransition(async () => {
      const res = await createProjectAction({
        code: code.trim(),
        nameTh: nameTh.trim(),
        nameEn: nameEn.trim() || undefined,
        fiscalYear,
        strategicPlan: strategicPlan.trim() || undefined,
        budgetSource,
        allocatedBudget: numBudget,
        responsiblePersonId,
        startDate,
        endDate,
        description: description.trim() || undefined,
        kpis: validKpis,
      });

      if (res.ok) {
        toast.success(t("project.createSuccess"));
        setCreateOpen(false);
        await refreshData();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const handleEditSubmit = () => {
    if (!editItem) return;
    const numBudget = parseFloat(allocatedBudget);
    if (!nameTh.trim() || isNaN(numBudget) || numBudget <= 0 || !startDate || !endDate) {
      toast.error(t("error.validation"));
      return;
    }

    startTransition(async () => {
      const res = await updateProjectAction({
        id: editItem.id,
        nameTh: nameTh.trim(),
        nameEn: nameEn.trim() || undefined,
        fiscalYear,
        strategicPlan: strategicPlan.trim() || undefined,
        budgetSource,
        allocatedBudget: numBudget,
        status,
        startDate,
        endDate,
        description: description.trim() || undefined,
      });

      if (res.ok) {
        toast.success(t("project.updateSuccess"));
        setEditItem(null);
        await refreshData();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const handleAddExpenseSubmit = () => {
    if (!detailItem) return;
    const amount = parseFloat(expenseAmount);
    if (!expenseTitle.trim() || isNaN(amount) || amount <= 0 || !expenseDate) {
      toast.error(t("error.validation"));
      return;
    }

    startTransition(async () => {
      const res = await addProjectExpenseAction({
        projectId: detailItem.id,
        title: expenseTitle.trim(),
        amount,
        expenseDate,
        receiptRef: expenseReceiptRef.trim() || undefined,
      });

      if (res.ok) {
        toast.success(t("project.addExpenseSuccess"));
        setExpenseTitle("");
        setExpenseAmount("");
        setExpenseReceiptRef("");
        await refreshData();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const handleDeleteExpense = (expId: string) => {
    if (!detailItem) return;
    startTransition(async () => {
      const res = await deleteProjectExpenseAction({
        id: expId,
        projectId: detailItem.id,
      });

      if (res.ok) {
        toast.success(t("project.deleteExpenseSuccess"));
        await refreshData();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const handleAddKpiSubmit = () => {
    if (!detailItem) return;
    const target = parseFloat(newKpiTarget);
    if (!newKpiName.trim() || isNaN(target) || target <= 0 || !newKpiUnit.trim()) {
      toast.error(t("error.validation"));
      return;
    }

    startTransition(async () => {
      const res = await addProjectKpiAction({
        projectId: detailItem.id,
        indicatorName: newKpiName.trim(),
        targetValue: target,
        unit: newKpiUnit.trim(),
      });

      if (res.ok) {
        toast.success(t("project.addKpiSuccess"));
        setNewKpiName("");
        setNewKpiTarget("");
        setNewKpiUnit("");
        await refreshData();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const handleUpdateKpi = (kpiId: string) => {
    const actual = parseFloat(editingKpiActual);
    if (isNaN(actual)) {
      toast.error(t("error.validation"));
      return;
    }

    startTransition(async () => {
      const res = await updateProjectKpiAction({
        id: kpiId,
        actualValue: actual,
        status: editingKpiStatus,
      });

      if (res.ok) {
        toast.success(t("project.updateKpiSuccess"));
        setEditingKpiId(null);
        await refreshData();
      } else {
        toast.error(res.error.message || t("common.error"));
      }
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 2,
    }).format(val);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
      if (yearFilter !== "ALL" && p.fiscalYear.toString() !== yearFilter) return false;
      return true;
    });
  }, [projects, statusFilter, yearFilter]);

  const uniqueYears = useMemo(() => {
    const set = new Set(projects.map((p) => p.fiscalYear));
    return Array.from(set).sort((a, b) => b - a);
  }, [projects]);

  const getStatusTone = (st: string): StatusPillTone => {
    switch (st) {
      case "PLANNED":
        return "info";
      case "IN_PROGRESS":
        return "warn";
      case "COMPLETED":
        return "ok";
      case "SUSPENDED":
        return "bad";
      default:
        return "off";
    }
  };

  const getKpiTone = (st: string): StatusPillTone => {
    switch (st) {
      case "ACHIEVED":
        return "ok";
      case "ON_TRACK":
        return "info";
      case "AT_RISK":
        return "warn";
      case "PENDING":
        return "off";
      default:
        return "off";
    }
  };

  const columns: DataTableColumn<ProjectDto>[] = [
    {
      key: "code",
      header: t("project.code"),
      render: (row) => <span className="font-mono text-xs font-semibold text-primary">{row.code}</span>,
    },
    {
      key: "name",
      header: t("project.nameTh"),
      render: (row) => (
        <div>
          <span className="font-medium text-foreground block">{row.nameTh}</span>
          <span className="text-xs text-muted-foreground">
            {row.responsiblePersonName} • {t(`project.source.${row.budgetSource}`)}
          </span>
        </div>
      ),
    },
    {
      key: "fiscalYear",
      header: t("project.fiscalYear"),
      className: "nowrap text-xs text-center font-mono",
      render: (row) => <span>{row.fiscalYear}</span>,
    },
    {
      key: "allocated",
      header: t("project.allocatedBudget"),
      className: "num font-semibold text-right text-xs font-mono",
      render: (row) => <span>{formatCurrency(row.allocatedBudget)}</span>,
    },
    {
      key: "spent",
      header: t("project.spentBudget"),
      className: "num font-semibold text-right text-xs font-mono",
      render: (row) => (
        <div>
          <span className="text-primary">{formatCurrency(row.spentBudget)}</span>
          <div className="w-24 bg-muted h-1.5 rounded-full overflow-hidden mt-1 ml-auto">
            <div
              className={`h-full ${row.executionRate > 90 ? "bg-emerald-600" : row.executionRate > 50 ? "bg-blue-600" : "bg-amber-500"}`}
              style={{ width: `${Math.min(100, row.executionRate)}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground block">{row.executionRate}%</span>
        </div>
      ),
    },
    {
      key: "status",
      header: t("project.status"),
      render: (row) => (
        <StatusPill tone={getStatusTone(row.status)}>
          {t(`project.status.${row.status}`)}
        </StatusPill>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("project.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("project.subtitle")}</p>
        </div>
        {canCreate && (
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("project.create")}
          </Button>
        )}
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{t("project.kpi.totalAllocated")}</p>
            <p className="text-xl font-bold mt-1 text-foreground font-mono">{formatCurrency(stats.totalAllocated)}</p>
          </div>
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{t("project.kpi.totalSpent")}</p>
            <p className="text-xl font-bold mt-1 text-blue-600 font-mono">{formatCurrency(stats.totalSpent)}</p>
            <span className="text-[11px] text-muted-foreground">{t("project.kpi.avgExecutionRate")}: {stats.avgExecutionRate}%</span>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-600 rounded-lg">
            <ArrowUpRight className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{t("project.kpi.totalRemaining")}</p>
            <p className="text-xl font-bold mt-1 text-emerald-600 font-mono">{formatCurrency(stats.totalRemaining)}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-lg">
            <FolderKanban className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{t("project.kpi.activeProjects")}</p>
            <p className="text-2xl font-bold mt-1 text-purple-600">{stats.activeProjectCount} / {stats.totalProjectCount}</p>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-600 rounded-lg">
            <Target className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <LiyonCard>
        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {["ALL", "PLANNED", "IN_PROGRESS", "COMPLETED", "SUSPENDED"].map((stKey) => (
              <button
                key={stKey}
                type="button"
                onClick={() => setStatusFilter(stKey)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === stKey
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {stKey === "ALL" ? t("project.status.all") : t(`project.status.${stKey}`)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{t("project.fiscalYear")}:</span>
            <select
              className="text-xs border rounded-md px-2 py-1 bg-background"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="ALL">{t("project.status.all")}</option>
              {uniqueYears.map((yr) => (
                <option key={yr} value={yr.toString()}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DataTable<ProjectDto>
          state={filteredProjects.length === 0 ? "empty" : "data"}
          headHeading={t("project.title")}
          rows={filteredProjects}
          columns={columns}
          getRowId={(row) => row.id}
          renderRowMenu={(row) => (
            <>
              <RowMenuItem onSelect={() => setDetailItem(row)} icon={<FileText className="h-4 w-4" />}>
                {t("project.action.viewDetail")}
              </RowMenuItem>
              {(canPlan || canManage || row.responsiblePersonId === currentUserId) && (
                <RowMenuItem onSelect={() => openEditDialog(row)} icon={<Edit2 className="h-4 w-4" />}>
                  {t("project.action.edit")}
                </RowMenuItem>
              )}
            </>
          )}
          empty={{
            icon: <FolderKanban className="h-10 w-10 text-muted-foreground/50" />,
            title: t("project.empty"),
            description: t("project.emptyDesc"),
          }}
          error={{
            icon: <AlertTriangle className="h-10 w-10 text-destructive" />,
            title: t("common.error"),
          }}
        />
      </LiyonCard>

      {/* Dialog 1: สร้างโครงการใหม่ */}
      <LiyonDialog open={createOpen} onOpenChange={setCreateOpen} wide>
        <LiyonDialogCloseButton label={t("common.close")} />
        <LiyonDialogHeader title={t("project.create")} description={t("project.subtitle")} />
        <LiyonDialogBody>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <LiyonField label={t("project.code")} htmlFor="prj-code">
                <input id="prj-code" value={code} onChange={(e) => setCode(e.target.value)} required />
              </LiyonField>
              <LiyonField label={t("project.fiscalYear")} htmlFor="prj-year">
                <input
                  id="prj-year"
                  type="number"
                  value={fiscalYear}
                  onChange={(e) => setFiscalYear(parseInt(e.target.value, 10))}
                  required
                />
              </LiyonField>
              <LiyonField label={t("project.budgetSource")} htmlFor="prj-source">
                <LiyonSelect
                  id="prj-source"
                  value={budgetSource}
                  onChange={(e) => setBudgetSource(e.target.value as typeof budgetSource)}
                >
                  <option value="REVENUE">{t("project.source.REVENUE")}</option>
                  <option value="GOVERNMENT">{t("project.source.GOVERNMENT")}</option>
                  <option value="RESEARCH_GRANT">{t("project.source.RESEARCH_GRANT")}</option>
                  <option value="DONATION">{t("project.source.DONATION")}</option>
                  <option value="OTHER">{t("project.source.OTHER")}</option>
                </LiyonSelect>
              </LiyonField>
            </div>

            <LiyonField label={t("project.nameTh")} htmlFor="prj-name-th">
              <input
                id="prj-name-th"
                value={nameTh}
                onChange={(e) => setNameTh(e.target.value)}
                placeholder="เช่น โครงการเสริมสร้างทักษะ AI สำหรับศตวรรษที่ 21"
                required
              />
            </LiyonField>

            <LiyonField label={t("project.strategicPlan")} htmlFor="prj-strat">
              <input
                id="prj-strat"
                value={strategicPlan}
                onChange={(e) => setStrategicPlan(e.target.value)}
                placeholder="ยุทธศาสตร์ที่ตอบสนอง..."
              />
            </LiyonField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LiyonField label={t("project.allocatedBudget")} htmlFor="prj-budget">
                <input
                  id="prj-budget"
                  type="number"
                  value={allocatedBudget}
                  onChange={(e) => setAllocatedBudget(e.target.value)}
                  placeholder="เช่น 100000"
                  required
                />
              </LiyonField>

              <LiyonField label={t("project.responsiblePerson")} htmlFor="prj-manager">
                <LiyonSelect
                  id="prj-manager"
                  value={responsiblePersonId}
                  onChange={(e) => setResponsiblePersonId(e.target.value)}
                >
                  {userOptions.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </LiyonSelect>
              </LiyonField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LiyonField label={t("project.startDate")} htmlFor="prj-start">
                <input
                  id="prj-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </LiyonField>
              <LiyonField label={t("project.endDate")} htmlFor="prj-end">
                <input
                  id="prj-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </LiyonField>
            </div>

            {/* Initial KPIs */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">{t("project.kpi.title")}</h4>
                <Button type="button" variant="outline" size="sm" onClick={handleAddKpiRow} className="gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  {t("project.kpi.add")}
                </Button>
              </div>

              <div className="space-y-2">
                {kpis.map((k) => (
                  <div key={k.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <input
                      className="sm:col-span-6 text-xs"
                      placeholder="ชื่อตัวชี้วัด เช่น จำนวนผู้เข้าร่วมอบรม"
                      value={k.indicatorName}
                      onChange={(e) => handleKpiRowChange(k.id, "indicatorName", e.target.value)}
                    />
                    <input
                      type="number"
                      className="sm:col-span-3 text-xs text-right font-mono"
                      placeholder="เป้าหมาย"
                      value={k.targetValue}
                      onChange={(e) => handleKpiRowChange(k.id, "targetValue", e.target.value)}
                    />
                    <input
                      className="sm:col-span-2 text-xs"
                      placeholder="หน่วยนับ เช่น คน, ชิ้น"
                      value={k.unit}
                      onChange={(e) => handleKpiRowChange(k.id, "unit", e.target.value)}
                    />
                    {kpis.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveKpiRow(k.id)}
                        className="p-1 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={isPending}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleCreateSubmit} disabled={isPending}>
            {t("project.create")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Dialog 2: แก้ไขโครงการ */}
      {editItem && (
        <LiyonDialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)} wide>
          <LiyonDialogCloseButton label={t("common.close")} />
          <LiyonDialogHeader title={t("project.edit")} description={`${editItem.code}: ${editItem.nameTh}`} />
          <LiyonDialogBody>
            <div className="space-y-4 py-2">
              <LiyonField label={t("project.nameTh")} htmlFor="edit-name">
                <input id="edit-name" value={nameTh} onChange={(e) => setNameTh(e.target.value)} required />
              </LiyonField>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <LiyonField label={t("project.fiscalYear")} htmlFor="edit-year">
                  <input
                    id="edit-year"
                    type="number"
                    value={fiscalYear}
                    onChange={(e) => setFiscalYear(parseInt(e.target.value, 10))}
                  />
                </LiyonField>
                <LiyonField label={t("project.budgetSource")} htmlFor="edit-source">
                  <LiyonSelect
                    id="edit-source"
                    value={budgetSource}
                    onChange={(e) => setBudgetSource(e.target.value as typeof budgetSource)}
                  >
                    <option value="REVENUE">{t("project.source.REVENUE")}</option>
                    <option value="GOVERNMENT">{t("project.source.GOVERNMENT")}</option>
                    <option value="RESEARCH_GRANT">{t("project.source.RESEARCH_GRANT")}</option>
                    <option value="DONATION">{t("project.source.DONATION")}</option>
                    <option value="OTHER">{t("project.source.OTHER")}</option>
                  </LiyonSelect>
                </LiyonField>
                <LiyonField label={t("project.status")} htmlFor="edit-status">
                  <LiyonSelect
                    id="edit-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as typeof status)}
                  >
                    <option value="PLANNED">{t("project.status.PLANNED")}</option>
                    <option value="IN_PROGRESS">{t("project.status.IN_PROGRESS")}</option>
                    <option value="COMPLETED">{t("project.status.COMPLETED")}</option>
                    <option value="SUSPENDED">{t("project.status.SUSPENDED")}</option>
                  </LiyonSelect>
                </LiyonField>
              </div>

              <LiyonField label={t("project.allocatedBudget")} htmlFor="edit-budget">
                <input
                  id="edit-budget"
                  type="number"
                  value={allocatedBudget}
                  onChange={(e) => setAllocatedBudget(e.target.value)}
                  required
                />
              </LiyonField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LiyonField label={t("project.startDate")} htmlFor="edit-start">
                  <input
                    id="edit-start"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </LiyonField>
                <LiyonField label={t("project.endDate")} htmlFor="edit-end">
                  <input
                    id="edit-end"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </LiyonField>
              </div>
            </div>
          </LiyonDialogBody>
          <LiyonDialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)} disabled={isPending}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleEditSubmit} disabled={isPending}>
              {t("common.save")}
            </Button>
          </LiyonDialogFooter>
        </LiyonDialog>
      )}

      {/* Dialog 3: รายละเอียดโครงการ + ตัวบันทึกรายจ่าย & KPIs */}
      {detailItem && (
        <LiyonDialog open={!!detailItem} onOpenChange={(open) => !open && setDetailItem(null)} wide>
          <LiyonDialogCloseButton label={t("common.close")} />
          <LiyonDialogHeader
            title={`${detailItem.code}: ${detailItem.nameTh}`}
            description={`${detailItem.responsiblePersonName} • ปีงบประมาณ ${detailItem.fiscalYear}`}
          />
          <LiyonDialogBody>
            <div className="space-y-6 py-2 text-sm">
              {/* Budget Visual Progress Card */}
              <div className="border rounded-xl p-4 bg-muted/20 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-xs text-muted-foreground">{t("project.allocatedBudget")}</span>
                    <p className="font-bold text-foreground font-mono text-base">{formatCurrency(detailItem.allocatedBudget)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">{t("project.spentBudget")}</span>
                    <p className="font-bold text-primary font-mono text-base">{formatCurrency(detailItem.spentBudget)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">{t("project.remainingBudget")}</span>
                    <p className="font-bold text-emerald-600 font-mono text-base">{formatCurrency(detailItem.remainingBudget)}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t("project.executionRate")}</span>
                    <span className="font-bold font-mono">{detailItem.executionRate}%</span>
                  </div>
                  <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        detailItem.executionRate > 90 ? "bg-emerald-600" : detailItem.executionRate > 50 ? "bg-blue-600" : "bg-amber-500"
                      }`}
                      style={{ width: `${Math.min(100, detailItem.executionRate)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 1: Expense Tracker */}
              <div className="border rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  {t("project.expenses.title")}
                </h4>

                {/* Add Expense Form */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 bg-muted/40 rounded-lg items-end">
                  <div className="sm:col-span-4">
                    <label className="text-[11px] text-muted-foreground block mb-1">{t("project.expenses.itemTitle")}</label>
                    <input
                      className="w-full text-xs"
                      placeholder="เช่น ค่าจัดจ้างวิทยากร"
                      value={expenseTitle}
                      onChange={(e) => setExpenseTitle(e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-muted-foreground block mb-1">{t("project.expenses.amount")}</label>
                    <input
                      type="number"
                      className="w-full text-xs text-right font-mono"
                      placeholder="0.00"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-[11px] text-muted-foreground block mb-1">{t("project.expenses.date")}</label>
                    <input
                      type="date"
                      className="w-full text-xs"
                      value={expenseDate}
                      onChange={(e) => setExpenseDate(e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-muted-foreground block mb-1">{t("project.expenses.receiptRef")}</label>
                    <input
                      className="w-full text-xs"
                      placeholder="เช่น REC-101"
                      value={expenseReceiptRef}
                      onChange={(e) => setExpenseReceiptRef(e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Button
                      type="button"
                      size="sm"
                      className="w-full"
                      onClick={handleAddExpenseSubmit}
                      disabled={isPending}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Expense List */}
                <div className="divide-y border rounded-lg overflow-hidden text-xs">
                  {detailItem.expenses.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      {t("project.expenses.empty")}
                    </div>
                  ) : (
                    detailItem.expenses.map((exp) => (
                      <div key={exp.id} className="p-3 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-foreground block">{exp.title}</span>
                          <span className="text-muted-foreground text-[11px]">
                            {formatDate(new Date(exp.expenseDate), locale)} • {exp.receiptRef || "—"} • โดย {exp.recordedByName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-primary font-mono text-sm">{formatCurrency(exp.amount)}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="p-1 text-muted-foreground hover:text-destructive"
                            title="ลบรายการ"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Section 2: KPIs Tracker */}
              <div className="border rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-purple-600" />
                  {t("project.kpi.title")}
                </h4>

                {/* Add KPI Form */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 bg-muted/40 rounded-lg items-end">
                  <div className="sm:col-span-6">
                    <label className="text-[11px] text-muted-foreground block mb-1">{t("project.kpi.name")}</label>
                    <input
                      className="w-full text-xs"
                      placeholder="เช่น จำนวนผู้ผ่านการประเมิน"
                      value={newKpiName}
                      onChange={(e) => setNewKpiName(e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-[11px] text-muted-foreground block mb-1">{t("project.kpi.target")}</label>
                    <input
                      type="number"
                      className="w-full text-xs text-right font-mono"
                      placeholder="เป้าหมาย"
                      value={newKpiTarget}
                      onChange={(e) => setNewKpiTarget(e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-muted-foreground block mb-1">{t("project.kpi.unit")}</label>
                    <input
                      className="w-full text-xs"
                      placeholder="หน่วยนับ"
                      value={newKpiUnit}
                      onChange={(e) => setNewKpiUnit(e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Button
                      type="button"
                      size="sm"
                      className="w-full"
                      onClick={handleAddKpiSubmit}
                      disabled={isPending}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* KPIs List */}
                <div className="divide-y border rounded-lg overflow-hidden text-xs">
                  {detailItem.kpis.map((kpi) => {
                    const isEditing = editingKpiId === kpi.id;
                    const pct = kpi.targetValue > 0 ? Math.round((kpi.actualValue / kpi.targetValue) * 100) : 0;
                    return (
                      <div key={kpi.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex-1">
                          <span className="font-semibold text-foreground">{kpi.indicatorName}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-muted-foreground font-mono">
                              เป้าหมาย: {kpi.targetValue} {kpi.unit} | จริง: {kpi.actualValue} {kpi.unit} ({pct}%)
                            </span>
                            <StatusPill tone={getKpiTone(kpi.status)}>
                              {t(`project.kpi.${kpi.status}`)}
                            </StatusPill>
                          </div>
                        </div>

                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              className="w-20 text-xs text-right font-mono"
                              value={editingKpiActual}
                              onChange={(e) => setEditingKpiActual(e.target.value)}
                            />
                            <select
                              className="text-xs border rounded px-1.5 py-1 bg-background"
                              value={editingKpiStatus}
                              onChange={(e) => setEditingKpiStatus(e.target.value as typeof editingKpiStatus)}
                            >
                              <option value="PENDING">{t("project.kpi.PENDING")}</option>
                              <option value="ON_TRACK">{t("project.kpi.ON_TRACK")}</option>
                              <option value="AT_RISK">{t("project.kpi.AT_RISK")}</option>
                              <option value="ACHIEVED">{t("project.kpi.ACHIEVED")}</option>
                            </select>
                            <Button size="sm" onClick={() => handleUpdateKpi(kpi.id)} disabled={isPending}>
                              {t("common.save")}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingKpiId(null)}>
                              {t("common.cancel")}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingKpiId(kpi.id);
                              setEditingKpiActual(kpi.actualValue.toString());
                              setEditingKpiStatus(kpi.status);
                            }}
                          >
                            อัปเดตผล
                          </Button>
                        )}
                      </div>
                    );
                  })}
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
    </div>
  );
}
