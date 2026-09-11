import { requirePermission, hasPermission } from "@/features/identity/server";
import {
  DOC_P,
  listDocuments,
  getDocumentStats,
} from "@/features/document-flow/server";
import { DocumentsClient } from "./_components/documents-client";

export default async function DocumentsPage() {
  const ctx = await requirePermission(DOC_P.docRead);

  const [initialDocuments, initialStats] = await Promise.all([
    listDocuments(ctx.tenantId),
    getDocumentStats(ctx.tenantId),
  ]);

  return (
    <DocumentsClient
      initialDocuments={initialDocuments}
      initialStats={initialStats}
      currentUserId={ctx.userId}
      canCreate={hasPermission(ctx, DOC_P.docCreate)}
      canApprove={hasPermission(ctx, DOC_P.docApprove)}
      canManage={hasPermission(ctx, DOC_P.docManage)}
    />
  );
}
