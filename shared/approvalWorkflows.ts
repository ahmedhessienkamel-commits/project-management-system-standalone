export const MOSTAFA_USER_ID = 13170001;

export type CertificateApprovalStage = "mostafa" | "owner" | "project_manager" | "general_manager";

export function getCertificateInitialApproval(creatorId: number) {
  return creatorId === MOSTAFA_USER_ID
    ? { approvalStage: "owner" as const, stageOrder: 2 }
    : { approvalStage: "mostafa" as const, stageOrder: 1 };
}

export function canReviewCertificateApproval(stage: string | null | undefined, user: { id: number; role: string }) {
  if (stage === "mostafa") return user.id === MOSTAFA_USER_ID;
  if (stage === "owner") return user.role === "admin";
  if (stage === "project_manager") return user.role === "project_manager";
  if (stage === "general_manager") return user.role === "general_manager";
  return false;
}

export function nextCertificateApproval(stageOrder: number | null | undefined) {
  if (stageOrder === 1) return { approvalStage: "owner" as const, stageOrder: 2 };
  if (stageOrder === 2) return { approvalStage: "project_manager" as const, stageOrder: 3 };
  if (stageOrder === 3) return { approvalStage: "general_manager" as const, stageOrder: 4 };
  return null;
}

export function nextMaterialRequisitionApproval(stage: string | null | undefined) {
  if (stage === "mostafa") return { approvalStage: "owner" as const, stageOrder: 2 };
  if (stage === "owner") return { approvalStage: "project_manager" as const, stageOrder: 3 };
  return null;
}

export function requiresCostItemForMaterialRequisition(stage: string | null | undefined, decision: "approved" | "rejected") {
  return stage === "owner" && decision === "approved";
}
