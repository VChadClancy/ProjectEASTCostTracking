import { describe, it, expect } from "vitest";
import { StatusBadge } from "../StatusBadge";

const variants = ["success", "warning", "danger", "info", "neutral", "ai"] as const;

describe("StatusBadge", () => {
  it("should export StatusBadge as a function", () => {
    expect(typeof StatusBadge).toBe("function");
  });
  variants.forEach((variant) => {
    it(`supports variant: ${variant}`, () => {
      const el = StatusBadge({ variant, children: variant });
      expect(el).toBeDefined();
      if (el && typeof el === "object" && "props" in el && el.props) {
        expect(el.props["data-variant"]).toBe(variant);
      }
    });
  });
});
