"""Bridge the plugin surface to the separate ArchGuard CLI."""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def binary():
    return os.environ.get("ARCHGUARD_BIN") or shutil.which("archguard")


def envelope(command, decision, findings=None, **extra):
    code = {"allow": 0, "deny": 1, "error": 2, "unverified": 3, "partial": 3}[decision]
    return {"schemaVersion": "partme.guard/v1", "tool": "archguard", "command": f"archguard.{command}",
            "decision": decision, "exitCode": code, "findings": findings or [], "evidence": {}, **extra}


def version():
    path = binary()
    return envelope("version", "allow" if path else "partial", binary=path, pluginVersion="0.1.0")


def doctor(project="."):
    path = binary()
    root = Path(project).resolve()
    checks = {"binary": path, "cargoManifest": (root / "Cargo.toml").is_file()}
    decision = "allow" if path else "partial"
    return envelope("doctor", decision, checks=checks, project={"root": str(root)},
                    nextActions=[] if path else ["install the archguard CLI or set ARCHGUARD_BIN"])


def discover(project="."):
    root = Path(project).resolve()
    facts = {"root": str(root), "cargoWorkspace": (root / "Cargo.toml").is_file(),
             "contract": (root / ".guard" / "arch.yaml").is_file()}
    return envelope("discover", "allow", facts=facts)


def check(project, contract):
    path = binary()
    if not path:
        return envelope("check", "partial", [{"code": "ARCHGUARD_CLI_MISSING", "severity": "warning"}],
                        analysis={"status": "PARTIAL", "reason": "archguard CLI is not installed"})
    if not Path(contract).is_file():
        return envelope("check", "partial", [{"code": "ARCH_CONTRACT_MISSING", "severity": "warning"}],
                        analysis={"status": "PARTIAL", "reason": "contract file missing"})
    with tempfile.TemporaryDirectory(prefix="archguard-") as temporary:
        report = Path(temporary) / "report.json"
        completed = subprocess.run([path, "check", "--project", str(project), "--contract", str(contract),
                                    "--report", str(report)], capture_output=True, text=True, check=False)
        if not report.is_file():
            return envelope("check", "unverified", [{"code": "ARCHGUARD_UNVERIFIED", "severity": "warning"}],
                            analysis={"status": "UNVERIFIED", "exitCode": completed.returncode,
                                      "stderr": completed.stderr[-2000:]})
        data = json.loads(report.read_text())
        decision = {"allow": "allow", "block": "deny", "require_approval": "unverified"}.get(
            str(data.get("decision", "")).lower(), "unverified")
        return envelope("check", decision, analysis=data)


def main(argv):
    command = argv[0] if argv else "doctor"
    if command == "version":
        result = version()
    elif command == "doctor":
        result = doctor(argv[1] if len(argv) > 1 else ".")
    elif command == "discover":
        result = discover(argv[1] if len(argv) > 1 else ".")
    elif command == "status":
        result = doctor(argv[1] if len(argv) > 1 else ".")
    elif command == "check":
        project = argv[argv.index("--project") + 1] if "--project" in argv else "."
        contract = argv[argv.index("--contract") + 1] if "--contract" in argv else ".guard/arch.yaml"
        result = check(project, contract)
    else:
        print("usage: archguard version|doctor|discover|status|check --project PATH --contract FILE", file=sys.stderr)
        return 2
    print(json.dumps(result, ensure_ascii=False, indent=2) if "--json" in argv else result.get("analysis", result))
    return result["exitCode"]


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
