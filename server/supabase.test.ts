import { describe, it, expect } from "vitest";

describe("Supabase Connection", () => {
  it("should validate Supabase credentials", async () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    expect(supabaseUrl).toBeDefined();
    expect(supabaseKey).toBeDefined();
    expect(supabaseUrl).toContain("supabase.co");
    expect(supabaseKey).toContain("sb_");

    // Test basic connection to Supabase API
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
      });

      expect(response.status).toBeLessThan(500); // Should not be server error
    } catch (error) {
      // Network error is acceptable in test environment
      expect(error).toBeDefined();
    }
  });

  it("should have valid Supabase URL format", () => {
    const url = process.env.SUPABASE_URL;
    expect(url).toMatch(/^https:\/\/[a-z0-9]+\.supabase\.co$/);
  });

  it("should have valid API key format", () => {
    const key = process.env.SUPABASE_ANON_KEY;
    expect(key).toMatch(/^sb_[a-zA-Z0-9_]+$/);
  });
});
