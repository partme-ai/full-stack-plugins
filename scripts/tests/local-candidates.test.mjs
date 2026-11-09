import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "catalog.json"), "utf8"));
const packages = path.resolve(root, "../full-stack-plugins-repositories");

test("local CLI candidates have installable packages but no published marketplace entry", () => {
  const published = new Set(catalog.plugins.map((plugin) => plugin.id));
  for (const candidate of catalog.candidatePlugins ?? []) {
    if (candidate.status !== "local_candidate") continue;
    assert.ok(!published.has(candidate.id), `${candidate.id}: candidate is also published`);
    const repo = path.join(packages, candidate.localDirectory);
    for (const manifest of ["plugin.json", "kimi.plugin.json", ".codex-plugin/plugin.json", ".claude-plugin/plugin.json", ".zcode-plugin/plugin.json"]) {
      const data = JSON.parse(fs.readFileSync(path.join(repo, manifest), "utf8"));
      assert.equal(data.name, candidate.id, manifest);
      assert.equal(data.version, candidate.version, manifest);
    }
    for (const suffix of ["setup", "use"]) {
      const skill = `${candidate.id}-${suffix}`;
      const body = fs.readFileSync(path.join(repo, "skills", skill, "SKILL.md"), "utf8");
      assert.match(body, new RegExp(`^name: ${skill}$`, "m"));
    }
    const notice = fs.readFileSync(path.join(repo, "THIRD-PARTY-NOTICES.md"), "utf8");
    assert.match(notice, /zai-org\/zcode-plugins/);
  }
});
