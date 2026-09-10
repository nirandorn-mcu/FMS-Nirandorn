import { prisma } from "@/shared/lib/infra/prisma";
import { writeAudit } from "@/features/identity/server";
import type {
  CreateProjectInput,
  UpdateProjectInput,
  AddProjectExpenseInput,
  DeleteProjectExpenseInput,
  AddProjectKpiInput,
  UpdateProjectKpiInput,
} from "./validations";

export interface ProjectKpiDto {
  id: string;
  projectId: string;
  indicatorName: string;
  targetValue: number;
  actualValue: number;
  unit: string;
  status: "PENDING" | "ON_TRACK" | "AT_RISK" | "ACHIEVED";
}

export interface ProjectExpenseDto {
  id: string;
  projectId: string;
  title: string;
  amount: number;
  expenseDate: string;
  receiptRef: string | null;
  recordedByName: string;
  createdAt: string;
}

export interface ProjectDto {
  id: string;
  tenantId: string;
  code: string;
  nameTh: string;
  nameEn: string | null;
  fiscalYear: number;
  strategicPlan: string | null;
  budgetSource: "GOVERNMENT" | "REVENUE" | "RESEARCH_GRANT" | "DONATION" | "OTHER";
  allocatedBudget: number;
  spentBudget: number;
  remainingBudget: number;
  executionRate: number;
  responsiblePersonId: string;
  responsiblePersonName: string;
  responsiblePersonEmail: string;
  startDate: string;
  endDate: string;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "SUSPENDED";
  description: string | null;
  createdAt: string;
  updatedAt: string;
  kpis: ProjectKpiDto[];
  expenses: ProjectExpenseDto[];
}

export interface ProjectStatsDto {
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
  avgExecutionRate: number;
  activeProjectCount: number;
  totalProjectCount: number;
}

export interface ProjectUserOption {
  id: string;
  name: string;
  email: string;
}

