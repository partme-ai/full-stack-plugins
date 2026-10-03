import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
function fixture() {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'market fixture '));
  const market = path.join(temporary, 'full-stack-plugins');
  const plugin = path.join(temporary, 'full-stack-plugins-repositories/ui-design-plugin');
  const original = path.resolve(root, '../full-stack-plugins-repositories/ui-design-plugin');
  for (const file of ['catalog.json', 'scripts/sync-marketplaces.mjs', '.agents/plugins/marketplace.json', 'marketplace.json', 'kimi-marketplace.json']) {
    const output = path.join(market, file);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.copyFileSync(path.join(root, file), output);
  }
  for (const file of ['plugin.json', '.codex-plugin/plugin.json', '.zcode-plugin/plugin.json', 'kimi.plugin.json', '.agents/plugins/marketplace.json', 'assets/logo.png']) {
    const output = path.join(plugin, file);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.copyFileSync(path.join(original, file), output);
  }
  for (const name of fs.readdirSync(path.join(original, 'skills'))) {
    const source = path.join(original, 'skills', name, 'SKILL.md');
    if (!fs.existsSync(source)) continue;
    const output = path.join(plugin, 'skills', name, 'SKILL.md');
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.copyFileSync(source, output);
  }
  return { temporary, market, plugin,
    run: () => execFileSync(process.execPath, [path.join(market, 'scripts/sync-marketplaces.mjs'), '--write', '--plugin=ui-design'], { encoding: 'utf8', stdio: 'pipe' }) };
}

test('selected new plugins are added to all marketplaces', () => {
  const f = fixture();
  try {
    for (const relative of ['.agents/plugins/marketplace.json', 'marketplace.json', 'kimi-marketplace.json']) {
      const file = path.join(f.market, relative);
      const value = JSON.parse(fs.readFileSync(file, 'utf8'));
      value.plugins = value.plugins.filter(entry => (entry.name ?? entry.id) !== 'ui-design');
      fs.writeFileSync(file, JSON.stringify(value));
    }
    f.run();
    for (const relative of ['.agents/plugins/marketplace.json', 'marketplace.json', 'kimi-marketplace.json']) {
      const value = JSON.parse(fs.readFileSync(path.join(f.market, relative), 'utf8'));
      assert.equal(value.plugins.filter(entry => (entry.name ?? entry.id) === 'ui-design').length, 1);
    }
  } finally { fs.rmSync(f.temporary, { recursive: true }); }
});

test('Windows skill newlines are accepted without changing snapshots', () => {
  const f = fixture();
  try {
    const file = path.join(f.plugin, 'skills/ui-design-use/SKILL.md');
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(/\r?\n/g, '\r\n'));
    assert.match(f.run(), /Synchronized 1 installable/);
  } finally { fs.rmSync(f.temporary, { recursive: true }); }
});

test('a mismatched plugin version blocks validation', () => {
  const f = fixture();
  try {
    const file = path.join(f.plugin, '.zcode-plugin/plugin.json');
    const value = JSON.parse(fs.readFileSync(file, 'utf8'));
    value.version = '99.0.0';
    fs.writeFileSync(file, JSON.stringify(value));
    assert.throws(f.run, error => error.stderr.toString().includes('does not match'));
  } finally { fs.rmSync(f.temporary, { recursive: true }); }
});
