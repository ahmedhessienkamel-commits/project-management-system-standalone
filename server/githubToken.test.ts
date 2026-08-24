import { describe, expect, it } from "vitest";

const repository = "ahmedhessienkamel-commits/project-management-system-standalone";

describe("GitHub repository access", () => {
  it("can read the connected private repository with the configured token", async () => {
    const token = process.env.GITHUB_TOKEN;
    expect(token, "GITHUB_TOKEN must be configured for this validation").toBeTruthy();

    const response = await fetch(`https://api.github.com/repos/${repository}`, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    expect(response.status, "GitHub token cannot read the connected repository").toBe(200);
    const payload = (await response.json()) as {
      full_name?: string;
      private?: boolean;
      permissions?: { push?: boolean };
    };

    expect(payload.full_name).toBe(repository);
    expect(payload.private).toBe(true);
    expect(payload.permissions?.push).toBe(true);
  }, 20_000);
});

