#!/usr/bin/env python3
"""从独立插件仓的固定标签生成 Codex 聚合包，并核对内容。"""
import argparse
import json
import os
import pathlib
import shutil
import subprocess
import tarfile
import tempfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
CATALOG = json.loads((ROOT / "catalog.json").read_text(encoding="utf-8"))
WORKSPACE = pathlib.Path(os.environ.get("AGGREGATE_REPO_ROOT", ROOT.parent / "full-stack-plugins-repositories"))


def archived_package(plugin, destination, repository_override=None):
    repository = repository_override or WORKSPACE / plugin["localDirectory"]
    ref = f"v{plugin['version']}"
    if not repository.is_dir():
        raise RuntimeError(f"{plugin['id']}: missing checkout {repository}")
    if plugin.get("sourceCommit"):
        commit = subprocess.check_output(["git", "-C", str(repository), "rev-parse", f"{ref}^{{commit}}"], text=True).strip()
        if commit != plugin["sourceCommit"]:
            if repository_override is not None:
                raise RuntimeError(f"{plugin['id']}: remote tag {ref} points to {commit}, expected {plugin['sourceCommit']}")
            with tempfile.TemporaryDirectory(prefix=f"{plugin['id']}-release-") as remote:
                subprocess.run(["git", "-c", "core.autocrlf=false", "-c", "advice.detachedHead=false", "clone", "--quiet", "--depth", "1", "--branch", ref, f"https://github.com/{plugin['repository']}.git", remote], check=True)
                return archived_package(plugin, destination, pathlib.Path(remote))
    with tempfile.TemporaryFile() as archive:
        subprocess.run(["git", "-C", str(repository), "archive", "--format=tar", ref],
                       stdout=archive, check=True)
        archive.seek(0)
        with tarfile.open(fileobj=archive, mode="r:") as tar:
            for member in tar:
                if pathlib.PurePosixPath(member.name).name == ".DS_Store":
                    continue
                relative = pathlib.PurePosixPath(member.name)
                if relative.is_absolute() or ".." in relative.parts:
                    raise RuntimeError(f"{plugin['id']}: unsafe archive path {member.name}")
                # 上游标签含系统缓存和构建输出，不属于可安装插件内容。
                if (relative.parts and relative.parts[0] in {".mimosa", "dist"}) or "__pycache__" in relative.parts or relative.name == ".DS_Store" or relative.name.endswith(".pyc"):
                    continue
                target = destination.joinpath(*relative.parts)
                if member.isdir():
                    target.mkdir(parents=True, exist_ok=True)
                elif member.isfile():
                    target.parent.mkdir(parents=True, exist_ok=True)
                    with tar.extractfile(member) as source, target.open("wb") as output:
                        shutil.copyfileobj(source, output)
                    target.chmod(member.mode & 0o777)
                else:
                    raise RuntimeError(f"{plugin['id']}: unsupported archive entry {member.name}")
    root_manifest = destination / "plugin.json"
    codex_manifest = destination / ".codex-plugin/plugin.json"
    if not root_manifest.is_file() or not codex_manifest.is_file():
        raise RuntimeError(f"{plugin['id']}: missing plugin manifest")
    root_data = json.loads(root_manifest.read_text(encoding="utf-8"))
    codex_data = json.loads(codex_manifest.read_text(encoding="utf-8"))
    if root_data["name"] != plugin["id"] or root_data["version"] != plugin["version"]:
        raise RuntimeError(f"{plugin['id']}: archived identity differs from catalog")
    display = plugin.get("localizations", {}).get("zh-CN", {})
    for file, data, ui in (
        (root_manifest, root_data, root_data.setdefault("extensions", {}).setdefault("com.openai", {}).setdefault("interface", {})),
        (codex_manifest, codex_data, codex_data.setdefault("interface", {})),
    ):
        ui["displayName"] = display.get("displayName", plugin["displayName"])
        ui["shortDescription"] = display.get("shortDescription", plugin["shortDescription"])
        file.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def files(root):
    return {p.relative_to(root).as_posix(): p for p in root.rglob("*") if p.is_file()}


def check_equal(expected, actual, name):
    left, right = files(expected), files(actual) if actual.is_dir() else {}
    if left.keys() != right.keys():
        raise RuntimeError(f"{name}: aggregate file list differs from release tag")
    for relative in left:
        expected_bytes = left[relative].read_bytes()
        actual_bytes = right[relative].read_bytes()
        if expected_bytes == actual_bytes:
            continue
        # Windows checkout may translate text line endings; all other bytes stay exact.
        if b"\0" not in expected_bytes and b"\0" not in actual_bytes and expected_bytes.replace(b"\r\n", b"\n") == actual_bytes.replace(b"\r\n", b"\n"):
            continue
        raise RuntimeError(f"{name}: aggregate differs at {relative} (expected {len(expected_bytes)} bytes, got {len(actual_bytes)} bytes)")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()
    with tempfile.TemporaryDirectory(prefix="full-stack-aggregate-") as temporary:
        stage = pathlib.Path(temporary)
        for plugin in CATALOG["plugins"]:
            expected = stage / plugin["id"]
            expected.mkdir()
            archived_package(plugin, expected)
            target = ROOT / "plugins" / plugin["id"]
            if args.write:
                if target.exists():
                    shutil.rmtree(target)
                shutil.copytree(expected, target)
            else:
                check_equal(expected, target, plugin["id"])
    print(f"{'Synchronized' if args.write else 'Validated'} {len(CATALOG['plugins'])} aggregated packages")


if __name__ == "__main__":
    main()
