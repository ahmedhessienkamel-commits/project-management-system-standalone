import { describe, expect, it } from "vitest";
import { MOSTAFA_USER_ID, canReviewCertificateApproval, getApprovalWorkflowStages, getCertificateInitialApproval, nextCertificateApproval, nextMaterialRequisitionApproval } from "../shared/approvalWorkflows";

describe("certificate approval workflow", () => {
  it("sends a certificate created by Mostafa directly to the owner", () => {
    expect(getCertificateInitialApproval(MOSTAFA_USER_ID)).toEqual({ approvalStage: "owner", stageOrder: 2 });
  });

  it("sends a certificate created by another user to Mostafa first", () => {
    expect(getCertificateInitialApproval(99)).toEqual({ approvalStage: "mostafa", stageOrder: 1 });
  });

  it("restricts each certificate stage to its designated responsible role", () => {
    expect(canReviewCertificateApproval("mostafa", { id: MOSTAFA_USER_ID, role: "user" })).toBe(true);
    expect(canReviewCertificateApproval("mostafa", { id: 99, role: "admin" })).toBe(false);
    expect(canReviewCertificateApproval("owner", { id: 1, role: "admin" })).toBe(true);
    expect(canReviewCertificateApproval("project_manager", { id: 2, role: "project_manager" })).toBe(true);
    expect(canReviewCertificateApproval("general_manager", { id: 3, role: "general_manager" })).toBe(true);
    expect(canReviewCertificateApproval("general_manager", { id: MOSTAFA_USER_ID, role: "user" })).toBe(false);
  });

  it("keeps the agreed owner, project-manager, and general-manager sequence", () => {
    expect(nextCertificateApproval(1)).toEqual({ approvalStage: "owner", stageOrder: 2 });
    expect(nextCertificateApproval(2)).toEqual({ approvalStage: "project_manager", stageOrder: 3 });
    expect(nextCertificateApproval(3)).toEqual({ approvalStage: "general_manager", stageOrder: 4 });
    expect(nextCertificateApproval(4)).toBeNull();
  });
});

describe("approval tracking map", () => {
  it("builds the material requisition path in the agreed order", () => {
    expect(getApprovalWorkflowStages("materialRequisition", 99).map((step) => step.stage)).toEqual(["mostafa", "owner", "project_manager", "general_manager"]);
    expect(getApprovalWorkflowStages("materialRequisition", 99).map((step) => step.label)).toEqual(["مصطفى", "المالك", "مدير المشاريع", "المدير العام"]);
  });

  it("starts Mostafa-created certificates at the owner stage", () => {
    expect(getApprovalWorkflowStages("certificate", MOSTAFA_USER_ID)).toEqual([
      { stage: "owner", order: 2, label: "المالك" },
      { stage: "project_manager", order: 3, label: "مدير المشاريع" },
      { stage: "general_manager", order: 4, label: "المدير العام" },
    ]);
  });

  it("keeps payroll tracking limited to owner then general manager", () => {
    expect(getApprovalWorkflowStages("payroll_run", 99).map((step) => step.stage)).toEqual(["owner", "general_manager"]);
  });
});

describe("material requisition workflow", () => {
  it("requires Mostafa, then owner, then project manager, then general manager", () => {
    expect(nextMaterialRequisitionApproval("mostafa")).toEqual({ approvalStage: "owner", stageOrder: 2 });
    expect(nextMaterialRequisitionApproval("owner")).toEqual({ approvalStage: "project_manager", stageOrder: 3 });
    expect(nextMaterialRequisitionApproval("project_manager")).toEqual({ approvalStage: "general_manager", stageOrder: 4 });
    expect(nextMaterialRequisitionApproval("general_manager")).toBeNull();
  });
});
