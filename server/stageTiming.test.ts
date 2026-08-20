import { describe, expect, it } from "vitest";
import { calculateStageTimeVariance } from "../shared/stageTiming";

describe("stage timing variance", () => {
  const now = new Date("2026-08-20T00:00:00.000Z");

  it("marks an ongoing stage as delayed after its planned end", () => {
    expect(calculateStageTimeVariance("2026-08-17T00:00:00.000Z", "active", now)).toEqual({ timeVarianceDays: 3, timeStatus: "delayed" });
  });

  it("does not mark a manually completed stage as delayed", () => {
    expect(calculateStageTimeVariance("2026-08-17T00:00:00.000Z", "completed", now)).toEqual({ timeVarianceDays: 0, timeStatus: "completed" });
  });

  it("keeps an ongoing stage on time before its planned end", () => {
    expect(calculateStageTimeVariance("2026-08-22T00:00:00.000Z", "active", now)).toEqual({ timeVarianceDays: 0, timeStatus: "on_time" });
  });
});
