export default {
  branches: ["main"],
  repositoryUrl: "https://github.com/SavageChieftain/RegExt.git",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    [
      "@semantic-release/github",
      {
        successComment: false,
        failComment: false,
        failTitle: false,
        labels: false,
        releasedLabels: false,
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json", "package-lock.json"],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};
