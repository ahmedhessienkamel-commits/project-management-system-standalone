export const MOSTAFA_USER_ID = 13170001;

export type CertificateApprovalStage = "mostafa" | "owner" | "project_manager" | "general_manager";
export type ApprovalWorkflowStage = { stage: string; order: number; label: string };

export const approvalStageLabels: Record<string, string> = {
  mostafa: "مصطفى",
  owner: "المالك",
  project_manager: "مدير المشاريع",
  general_manager: "المدير العام",
};

export function getApprovalWorkflowStages(entityType: string, creatorId?: number | null): ApprovalWorkflowStage[] {
  if (entityType === "payroll" || entityType === "payroll_run") {
    return [
      { stage: "owner", order: 1, label: "المالك" },
      { stage: "general_manager", order: 2, label: "المدير العام" },
    ];
  }
  if (entityType === "certificate") {
    const startsAtMostafa = creatorId !== MOSTAFA_USER_ID;
    return (startsAtMostafa
      ? ["mostafa", "owner", "project_manager", "general_manager"]
      : ["owner", "project_manager", "general_manager"]
    ).map((stage, index) => ({ stage, order: startsAtMostafa ? index + 1 : index + 2, label: approvalStageLabels[stage] }));
  }
  if (entityType === "materialRequisition") {
    return ["mostafa", "owner", "project_manager", "general_manager"].map((stage, index) => ({ stage, order: index + 1, label: approvalStageLabels[stage] }));
  }
  if (entityType === "purchase_payment") {
    return [{ stage: "general_manager", order: 1, label: "المدير العام" }];
  }
  return [{ stage: "owner", order: 1, label: "المسؤول المعتمد" }];
}

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
  if (stage === "project_manager") return { approvalStage: "general_manager" as const, stageOrder: 4 };
  return null;
}
