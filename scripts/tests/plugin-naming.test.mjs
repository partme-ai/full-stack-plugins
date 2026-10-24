import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "catalog.json"), "utf8"));
const plugins = [
  ...catalog.plugins,
  ...(catalog.candidatePlugins ?? []).filter((candidate) => candidate.status === "release_candidate_installable"),
];

test("every plugin has English base text and Chinese localization", () => {
  for (const plugin of plugins) {
    for (const field of ["displayName", "shortDescription", "description"]) {
      assert.equal(typeof plugin[field], "string", `${plugin.id}: missing ${field}`);
      assert.ok(plugin[field].trim().length > 0, `${plugin.id}: empty ${field}`);
      assert.equal(typeof plugin.localizations?.["zh-CN"]?.[field], "string", `${plugin.id}: missing zh-CN ${field}`);
      assert.ok(plugin.localizations["zh-CN"][field].trim().length > 0, `${plugin.id}: empty zh-CN ${field}`);
    }
  }
});

test("English base fields are monolingual", () => {
  const cjk = /[\u3400-\u9fff]/;
  for (const plugin of plugins) {
    for (const field of ["displayName", "shortDescription", "description"]) {
      assert.ok(!cjk.test(plugin[field]), `${plugin.id}: English ${field} contains CJK: ${plugin[field]}`);
      assert.ok(!plugin[field].includes(" / "), `${plugin.id}: English ${field} looks bilingual`);
    }
  }
});

test("Chinese localization is monolingual and complete", () => {
  const cjk = /[\u3400-\u9fff]/;
  for (const plugin of plugins) {
    const zh = plugin.localizations["zh-CN"];
    for (const field of ["displayName", "shortDescription", "description"]) {
      assert.ok(cjk.test(zh[field]), `${plugin.id}: Chinese ${field} has no CJK`);
      assert.ok(!zh[field].includes(" / "), `${plugin.id}: Chinese ${field} looks bilingual`);
    }
  }
});

test("short and full descriptions keep separate roles", () => {
  for (const plugin of plugins) {
    for (const [locale, value] of [["en", plugin], ["zh-CN", plugin.localizations["zh-CN"]]]) {
      assert.ok(!/[\r\n]/.test(value.shortDescription), `${plugin.id}: ${locale} shortDescription contains a newline`);
      assert.ok(!/[\r\n]/.test(value.description), `${plugin.id}: ${locale} description contains a newline`);
      assert.ok(value.description.length > value.shortDescription.length, `${plugin.id}: ${locale} description is not longer than shortDescription`);
      assert.ok(value.shortDescription.length <= 120, `${plugin.id}: ${locale} shortDescription is too long`);
    }
  }
});

test("display names follow '<product> · <domain>' with no Use/RC/benchmark suffix", () => {
  for (const plugin of plugins) {
    for (const [locale, label] of [["en", "English"], ["zh-CN", "Chinese"]]) {
      const name = locale === "en" ? plugin.displayName : plugin.localizations["zh-CN"].displayName;
      assert.ok(name.includes(" · "), `${plugin.id}: ${label} displayName lacks the middle dot: ${name}`);
      const parts = name.split(" · ");
      assert.equal(parts.length, 2, `${plugin.id}: ${label} displayName must be '<product> · <domain>': ${name}`);
      assert.ok(/[A-Za-z]/.test(parts[0]), `${plugin.id}: ${label} displayName must start with the code name: ${name}`);
      assert.ok(!name.includes("对标"), `${plugin.id}: ${label} displayName still contains a benchmark: ${name}`);
      assert.ok(!/alternative/i.test(name), `${plugin.id}: ${label} displayName still contains an alternative marker: ${name}`);
      if (locale === "zh-CN") assert.ok(/[\u4e00-\u9fa5]/.test(parts[1]), `${plugin.id}: ${label} domain has no Chinese: ${name}`);
      assert.ok(!/\bUse\b/.test(name), `${plugin.id}: ${label} displayName still contains "Use"`);
      assert.ok(!/\bRC\b/.test(name), `${plugin.id}: ${label} displayName still contains an RC marker`);
      assert.ok(!name.includes("类）"), `${plugin.id}: ${label} displayName uses the rejected 类 marker`);
      assert.ok(name.length <= 60, `${plugin.id}: ${label} displayName is too long (${name.length})`);
    }
    assert.ok(/[\u4e00-\u9fa5]/.test(plugin.localizations["zh-CN"].displayName), `${plugin.id}: Chinese displayName has no Chinese`);
    assert.notEqual(plugin.displayName, plugin.localizations["zh-CN"].displayName, `${plugin.id}: en and zh display names are identical`);
  }
});

test("global and cn marketplaces stay in sync", () => {
  execFileSync(process.execPath, [path.join(root, "scripts/verify-channel-parity.mjs")], { encoding: "utf8", stdio: "pipe" });
});
