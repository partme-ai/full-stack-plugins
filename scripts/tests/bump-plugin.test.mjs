import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const write = (file, value) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`); };
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
function snapshot(dir) {
  const result = {};
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) for (const [name, value] of Object.entries(snapshot(file))) result[`${entry.name}/${name}`] = value;
    else result[entry.name] = fs.readFileSync(file).toString('base64');
  }
  return result;
}
function fixture(t, { claudeMarket = true, claudePlugin = true, pyproject = true } = {}) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bump fixture '));
  t.after(() => { const resolved = path.resolve(tmp); assert.ok(resolved.startsWith(path.resolve(os.tmpdir()) + path.sep)); assert.ok(path.basename(resolved).startsWith('bump fixture ')); fs.rmSync(resolved, { recursive: true }); });
  const market = path.join(tmp, 'full-stack-plugins');
  const repo = path.join(tmp, 'full-stack-plugins-repositories/demo-plugin');
  const script = path.join(market, 'scripts/bump-plugin.mjs');
  write(script, fs.readFileSync(path.join(root, 'scripts/bump-plugin.mjs'), 'utf8'));
  write(path.join(market, 'catalog.json'), { name: 'fixture', description: 'market', plugins: [{ id: 'demo', version: '0.3.0', localDirectory: 'demo-plugin', repository: 'example/demo-plugin', logo: 'assets/logo.png', description: 'current description', shortDescription: 'current short' }, { id: 'untouched', version: '9.9.9' }] });
  write(path.join(market, 'scripts/sync-marketplaces.mjs'), `import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const file=path.join(root,'sync-calls.json');const calls=fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):[];calls.push(process.argv.slice(2));fs.writeFileSync(file,JSON.stringify(calls));`);
  for (const name of ['plugin.json', '.zcode-plugin/plugin.json', 'kimi.plugin.json']) write(path.join(repo, name), { metadata: { version: '0.3.0' }, name: 'demo', version: '0.3.0' });
  write(path.join(repo, '.codex-plugin/plugin.json'), { name: 'demo', version: '0.3.0+codex.20260101' });
  write(path.join(repo, '.agents/plugins/marketplace.json'), { name: 'fixture', plugins: [{ name: 'demo', version: '0.3.0', description: 'old description', source: { ref: 'v0.3.0' }, icon: 'old-logo', interface: { logo: 'old-logo', shortDescription: 'old short' } }] });
  if (claudePlugin) write(path.join(repo, '.claude-plugin/plugin.json'), { metadata: { version: '0.3.0' }, name: 'demo', version: '0.3.0' });
  if (claudeMarket) write(path.join(repo, '.claude-plugin/marketplace.json'), { metadata: { version: '0.3.0' }, plugins: [{ name: 'demo', version: '0.3.0' }] });
  if (pyproject) write(path.join(repo, 'pyproject.toml'), `# keep this comment\n[project]\nname = "demo-plugin"\nversion = '0.3.0' # static package version\ndescription = "fixture"\n\n[tool.example]\nversion = "8.9.0"\n`);
  write(path.join(repo, 'README.md'), 'Version v0.3.0; Current candidate 0.3.0+codex.20260101; --ref v0.3.0\n');
  write(path.join(repo, 'README.zh-CN.md'), '版本 0.3.0；历史 0.1.0+codex.20200101\n');
  return { tmp, market, repo, script, run: (...args) => spawnSync(process.execPath, [script, 'demo', 'patch', ...args], { env: { ...process.env, PARTME_PLUGINS_ROOT: market }, encoding: 'utf8' }) };
}
function success(result) { assert.equal(result.status, 0, result.stdout + result.stderr); }
function rejectsWithoutWrites(f) { const before = snapshot(f.tmp); const result = f.run(); assert.notEqual(result.status, 0, result.stdout); assert.deepEqual(snapshot(f.tmp), before, 'drift must fail before any catalog/manifest/README/sync mutation'); }

