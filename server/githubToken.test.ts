import { describe, expect, it } from "vitest";

describe("GITHUB_REPO_WRITE_TOKEN", () => {
  it("authenticates against GitHub and can write to the target repository", async () => {
    const token = process.env.GITHUB_REPO_WRITE_TOKEN;
    expect(token, "GITHUB_REPO_WRITE_TOKEN must be configured").toBeTruthy();

    const response = await fetch("https://api.github.com/repos/ahmedhessienkamel-commits/project-management-system-standalone", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "erp-deployment-check",
      },
    });

    expect(response.ok, `GitHub API returned ${response.status}`).toBe(true);
    const repository = await response.json() as { full_name?: string; permissions?: { push?: boolean } };
    expect(repository.full_name).toBe("ahmedhessienkamel-commits/project-management-system-standalone");
    expect(repository.permissions?.push).toBe(true);
  }, 20_000);
});
