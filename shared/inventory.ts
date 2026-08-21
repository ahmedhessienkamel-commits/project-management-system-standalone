export type InventoryMovementLike = {
  movementType: "receipt" | "issue" | "adjustment_in" | "adjustment_out";
  quantity: string | number | null;
  totalAmount: string | number | null;
};

export function calculateInventoryBalance(movements: InventoryMovementLike[]) {
  return movements.reduce(
    (balance, movement) => {
      const quantity = Number(movement.quantity || 0);
      const amount = Number(movement.totalAmount || 0);
      const incoming = movement.movementType === "receipt" || movement.movementType === "adjustment_in";
      return {
        received: balance.received + (incoming ? quantity : 0),
        issued: balance.issued + (incoming ? 0 : quantity),
        quantity: balance.quantity + (incoming ? quantity : -quantity),
        value: balance.value + (incoming ? amount : -amount),
      };
    },
    { received: 0, issued: 0, quantity: 0, value: 0 },
  );
}

export type InventoryApprovalStage = "mostafa" | "owner" | "complete";

export function canReviewInventoryStage(stage: InventoryApprovalStage, user: { id: number; role: string }) {
  if (stage === "mostafa") return user.role === "admin" || user.id === 13170001;
  if (stage === "owner") return user.role === "admin";
  return false;
}

export function nextInventoryApprovalStage(stage: InventoryApprovalStage, decision: "approved" | "rejected") {
  if (decision === "rejected") return "rejected" as const;
  if (stage === "mostafa") return "owner" as const;
  if (stage === "owner") return "complete" as const;
  return "complete" as const;
}

export type MaterialContractType = "building_stage" | "supply" | "supply_installation" | "equipment_rental" | "labor_supply";

export function isMaterialContractType(contractType: MaterialContractType) {
  return contractType === "supply" || contractType === "supply_installation";
}

export function getContractLineRemaining(contractedQty: number, suppliedQty: number) {
  return Math.max(0, contractedQty - suppliedQty);
}
