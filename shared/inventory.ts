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
