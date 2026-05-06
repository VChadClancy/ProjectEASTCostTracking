import { describe, it, expect } from "vitest";
import { CapabilityChip } from "../CapabilityChip";

function hasChildText(node: unknown, text: string): boolean {
  if (typeof node === "string") return node === text;
  if (Array.isArray(node)) return node.some((n) => hasChildText(n, text));
  if (
    node &&
    typeof node === "object" &&
    (node as any).props &&
    typeof (node as any).props === "object" &&
    (node as any).props.children !== undefined
  ) {
    return hasChildText((node as any).props.children, text);
  }
  return false;
}

describe("CapabilityChip", () => {
  it("should export CapabilityChip as a function", () => {
    expect(typeof CapabilityChip).toBe("function");
  });
  it("renders label", () => {
    const el = CapabilityChip({ label: "Coming Soon" });
    expect(el).toBeDefined();
    expect(hasChildText(el, "Coming Soon")).toBe(true);
  });
});
