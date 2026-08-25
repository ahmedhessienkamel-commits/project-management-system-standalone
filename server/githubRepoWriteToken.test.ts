import { describe, expect, it } from "vitest";

describe("GITHUB_REPO_WRITE_TOKEN", () => {
  it("can read the target repository with push permissions", async () => {
    const token = process.env.GITHUB_REPO_WRITE_TOKEN;
    expect(token, "GITHUB_REPO_WRITE_TOKEN must be configured").toBeTruthy();

    const response = await fetch(
      "https://api.github.com/repos/ahmedhessienkamel-commits/project-management-system-standalone",
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    expect(response.ok).toBe(true);
    const payload = (await response.json()) as {
      full_name?: string;
      permissions?: { push?: boolean };
    };
    expect(payload.full_name).toBe(
      "ahmedhessienkamel-commits/project-management-system-standalone",
    );
    expect(payload.permissions?.push).toBe(true);
  });
});
