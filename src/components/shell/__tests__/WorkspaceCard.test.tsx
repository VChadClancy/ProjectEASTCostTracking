import { describe, it, expect } from "vitest";
import { WorkspaceCard } from "../WorkspaceCard";

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

describe("WorkspaceCard", () => {
  it("should export WorkspaceCard as a function", () => {
    expect(typeof WorkspaceCard).toBe("function");
  });
  it("accepts children", () => {
    const el = WorkspaceCard({ title: "Card", children: "Child" });
    expect(el).toBeDefined();
    expect(hasChildText(el, "Child")).toBe(true);
  });
});
