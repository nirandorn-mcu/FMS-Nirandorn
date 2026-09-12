import { prisma } from "@/shared/lib/infra/prisma";
import type {
  CurriculumInput,
  UpdateCurriculumInput,
  SubjectInput,
  UpdateSubjectInput,
  AssignSubjectInput,
  DepartmentInput,
  UpdateDepartmentInput,
} from "./validations";

export interface DepartmentDto {
  id: string;
  tenantId: string;
  code: string;
  nameTh: string;
  nameEn: string;
  description: string | null;
  status: string;
  curriculumCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CurriculumDto {
  id: string;
  tenantId: string;
  departmentId: string | null;
  code: string;
  nameTh: string;
  nameEn: string;
  degreeTh: string | null;
  degreeEn: string | null;
  faculty: string | null;
  totalCredits: number;
  revisionYear: number;
  status: string;
  subjectCount: number;
  durationYears?: number | null;
  studyType?: string | null;
  campusLocation?: string | null;
  philosophy?: string | null;
  objectives?: string | null;
  careerPaths?: string | null;
  admissionReq?: string | null;
  tuitionFees?: string | null;
  graduationCriteria?: string | null;
  plos?: unknown;
  department?: {
    id: string;
    code: string;
    nameTh: string;
    nameEn: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectDto {
  id: string;
  tenantId: string;
  code: string;
  nameTh: string;
  nameEn: string;
  credits: number;
  creditInfo: string | null;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurriculumSubjectDto {
  id: string;
  curriculumId: string;
  subjectId: string;
  category: string;
  isCompulsory: boolean;
  createdAt: string;
  subject: SubjectDto;
}

export interface CurriculumDetailDto extends CurriculumDto {
  subjects: CurriculumSubjectDto[];
}

export interface CurriculumStatsDto {
  totalCurriculums: number;
  activeCurriculums: number;
  totalSubjects: number;
  activeSubjects: number;
  totalDepartments: number;
  avgCredits: number;
}

export async function getCurriculumStats(tenantId: string): Promise<CurriculumStatsDto> {
  const [totalCurriculums, activeCurriculums, totalSubjects, activeSubjects, totalDepartments, avgCreditsAgg] =
    await Promise.all([
      prisma.curriculum.count({ where: { tenantId } }),
      prisma.curriculum.count({ where: { tenantId, status: "ACTIVE" } }),
      prisma.subject.count({ where: { tenantId } }),
      prisma.subject.count({ where: { tenantId, status: "ACTIVE" } }),
      prisma.department.count({ where: { tenantId } }),
      prisma.curriculum.aggregate({
        where: { tenantId },
        _avg: { totalCredits: true },
      }),
    ]);

  return {
    totalCurriculums,
    activeCurriculums,
    totalSubjects,
    activeSubjects,
    totalDepartments,
    avgCredits: Math.round(avgCreditsAgg._avg.totalCredits ?? 0),
  };
}

export async function listCurriculums(tenantId: string): Promise<CurriculumDto[]> {
  const rows = await prisma.curriculum.findMany({
    where: { tenantId },
    include: {
      department: {
        select: { id: true, code: true, nameTh: true, nameEn: true },
      },
      _count: {
        select: { subjects: true },
      },
    },
    orderBy: [{ revisionYear: "desc" }, { code: "asc" }],
  });

  return rows.map((r) => ({
    id: r.id,
    tenantId: r.tenantId,
    departmentId: r.departmentId,
    code: r.code,
    nameTh: r.nameTh,
    nameEn: r.nameEn,
    degreeTh: r.degreeTh,
    degreeEn: r.degreeEn,
    faculty: r.faculty,
    totalCredits: r.totalCredits,
    revisionYear: r.revisionYear,
    status: r.status,
    subjectCount: r._count.subjects,
    durationYears: r.durationYears,
    studyType: r.studyType,
    campusLocation: r.campusLocation,
    philosophy: r.philosophy,
    objectives: r.objectives,
    careerPaths: r.careerPaths,
    admissionReq: r.admissionReq,
    tuitionFees: r.tuitionFees,
    graduationCriteria: r.graduationCriteria,
    plos: r.plos,
    department: r.department,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

export async function getCurriculumDetail(
  tenantId: string,
  id: string
): Promise<CurriculumDetailDto | null> {
  const r = await prisma.curriculum.findUnique({
    where: { id, tenantId },
    include: {
      department: {
        select: { id: true, code: true, nameTh: true, nameEn: true },
      },
      subjects: {
        include: {
          subject: true,
        },
        orderBy: [{ category: "asc" }, { isCompulsory: "desc" }],
      },
      _count: {
        select: { subjects: true },
      },
    },
  });

  if (!r) return null;

  return {
    id: r.id,
    tenantId: r.tenantId,
    departmentId: r.departmentId,
    code: r.code,
    nameTh: r.nameTh,
    nameEn: r.nameEn,
    degreeTh: r.degreeTh,
    degreeEn: r.degreeEn,
    faculty: r.faculty,
    totalCredits: r.totalCredits,
    revisionYear: r.revisionYear,
    status: r.status,
    subjectCount: r._count.subjects,
    durationYears: r.durationYears,
    studyType: r.studyType,
    campusLocation: r.campusLocation,
    philosophy: r.philosophy,
    objectives: r.objectives,
    careerPaths: r.careerPaths,
    admissionReq: r.admissionReq,
    tuitionFees: r.tuitionFees,
    graduationCriteria: r.graduationCriteria,
    plos: r.plos,
    department: r.department,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    subjects: r.subjects.map((cs) => ({
      id: cs.id,
      curriculumId: cs.curriculumId,
      subjectId: cs.subjectId,
      category: cs.category ?? "หมวดวิชาอื่นๆ",
      isCompulsory: cs.isCompulsory,
      createdAt: cs.createdAt.toISOString(),
      subject: {
        id: cs.subject.id,
        tenantId: cs.subject.tenantId,
        code: cs.subject.code,
        nameTh: cs.subject.nameTh,
        nameEn: cs.subject.nameEn,
        credits: cs.subject.credits,
        creditInfo: cs.subject.creditInfo,
        description: cs.subject.description,
        status: cs.subject.status,
        createdAt: cs.subject.createdAt.toISOString(),
        updatedAt: cs.subject.updatedAt.toISOString(),
      },
    })),
  };
}

export async function createCurriculum(
  tenantId: string,
  input: CurriculumInput
): Promise<CurriculumDto> {
  const created = await prisma.curriculum.create({
    data: {
      tenantId,
      departmentId: input.departmentId ?? null,
      code: input.code,
      nameTh: input.nameTh,
      nameEn: input.nameEn,
      degreeTh: input.degreeTh ?? null,
      degreeEn: input.degreeEn ?? null,
      faculty: input.faculty ?? null,
      totalCredits: input.totalCredits,
      revisionYear: input.revisionYear,
      status: input.status,
      durationYears: input.durationYears ?? 4,
      studyType: input.studyType ?? null,
      campusLocation: input.campusLocation ?? null,
      philosophy: input.philosophy ?? null,
      objectives: input.objectives ?? null,
      careerPaths: input.careerPaths ?? null,
      admissionReq: input.admissionReq ?? null,
      tuitionFees: input.tuitionFees ?? null,
      graduationCriteria: input.graduationCriteria ?? null,
      plos: input.plos ?? [],
    },
    include: {
      department: {
        select: { id: true, code: true, nameTh: true, nameEn: true },
      },
    },
  });

  return {
    id: created.id,
    tenantId: created.tenantId,
    departmentId: created.departmentId,
    code: created.code,
    nameTh: created.nameTh,
    nameEn: created.nameEn,
    degreeTh: created.degreeTh,
    degreeEn: created.degreeEn,
    faculty: created.faculty,
    totalCredits: created.totalCredits,
    revisionYear: created.revisionYear,
    status: created.status,
    subjectCount: 0,
    durationYears: created.durationYears,
    studyType: created.studyType,
    campusLocation: created.campusLocation,
    philosophy: created.philosophy,
    objectives: created.objectives,
    careerPaths: created.careerPaths,
    admissionReq: created.admissionReq,
    tuitionFees: created.tuitionFees,
    graduationCriteria: created.graduationCriteria,
    plos: created.plos,
    department: created.department,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };
}

export async function updateCurriculum(
  tenantId: string,
  input: UpdateCurriculumInput
): Promise<CurriculumDto> {
  const updated = await prisma.curriculum.update({
    where: { id: input.id, tenantId },
    data: {
      departmentId: input.departmentId ?? null,
      code: input.code,
      nameTh: input.nameTh,
      nameEn: input.nameEn,
      degreeTh: input.degreeTh ?? null,
      degreeEn: input.degreeEn ?? null,
      faculty: input.faculty ?? null,
      totalCredits: input.totalCredits,
      revisionYear: input.revisionYear,
      status: input.status,
      durationYears: input.durationYears ?? 4,
      studyType: input.studyType ?? null,
      campusLocation: input.campusLocation ?? null,
      philosophy: input.philosophy ?? null,
      objectives: input.objectives ?? null,
      careerPaths: input.careerPaths ?? null,
      admissionReq: input.admissionReq ?? null,
      tuitionFees: input.tuitionFees ?? null,
      graduationCriteria: input.graduationCriteria ?? null,
      plos: input.plos ?? [],
    },
    include: {
      department: {
        select: { id: true, code: true, nameTh: true, nameEn: true },
      },
      _count: {
        select: { subjects: true },
      },
    },
  });

  return {
    id: updated.id,
    tenantId: updated.tenantId,
    departmentId: updated.departmentId,
    code: updated.code,
    nameTh: updated.nameTh,
    nameEn: updated.nameEn,
    degreeTh: updated.degreeTh,
    degreeEn: updated.degreeEn,
    faculty: updated.faculty,
    totalCredits: updated.totalCredits,
    revisionYear: updated.revisionYear,
    status: updated.status,
    subjectCount: updated._count.subjects,
    durationYears: updated.durationYears,
    studyType: updated.studyType,
    campusLocation: updated.campusLocation,
    philosophy: updated.philosophy,
    objectives: updated.objectives,
    careerPaths: updated.careerPaths,
    admissionReq: updated.admissionReq,
    tuitionFees: updated.tuitionFees,
    graduationCriteria: updated.graduationCriteria,
    plos: updated.plos,
    department: updated.department,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function deleteCurriculum(tenantId: string, id: string): Promise<void> {
  await prisma.curriculum.delete({
    where: { id, tenantId },
  });
}

// ----------------------------------------------------
// Department Services
// ----------------------------------------------------
export async function listDepartments(tenantId: string): Promise<DepartmentDto[]> {
  const rows = await prisma.department.findMany({
    where: { tenantId },
    include: {
      _count: {
        select: { curriculums: true },
      },
    },
    orderBy: { code: "asc" },
  });

  return rows.map((d) => ({
    id: d.id,
    tenantId: d.tenantId,
    code: d.code,
    nameTh: d.nameTh,
    nameEn: d.nameEn,
    description: d.description,
    status: d.status,
    curriculumCount: d._count.curriculums,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  }));
}

export async function createDepartment(
  tenantId: string,
  input: DepartmentInput
): Promise<DepartmentDto> {
  const created = await prisma.department.create({
    data: {
      tenantId,
      code: input.code,
      nameTh: input.nameTh,
      nameEn: input.nameEn,
      description: input.description ?? null,
      status: input.status,
    },
  });

  return {
    id: created.id,
    tenantId: created.tenantId,
    code: created.code,
    nameTh: created.nameTh,
    nameEn: created.nameEn,
    description: created.description,
    status: created.status,
    curriculumCount: 0,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };
}

export async function updateDepartment(
  tenantId: string,
  input: UpdateDepartmentInput
): Promise<DepartmentDto> {
  const updated = await prisma.department.update({
    where: { id: input.id, tenantId },
    data: {
      code: input.code,
      nameTh: input.nameTh,
      nameEn: input.nameEn,
      description: input.description ?? null,
      status: input.status,
    },
    include: {
      _count: {
        select: { curriculums: true },
      },
    },
  });

  return {
    id: updated.id,
    tenantId: updated.tenantId,
    code: updated.code,
    nameTh: updated.nameTh,
    nameEn: updated.nameEn,
    description: updated.description,
    status: updated.status,
    curriculumCount: updated._count.curriculums,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function deleteDepartment(tenantId: string, id: string): Promise<void> {
  await prisma.department.delete({
    where: { id, tenantId },
  });
}

// ----------------------------------------------------
// Subject Services
// ----------------------------------------------------
export async function listSubjects(tenantId: string): Promise<SubjectDto[]> {
  const rows = await prisma.subject.findMany({
    where: { tenantId },
    orderBy: { code: "asc" },
  });

  return rows.map((s) => ({
    id: s.id,
    tenantId: s.tenantId,
    code: s.code,
    nameTh: s.nameTh,
    nameEn: s.nameEn,
    credits: s.credits,
    creditInfo: s.creditInfo,
    description: s.description,
    status: s.status,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));
}

export async function createSubject(
  tenantId: string,
  input: SubjectInput
): Promise<SubjectDto> {
  const created = await prisma.subject.create({
    data: {
      tenantId,
      code: input.code,
      nameTh: input.nameTh,
      nameEn: input.nameEn,
      credits: input.credits,
      creditInfo: input.creditInfo ?? null,
      description: input.description ?? null,
      status: input.status,
    },
  });

  return {
    id: created.id,
    tenantId: created.tenantId,
    code: created.code,
    nameTh: created.nameTh,
    nameEn: created.nameEn,
    credits: created.credits,
    creditInfo: created.creditInfo,
    description: created.description,
    status: created.status,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  };
}

export async function updateSubject(
  tenantId: string,
  input: UpdateSubjectInput
): Promise<SubjectDto> {
  const updated = await prisma.subject.update({
    where: { id: input.id, tenantId },
    data: {
      code: input.code,
      nameTh: input.nameTh,
      nameEn: input.nameEn,
      credits: input.credits,
      creditInfo: input.creditInfo ?? null,
      description: input.description ?? null,
      status: input.status,
    },
  });

  return {
    id: updated.id,
    tenantId: updated.tenantId,
    code: updated.code,
    nameTh: updated.nameTh,
    nameEn: updated.nameEn,
    credits: updated.credits,
    creditInfo: updated.creditInfo,
    description: updated.description,
    status: updated.status,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function deleteSubject(tenantId: string, id: string): Promise<void> {
  await prisma.subject.delete({
    where: { id, tenantId },
  });
}

export async function assignSubjectToCurriculum(
  tenantId: string,
  input: AssignSubjectInput
): Promise<void> {
  // Ensure curriculum belongs to tenant
  const curriculum = await prisma.curriculum.findUnique({
    where: { id: input.curriculumId, tenantId },
  });
  if (!curriculum) throw new Error("Curriculum not found");

  // Ensure subject belongs to tenant
  const subject = await prisma.subject.findUnique({
    where: { id: input.subjectId, tenantId },
  });
  if (!subject) throw new Error("Subject not found");

  await prisma.curriculumSubject.upsert({
    where: {
      curriculumId_subjectId: {
        curriculumId: input.curriculumId,
        subjectId: input.subjectId,
      },
    },
    update: {
      category: input.category,
      isCompulsory: input.isCompulsory,
    },
    create: {
      curriculumId: input.curriculumId,
      subjectId: input.subjectId,
      category: input.category,
      isCompulsory: input.isCompulsory,
    },
  });
}

export async function removeSubjectFromCurriculum(
  tenantId: string,
  curriculumId: string,
  subjectId: string
): Promise<void> {
  // Ensure curriculum belongs to tenant
  const curriculum = await prisma.curriculum.findUnique({
    where: { id: curriculumId, tenantId },
  });
  if (!curriculum) throw new Error("Curriculum not found");

  await prisma.curriculumSubject.deleteMany({
    where: {
      curriculumId,
      subjectId,
    },
  });
}
