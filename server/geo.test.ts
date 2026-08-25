import { describe, expect, it } from "vitest";
import { distanceMetersBetween, isWithinAllowedRadius } from "../shared/geo";

describe("work location matching", () => {
  it("returns zero for identical coordinates", () => {
    expect(distanceMetersBetween(24.7136, 46.6753, 24.7136, 46.6753)).toBeCloseTo(0, 5);
  });

  it("classifies a point against the configured radius", () => {
    const distance = distanceMetersBetween(24.7136, 46.6753, 24.7140, 46.6753);
    expect(isWithinAllowedRadius(distance, 100)).toBe(true);
    expect(isWithinAllowedRadius(distance, 10)).toBe(false);
  });
});