export async function listProjects(
  tenantId: string,
  fiscalYear?: number,
): Promise<ProjectDto[]> {
  const where: Record<string, unknown> = { tenantId };
  if (fiscalYear) {
    where.fiscalYear = fiscalYear;
  }

  const records = await prisma.project.findMany({
    where,
    include: {
      responsiblePerson: { select: { id: true, name: true, email: true } },
      kpis: { orderBy: { createdAt: "asc" } },
      expenses: {
        include: { recordedBy: { select: { id: true, name: true } } },
        orderBy: { expenseDate: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return records.map((p) => {
    const allocated = Number(p.allocatedBudget);
    const spent = Number(p.spentBudget);
    const remaining = Math.max(0, allocated - spent);
    const executionRate = allocated > 0 ? Math.min(100, Math.round((spent / allocated) * 100 * 10) / 10) : 0;

    return {
      id: p.id,
      tenantId: p.tenantId,
      code: p.code,
      nameTh: p.nameTh,
      nameEn: p.nameEn,
      fiscalYear: p.fiscalYear,
      strategicPlan: p.strategicPlan,
      budgetSource: p.budgetSource,
      allocatedBudget: allocated,
      spentBudget: spent,
      remainingBudget: remaining,
      executionRate,
      responsiblePersonId: p.responsiblePersonId,
      responsiblePersonName: p.responsiblePerson.name,
      responsiblePersonEmail: p.responsiblePerson.email,
      startDate: p.startDate.toISOString().split("T")[0],
      endDate: p.endDate.toISOString().split("T")[0],
      status: p.status,
      description: p.description,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      kpis: p.kpis.map((k) => ({
        id: k.id,
        projectId: k.projectId,
        indicatorName: k.indicatorName,
        targetValue: Number(k.targetValue),
        actualValue: Number(k.actualValue),
        unit: k.unit,
        status: k.status,
      })),
      expenses: p.expenses.map((e) => ({
        id: e.id,
        projectId: e.projectId,
        title: e.title,
        amount: Number(e.amount),
        expenseDate: e.expenseDate.toISOString().split("T")[0],
        receiptRef: e.receiptRef,
        recordedByName: e.recordedBy.name,
        createdAt: e.createdAt.toISOString(),
      })),
    };
  });
}

export async function getProjectStats(
  tenantId: string,
  fiscalYear?: number,
): Promise<ProjectStatsDto> {
  const where: Record<string, unknown> = { tenantId };
  if (fiscalYear) {
    where.fiscalYear = fiscalYear;
  }

  const projects = await prisma.project.findMany({
    where,
    select: {
      allocatedBudget: true,
      spentBudget: true,
      status: true,
    },
  });

  const totalAllocated = projects.reduce((sum, p) => sum + Number(p.allocatedBudget), 0);
  const totalSpent = projects.reduce((sum, p) => sum + Number(p.spentBudget), 0);
  const totalRemaining = Math.max(0, totalAllocated - totalSpent);
  const avgExecutionRate =
    totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100 * 10) / 10 : 0;
  const activeProjectCount = projects.filter((p) => p.status === "IN_PROGRESS").length;

  return {
    totalAllocated,
    totalSpent,
    totalRemaining,
    avgExecutionRate,
    activeProjectCount,
    totalProjectCount: projects.length,
  };
}

export async function listResponsibleUsers(tenantId: string): Promise<ProjectUserOption[]> {
  const users = await prisma.user.findMany({
    where: {
      userTenants: { some: { tenantId, isActive: true } },
      isActive: true,
    },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
  return users;
}

export async function createProject(
  tenantId: string,
  actorId: string,
  input: CreateProjectInput,
): Promise<ProjectDto> {
  const created = await prisma.$transaction(async (tx) => {
    const p = await tx.project.create({
      data: {
        tenantId,
        code: input.code,
        nameTh: input.nameTh,
        nameEn: input.nameEn ?? null,
        fiscalYear: input.fiscalYear,
        strategicPlan: input.strategicPlan ?? null,
        budgetSource: input.budgetSource,
        allocatedBudget: input.allocatedBudget,
        spentBudget: 0,
        responsiblePersonId: input.responsiblePersonId,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
        status: "PLANNED",
        description: input.description ?? null,
        kpis: {
          create: input.kpis.map((k) => ({
            indicatorName: k.indicatorName,
            targetValue: k.targetValue,
            actualValue: 0,
            unit: k.unit,
            status: "PENDING",
          })),
        },
      },
      include: {
        responsiblePerson: { select: { id: true, name: true, email: true } },
        kpis: true,
        expenses: { include: { recordedBy: { select: { id: true, name: true } } } },
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId,
        action: "project.create",
        entity: "projects",
        entityId: p.id,
        after: { code: p.code, nameTh: p.nameTh, allocatedBudget: input.allocatedBudget },
      },
      tx,
    );

    return p;
  });

  return {
    id: created.id,
    tenantId: created.tenantId,
    code: created.code,
    nameTh: created.nameTh,
    nameEn: created.nameEn,
    fiscalYear: created.fiscalYear,
    strategicPlan: created.strategicPlan,
    budgetSource: created.budgetSource,
    allocatedBudget: Number(created.allocatedBudget),
    spentBudget: 0,
    remainingBudget: Number(created.allocatedBudget),
    executionRate: 0,
    responsiblePersonId: created.responsiblePersonId,
    responsiblePersonName: created.responsiblePerson.name,
    responsiblePersonEmail: created.responsiblePerson.email,
    startDate: created.startDate.toISOString().split("T")[0],
    endDate: created.endDate.toISOString().split("T")[0],
    status: created.status,
    description: created.description,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
    kpis: created.kpis.map((k) => ({
      id: k.id,
      projectId: k.projectId,
      indicatorName: k.indicatorName,
      targetValue: Number(k.targetValue),
      actualValue: Number(k.actualValue),
      unit: k.unit,
      status: k.status,
    })),
    expenses: [],
  };
}

export async function updateProject(
  tenantId: string,
  actorId: string,
  input: UpdateProjectInput,
): Promise<void> {
  const p = await prisma.project.findUnique({
    where: { id: input.id, tenantId },
  });
  if (!p) throw new Error("Project not found");

  await prisma.$transaction(async (tx) => {
    await tx.project.update({
      where: { id: input.id },
      data: {
        nameTh: input.nameTh,
        nameEn: input.nameEn ?? null,
        fiscalYear: input.fiscalYear,
        strategicPlan: input.strategicPlan ?? null,
        budgetSource: input.budgetSource,
        allocatedBudget: input.allocatedBudget,
        status: input.status,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
        description: input.description ?? null,
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId,
        action: "project.update",
        entity: "projects",
        entityId: input.id,
        before: { nameTh: p.nameTh, allocatedBudget: p.allocatedBudget, status: p.status },
        after: { nameTh: input.nameTh, allocatedBudget: input.allocatedBudget, status: input.status },
      },
      tx,
    );
  });
}

export async function addProjectExpense(
  tenantId: string,
  actorId: string,
  input: AddProjectExpenseInput,
): Promise<void> {
  const p = await prisma.project.findUnique({
    where: { id: input.projectId, tenantId },
  });
  if (!p) throw new Error("Project not found");

  await prisma.$transaction(async (tx) => {
    await tx.projectExpense.create({
      data: {
        projectId: input.projectId,
        title: input.title,
        amount: input.amount,
        expenseDate: new Date(input.expenseDate),
        receiptRef: input.receiptRef ?? null,
        recordedById: actorId,
      },
    });

    // Recalculate total spentBudget
    const expenses = await tx.projectExpense.findMany({
      where: { projectId: input.projectId },
      select: { amount: true },
    });
    const newSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    await tx.project.update({
      where: { id: input.projectId },
      data: {
        spentBudget: newSpent,
        status: p.status === "PLANNED" ? "IN_PROGRESS" : p.status,
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId,
        action: "project.add_expense",
        entity: "project_expenses",
        entityId: input.projectId,
        after: { title: input.title, amount: input.amount, newSpentBudget: newSpent },
      },
      tx,
    );
  });
}

export async function deleteProjectExpense(
  tenantId: string,
  actorId: string,
  input: DeleteProjectExpenseInput,
): Promise<void> {
  const exp = await prisma.projectExpense.findUnique({
    where: { id: input.id, projectId: input.projectId },
    include: { project: true },
  });
  if (!exp || exp.project.tenantId !== tenantId) throw new Error("Expense not found");

  await prisma.$transaction(async (tx) => {
    await tx.projectExpense.delete({ where: { id: input.id } });

    const expenses = await tx.projectExpense.findMany({
      where: { projectId: input.projectId },
      select: { amount: true },
    });
    const newSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    await tx.project.update({
      where: { id: input.projectId },
      data: { spentBudget: newSpent },
    });

    await writeAudit(
      {
        tenantId,
        actorId,
        action: "project.delete_expense",
        entity: "project_expenses",
        entityId: input.id,
        before: { amount: exp.amount, title: exp.title },
      },
      tx,
    );
  });
}

export async function addProjectKpi(
  tenantId: string,
  actorId: string,
  input: AddProjectKpiInput,
): Promise<void> {
  const p = await prisma.project.findUnique({
    where: { id: input.projectId, tenantId },
  });
  if (!p) throw new Error("Project not found");

  await prisma.$transaction(async (tx) => {
    const kpi = await tx.projectKpi.create({
      data: {
        projectId: input.projectId,
        indicatorName: input.indicatorName,
        targetValue: input.targetValue,
        actualValue: 0,
        unit: input.unit,
        status: "PENDING",
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId,
        action: "project.add_kpi",
        entity: "project_kpis",
        entityId: kpi.id,
        after: { indicatorName: input.indicatorName, targetValue: input.targetValue },
      },
      tx,
    );
  });
}

export async function updateProjectKpi(
  tenantId: string,
  actorId: string,
  input: UpdateProjectKpiInput,
): Promise<void> {
  const kpi = await prisma.projectKpi.findUnique({
    where: { id: input.id },
    include: { project: true },
  });
  if (!kpi || kpi.project.tenantId !== tenantId) throw new Error("KPI not found");

  await prisma.$transaction(async (tx) => {
    await tx.projectKpi.update({
      where: { id: input.id },
      data: {
        actualValue: input.actualValue,
        status: input.status,
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId,
        action: "project.update_kpi",
        entity: "project_kpis",
        entityId: input.id,
        before: { actualValue: kpi.actualValue, status: kpi.status },
        after: { actualValue: input.actualValue, status: input.status },
      },
      tx,
    );
  });
}
