#!/usr/bin/env python3
"""Relocatable entry into the vendored Harness; never choose a project implicitly."""
import os
import runpy
import sys
from pathlib import Path


def validate_arguments(arguments, root):
    if '--help' in arguments or '-h' in arguments:
        return
    stores = [item.split('=', 1)[1] for item in arguments if item.startswith('--store=')]
    for index, item in enumerate(arguments):
        if item == '--store' and index + 1 < len(arguments):
            stores.append(arguments[index + 1])
    if len(stores) != 1 or not Path(stores[0]).is_absolute():
        raise ValueError('Supply exactly one absolute --store path in the target project.')
    store = Path(stores[0]).resolve()
    if store == root.resolve() or root.resolve() in store.parents:
        raise ValueError('The project store must be outside the installed plugin.')


def main():
    root = Path(__file__).resolve().parents[1]
    arguments = sys.argv[1:]
    try:
        validate_arguments(arguments, root)
    except ValueError as error:
        print(str(error), file=sys.stderr)
        return 2
    runtime = root / 'skills/ui-design-harness/scripts/design_harness.py'
    sys.path.insert(0, str(runtime.parent))
    sys.argv = [str(runtime), *arguments]
    runpy.run_path(str(runtime), run_name='__main__')
    return 0


if __name__ == '__main__':
    sys.exit(main())
