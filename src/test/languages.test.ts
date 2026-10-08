import { describe, expect, it } from "vitest";
import { isLanguage, LOCALES } from "@/lib/translations";

describe("Supported interface languages", () => {
  it("accepts English", () => { expect(isLanguage("en")).toBe(true); expect(LOCALES.en).toBe("en-IN"); });
  it("accepts Hindi", () => { expect(isLanguage("hi")).toBe(true); expect(LOCALES.hi).toBe("hi-IN"); });
  it("accepts Telugu", () => { expect(isLanguage("te")).toBe(true); expect(LOCALES.te).toBe("te-IN"); });
  it("rejects unsupported or corrupt saved preferences", () => {
    for (const value of ["fr", "", null, undefined, 42]) expect(isLanguage(value)).toBe(false);
  });
});