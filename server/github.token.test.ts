import { describe, expect, it } from "vitest";

describe("GitHub repository write token", () => {
  it("authenticates against GitHub and can read the connected repository", async () => {
    const token = process.env.GITHUB_REPO_WRITE_TOKEN;
    expect(token, "GITHUB_REPO_WRITE_TOKEN must be configured").toBeTruthy();

    const response = await fetch("https://api.github.com/repos/ahmedhessienkamel-commits/project-management-system-standalone", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    expect(response.ok).toBe(true);
    const repository = (await response.json()) as { full_name?: string };
    expect(repository.full_name).toBe("ahmedhessienkamel-commits/project-management-system-standalone");
  }, 15_000);
});
