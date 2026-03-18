import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { API_URL, ApiError, apiFetch, authHeaders } from "./api";

// ─── API_URL ──────────────────────────────────────────────────────────────────

describe("API_URL", () => {
  it("is a non-empty string", () => {
    expect(typeof API_URL).toBe("string");
    expect(API_URL.length).toBeGreaterThan(0);
  });

  it("defaults to localhost:3001 when env var is absent", () => {
    expect(API_URL).toBe("http://localhost:3001");
  });
});

// ─── ApiError ────────────────────────────────────────────────────────────────

describe("ApiError", () => {
  it("is an instance of Error", () => {
    const err = new ApiError(404, "Not Found");
    expect(err).toBeInstanceOf(Error);
  });

  it("stores the status code", () => {
    const err = new ApiError(422, "Unprocessable");
    expect(err.status).toBe(422);
  });

  it("stores the message", () => {
    const err = new ApiError(500, "Server Error");
    expect(err.message).toBe("Server Error");
  });

  it("has the class name 'ApiError'", () => {
    const err = new ApiError(400, "Bad Request");
    expect(err.constructor.name).toBe("ApiError");
  });

  it("supports different HTTP status codes", () => {
    expect(new ApiError(400, "Bad Request").status).toBe(400);
    expect(new ApiError(401, "Unauthorized").status).toBe(401);
    expect(new ApiError(403, "Forbidden").status).toBe(403);
    expect(new ApiError(404, "Not Found").status).toBe(404);
    expect(new ApiError(500, "Internal Server Error").status).toBe(500);
  });
});

// ─── authHeaders ─────────────────────────────────────────────────────────────

describe("authHeaders", () => {
  it("always includes Content-Type: application/json", () => {
    const headers = authHeaders(null) as Record<string, string>;
    expect(headers["Content-Type"]).toBe("application/json");
  });

  it("includes Authorization header when token is provided", () => {
    const headers = authHeaders("my-token") as Record<string, string>;
    expect(headers["Authorization"]).toBe("Bearer my-token");
  });

  it("omits Authorization header when token is null", () => {
    const headers = authHeaders(null) as Record<string, string>;
    expect(headers["Authorization"]).toBeUndefined();
  });

  it("works with empty string token (omits auth)", () => {
    const headers = authHeaders("") as Record<string, string>;
    // empty string is falsy — no auth header
    expect(headers["Authorization"]).toBeUndefined();
  });
});

// ─── apiFetch ─────────────────────────────────────────────────────────────────

describe("apiFetch", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns parsed JSON on a successful response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "1", name: "Alice" }),
    } as Response);

    const result = await apiFetch<{ id: string; name: string }>("/api/test");
    expect(result).toEqual({ id: "1", name: "Alice" });
  });

  it("calls fetch with the full URL composed from API_URL + path", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    await apiFetch("/api/groups");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/groups"),
      undefined,
    );
  });

  it("throws ApiError on a non-ok response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "Unauthorized" }),
    } as Response);

    await expect(apiFetch("/api/protected")).rejects.toBeInstanceOf(ApiError);
  });

  it("includes the HTTP status in the thrown ApiError", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ error: "Forbidden" }),
    } as Response);

    try {
      await apiFetch("/api/admin");
    } catch (e) {
      expect((e as ApiError).status).toBe(403);
    }
  });

  it("uses server error message from JSON body", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "Invalid input" }),
    } as Response);

    await expect(apiFetch("/api/test")).rejects.toThrow("Invalid input");
  });

  it("falls back to 'Something went wrong' if no error in body", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);

    await expect(apiFetch("/api/test")).rejects.toThrow("Something went wrong");
  });

  it("forwards fetch options to the underlying fetch call", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    const options: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "test" }),
    };

    await apiFetch("/api/groups", options);
    expect(fetch).toHaveBeenCalledWith(expect.any(String), options);
  });
});
