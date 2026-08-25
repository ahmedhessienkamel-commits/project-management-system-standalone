const response = await fetch("https://api.github.com/repos/ahmedhessienkamel-commits/project-management-system-standalone/deployments?per_page=10", {
  headers: {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${process.env.GITHUB_REPO_WRITE_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28",
  },
});
const payload = await response.json();
if (!response.ok || !Array.isArray(payload)) {
  console.log(JSON.stringify({ status: response.status, payload }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(payload.map((deployment) => ({
  id: deployment.id,
  sha: deployment.sha?.slice(0, 8),
  environment: deployment.environment,
  description: deployment.description,
  createdAt: deployment.created_at,
  updatedAt: deployment.updated_at,
  creator: deployment.creator?.login,
})), null, 2));
