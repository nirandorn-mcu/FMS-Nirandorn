import "server-only";

export {
  listDocuments,
  getDocumentById,
  getDocumentStats,
  type DocumentDto,
  type DocumentWorkflowStepDto,
  type DocumentCommentDto,
  type DocumentStatsDto,
} from "./_internal/services";
export { DOC_P, DOC_PERMISSIONS } from "./permissions";
