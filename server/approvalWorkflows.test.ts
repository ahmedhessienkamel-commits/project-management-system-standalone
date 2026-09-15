import { describe, expect, it } from "vitest";
import { MOSTAFA_USER_ID, canReviewCertificateApproval, getCertificateInitialApproval, nextCertificateApproval, nextMaterialRequisitionApproval, requiresCostItemForMaterialRequisition } from "../shared/approvalWorkflows";

describe("certificate approval workflow", () => {
  it("starts every certificate at the owner approval stage", () => {
    expect(getCertificateInitialApproval(99)).toEqual({ approvalStage: "owner", stageOrder: 1 });
    expect(getCertificateInitialApproval(MOSTAFA_USER_ID)).toEqual({ approvalStage: "owner", stageOrder: 1 });
  });

  it("restricts certificate approval and final signature to their designated roles", () => {
    expect(canReviewCertificateApproval("owner", { id: 1, role: "admin" })).toBe(true);
    expect(canReviewCertificateApproval("owner", { id: 3, role: "general_manager" })).toBe(false);
    expect(canReviewCertificateApproval("general_manager", { id: 3, role: "general_manager" })).toBe(true);
    expect(canReviewCertificateApproval("general_manager", { id: MOSTAFA_USER_ID, role: "user" })).toBe(false);
    expect(canReviewCertificateApproval("project_manager", { id: 2, role: "project_manager" })).toBe(false);
  });

  it("routes owner approval directly to the general manager for final signature", () => {
    expect(nextCertificateApproval(1)).toEqual({ approvalStage: "general_manager", stageOrder: 2 });
    expect(nextCertificateApproval(2)).toBeNull();
  });
});

describe("material requisition workflow", () => {
  it("requires Mostafa, then owner, then project manager as the final decision", () => {
    expect(nextMaterialRequisitionApproval("mostafa")).toEqual({ approvalStage: "owner", stageOrder: 2 });
    expect(nextMaterialRequisitionApproval("owner")).toEqual({ approvalStage: "project_manager", stageOrder: 3 });
    expect(nextMaterialRequisitionApproval("project_manager")).toBeNull();
  });

  it("requires the owner to assign a cost item only when approving the request", () => {
    expect(requiresCostItemForMaterialRequisition("owner", "approved")).toBe(true);
    expect(requiresCostItemForMaterialRequisition("owner", "rejected")).toBe(false);
    expect(requiresCostItemForMaterialRequisition("mostafa", "approved")).toBe(false);
    expect(requiresCostItemForMaterialRequisition("project_manager", "approved")).toBe(false);
  });
});
