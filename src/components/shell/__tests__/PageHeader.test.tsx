import { describe, it, expect } from "vitest";
import { PageHeader } from "../PageHeader";

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

describe("PageHeader", () => {
  it("should export PageHeader as a function", () => {
    expect(typeof PageHeader).toBe("function");
  });
  it("accepts title and description props", () => {
    const el = PageHeader({ title: "Test Title", description: "Test Desc" });
    expect(el).toBeDefined();
    expect(hasChildText(el, "Test Title")).toBe(true);
    expect(hasChildText(el, "Test Desc")).toBe(true);
  });
});
