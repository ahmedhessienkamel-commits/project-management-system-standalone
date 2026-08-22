import { describe, expect, it } from "vitest";
import { MOSTAFA_USER_ID, canReviewCertificateApproval, getCertificateInitialApproval, nextCertificateApproval } from "../shared/approvalWorkflows";

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
