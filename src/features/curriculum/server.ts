import "server-only";

export {
  getCurriculumStats,
  listCurriculums,
  getCurriculumDetail,
  listSubjects,
  listDepartments,
  type CurriculumDto,
  type CurriculumDetailDto,
  type CurriculumSubjectDto,
  type CurriculumStatsDto,
  type SubjectDto,
  type DepartmentDto,
} from "./_internal/services";

export { P as CURRICULUM_P, CURRICULUM_PERMISSIONS } from "./permissions";
