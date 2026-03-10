import { describe, it, expect } from "vitest";
import { signUpSchema, signInSchema } from "./auth";

describe("signInSchema", () => {
  it("accepts valid email and password", () => {
    const result = signInSchema.safeParse({ email: "user@test.com", password: "abc" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = signInSchema.safeParse({ email: "not-an-email", password: "abc" });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = signInSchema.safeParse({ email: "user@test.com", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("signUpSchema", () => {
  const valid = {
    username: "testuser",
    email: "user@test.com",
    password: "Password1",
    confirmPassword: "Password1",
  };

  it("accepts valid input", () => {
    const result = signUpSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects username shorter than 3 chars", () => {
    const result = signUpSchema.safeParse({ ...valid, username: "ab" });
    expect(result.success).toBe(false);
  });

  it("rejects username longer than 20 chars", () => {
    const result = signUpSchema.safeParse({ ...valid, username: "a".repeat(21) });
    expect(result.success).toBe(false);
  });

  it("rejects username with special characters", () => {
    const result = signUpSchema.safeParse({ ...valid, username: "user@name" });
    expect(result.success).toBe(false);
  });

  it("allows underscores in username", () => {
    const result = signUpSchema.safeParse({ ...valid, username: "test_user" });
    expect(result.success).toBe(true);
  });

  it("rejects password without uppercase letter", () => {
    const result = signUpSchema.safeParse({ ...valid, password: "password1", confirmPassword: "password1" });
    expect(result.success).toBe(false);
  });

  it("rejects password without number", () => {
    const result = signUpSchema.safeParse({ ...valid, password: "Password", confirmPassword: "Password" });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 8 chars", () => {
    const result = signUpSchema.safeParse({ ...valid, password: "Pass1", confirmPassword: "Pass1" });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched passwords", () => {
    const result = signUpSchema.safeParse({ ...valid, confirmPassword: "Different1" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = signUpSchema.safeParse({ ...valid, email: "bad" });
    expect(result.success).toBe(false);
  });
});
