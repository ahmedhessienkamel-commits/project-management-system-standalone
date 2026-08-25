import { describe, expect, it } from "vitest";

describe("GitHub repository write token", () => {
  it("authenticates against the GitHub user endpoint when configured", async () => {
    const token = process.env.GITHUB_REPO_WRITE_TOKEN;
    expect(token, "GITHUB_REPO_WRITE_TOKEN must be configured").toBeTruthy();

    const response = await fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "erp-deployment-check",
      },
    });

    expect(response.ok).toBe(true);
    const user = (await response.json()) as { login?: string };
    expect(user.login).toBeTruthy();
  }, 20_000);
});
