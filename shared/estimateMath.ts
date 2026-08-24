export type EstimateLineNumbers = {
  quantity: number;
  materialCost: number;
  laborCost: number;
  equipmentCost: number;
  otherCost: number;
  unitRate: number;
};

export function calculateEstimateLine(line: EstimateLineNumbers) {
  const unitRate = line.unitRate || line.materialCost + line.laborCost + line.equipmentCost + line.otherCost;
  return { unitRate, totalCost: line.quantity * unitRate };
}

export function calculateEstimateTotal(lines: EstimateLineNumbers[]) {
  return lines.reduce((total, line) => total + calculateEstimateLine(line).totalCost, 0);
}
