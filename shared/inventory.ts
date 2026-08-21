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

export type InventoryReceiptLink = { purchaseInvoiceId: number | null; reference?: string | null };

export type ContractQuantityLine = { contractedQty: string | number | null; receivedQty: string | number | null };

export function remainingContractQuantity(line: ContractQuantityLine) {
  return Math.max(0, Number(line.contractedQty || 0) - Number(line.receivedQty || 0));
}

export function canReceiveContractQuantity(line: ContractQuantityLine, requestedQty: string | number) {
  return Number(requestedQty || 0) <= remainingContractQuantity(line) + 0.0005;
}

export function calculateServiceEntryTotal(input: { entryType: "equipment_rental" | "labor_supply"; quantity?: number; rentalDays?: number; dailyRate?: number; headcount?: number; workDays?: number; dailyWage?: number }) {
  const total = input.entryType === "equipment_rental"
    ? Number(input.quantity || 0) * Number(input.rentalDays || 0) * Number(input.dailyRate || 0)
    : Number(input.headcount || 0) * Number(input.workDays || 0) * Number(input.dailyWage || 0);
  return Number(total.toFixed(2));
}

export function remainingServiceContractAmount(contractTotal: number, postedAmounts: number[]) {
  return Math.max(0, Number(contractTotal || 0) - postedAmounts.reduce((sum, amount) => sum + Number(amount || 0), 0));
}

export function selectPurchaseInvoiceForIssue(receipts: InventoryReceiptLink[]) {
  return receipts.find((receipt) => Boolean(receipt.purchaseInvoiceId))?.purchaseInvoiceId ?? null;
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

export function calculateMaterialReceiptCost(quantity: string | number | null | undefined, unitCost: string | number | null | undefined) {
  return Number((Number(quantity || 0) * Number(unitCost || 0)).toFixed(2));
}

export function materialReceiptExpenseReference(movementId: number) {
  return `INV-RECEIPT-${movementId}`;
}

export function isMaterialContractType(contractType: string | null | undefined) {
  return contractType === "supply" || contractType === "supply_installation";
}