test('all present manifest shapes and pyproject sync; unrelated nested versions stay unchanged', t => {
  const f = fixture(t); success(f.run());
  for (const rel of ['plugin.json', '.zcode-plugin/plugin.json', 'kimi.plugin.json', '.claude-plugin/plugin.json']) { const v = read(path.join(f.repo, rel)); assert.equal(v.version, '0.3.1', rel); assert.equal(v.metadata.version, '0.3.0', rel); }
  const claude = read(path.join(f.repo, '.claude-plugin/marketplace.json')); assert.equal(claude.plugins[0].version, '0.3.1'); assert.equal(claude.metadata.version, '0.3.0');
  const agents = read(path.join(f.repo, '.agents/plugins/marketplace.json')).plugins[0];
  assert.equal(agents.version, '0.3.1'); assert.equal(agents.source.ref, 'v0.3.1'); assert.equal(agents.description, 'current description'); assert.equal(agents.interface.shortDescription, 'current short'); assert.match(agents.icon, /@v0\.3\.1\//);
  assert.match(read(path.join(f.repo, '.codex-plugin/plugin.json')).version, /^0\.3\.1\+codex\.\d{8}$/);
  assert.match(fs.readFileSync(path.join(f.repo, 'pyproject.toml'), 'utf8'), /version = '0\.3\.1' # static package version/); assert.match(fs.readFileSync(path.join(f.repo, 'pyproject.toml'), 'utf8'), /version = "8\.9\.0"/);
  assert.match(fs.readFileSync(path.join(f.repo, 'README.md'), 'utf8'), /v0\.3\.1/); assert.match(fs.readFileSync(path.join(f.repo, 'README.zh-CN.md'), 'utf8'), /0\.1\.0\+codex\.20200101/);
  assert.equal(read(path.join(f.market, 'catalog.json')).plugins[1].version, '9.9.9'); assert.deepEqual(read(path.join(f.market, 'sync-calls.json')), [['--write', '--plugin=demo'], ['--plugin=demo']]);
});
test('Claude marketplace is optional for CodeReview-like packages', t => { const f = fixture(t, { claudeMarket: false }); success(f.run()); assert.equal(read(path.join(f.repo, '.claude-plugin/plugin.json')).version, '0.3.1'); assert.ok(!fs.existsSync(path.join(f.repo, '.claude-plugin/marketplace.json'))); });
test('both Claude manifests and Python project metadata are optional', t => { const f = fixture(t, { claudeMarket: false, claudePlugin: false, pyproject: false }); success(f.run()); assert.ok(!fs.existsSync(path.join(f.repo, 'pyproject.toml'))); });
for (const rel of ['.zcode-plugin/plugin.json', '.claude-plugin/plugin.json', '.codex-plugin/plugin.json']) test(`${rel} drift refuses before every mutation`, t => { const f = fixture(t); const file = path.join(f.repo, rel); const v = read(file); v.version = '7.0.0'; write(file, v); rejectsWithoutWrites(f); });
for (const rel of ['.agents/plugins/marketplace.json', '.claude-plugin/marketplace.json']) test(`${rel} nested drift refuses before every mutation`, t => { const f = fixture(t); const file = path.join(f.repo, rel); const v = read(file); v.plugins[0].version = '7.0.0'; write(file, v); rejectsWithoutWrites(f); });
test('Python project version drift refuses before every mutation', t => { const f = fixture(t); write(path.join(f.repo, 'pyproject.toml'), '[project]\nversion = "7.0.0"\n'); rejectsWithoutWrites(f); });
test('missing static project version refuses rather than silently releasing inconsistent Python metadata', t => { const f = fixture(t); write(path.join(f.repo, 'pyproject.toml'), '[project]\ndynamic = ["version"]\n'); rejectsWithoutWrites(f); });
test('tool-only Python metadata is preserved', t => { const f = fixture(t); const toml = '[tool.example]\nproject = "tool-owned value"\nversion = "9.0.0"\n'; write(path.join(f.repo, 'pyproject.toml'), toml); success(f.run()); assert.equal(fs.readFileSync(path.join(f.repo, 'pyproject.toml'), 'utf8'), toml); });
test('valid dry-run reports optional edits and leaves all bytes unchanged', t => { const f = fixture(t); const before = snapshot(f.tmp); const result = f.run('--dry-run'); success(result); assert.match(result.stdout, /\.claude-plugin[\\/]plugin\.json/); assert.match(result.stdout, /pyproject\.toml/); assert.deepEqual(snapshot(f.tmp), before); });
test('dry-run still validates drift without mutation', t => { const f = fixture(t); write(path.join(f.repo, 'pyproject.toml'), '[project]\nversion = "7.0.0"\n'); const before = snapshot(f.tmp); assert.notEqual(f.run('--dry-run').status, 0); assert.deepEqual(snapshot(f.tmp), before); });
test('unknown flags cannot accidentally become a live release', t => { const f = fixture(t); const before = snapshot(f.tmp); assert.notEqual(f.run('--dryrun').status, 0); assert.deepEqual(snapshot(f.tmp), before); });
test('ambiguous market discovery refuses first-match selection', t => { const f = fixture(t); const script = path.join(f.tmp, 'tool/scripts/bump-plugin.mjs'); write(script, fs.readFileSync(f.script, 'utf8')); write(path.join(f.tmp, 'other-plugins/catalog.json'), read(path.join(f.market, 'catalog.json'))); const before = snapshot(f.tmp); const env = { ...process.env }; delete env.PARTME_PLUGINS_ROOT; const result = spawnSync(process.execPath, [script, 'demo', 'patch'], { env, encoding: 'utf8' }); assert.notEqual(result.status, 0); assert.match(result.stderr, /多个插件市场仓/); assert.deepEqual(snapshot(f.tmp), before); });

test('multiline TOML descriptions cannot masquerade as project version metadata', t => {
  const f = fixture(t);
  const toml = ['[project]', 'description = """', '[project]', 'version = "8.8.8"', '# the strings above are description text', '"""', 'version = "0.3.0" # actual version', '[tool.example]', 'version = "9.9.9"', ''].join('\n');
  write(path.join(f.repo, 'pyproject.toml'), toml); success(f.run());
  assert.equal(fs.readFileSync(path.join(f.repo, 'pyproject.toml'), 'utf8'), toml.replace('version = "0.3.0"', 'version = "0.3.1"'));
});
test('duplicate static TOML project versions fail without any writes', t => { const f = fixture(t); write(path.join(f.repo, 'pyproject.toml'), '[project]\nversion="0.3.0"\nversion="0.3.0"\n'); rejectsWithoutWrites(f); });
test('ambiguous optional Claude marketplace entries fail before writes', t => { const f = fixture(t); const file = path.join(f.repo, '.claude-plugin/marketplace.json'); write(file, {plugins: [{version:'0.3.0'}, {version:'0.3.0'}]}); rejectsWithoutWrites(f); });
test('malformed agents release URL shape fails before catalog changes', t => { const f = fixture(t); write(path.join(f.repo, '.agents/plugins/marketplace.json'), {plugins: [{version:'0.3.0'}]}); rejectsWithoutWrites(f); });
for (const rel of ['plugin.json', 'kimi.plugin.json']) test(`${rel} top-level drift cannot be hidden by nested metadata version`, t => { const f = fixture(t); const file = path.join(f.repo, rel); const value=read(file);value.version='7.0.0';write(file,value);rejectsWithoutWrites(f); });

test('the current CodeGuard 0.20.0 baseline advances to 0.20.1', t => {
  const f = fixture(t);
  const catalogFile=path.join(f.market,'catalog.json');const catalog=read(catalogFile);catalog.plugins[0].version='0.20.0';write(catalogFile,catalog);
  for (const relative of ['plugin.json','.zcode-plugin/plugin.json','kimi.plugin.json','.codex-plugin/plugin.json','.agents/plugins/marketplace.json','.claude-plugin/plugin.json','.claude-plugin/marketplace.json','pyproject.toml','README.md','README.zh-CN.md']) {
    const file=path.join(f.repo,relative);write(file,fs.readFileSync(file,'utf8').replaceAll('0.3.0','0.20.0'));
  }
  success(f.run());assert.equal(read(catalogFile).plugins[0].version,'0.20.1');assert.equal(read(path.join(f.repo,'.claude-plugin/plugin.json')).version,'0.20.1');assert.match(fs.readFileSync(path.join(f.repo,'pyproject.toml'),'utf8'), /version = '0\.20\.1'/);
});
