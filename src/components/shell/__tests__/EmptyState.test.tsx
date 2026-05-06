import { describe, it, expect } from "vitest";
import { EmptyState } from "../EmptyState";

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

describe("EmptyState", () => {
  it("should export EmptyState as a function", () => {
    expect(typeof EmptyState).toBe("function");
  });
  it("accepts title and description", () => {
    const el = EmptyState({ title: "No Data", description: "Nothing here" });
    expect(el).toBeDefined();
    expect(hasChildText(el, "No Data")).toBe(true);
    expect(hasChildText(el, "Nothing here")).toBe(true);
  });
});
