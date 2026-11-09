import importlib.util
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('entry', ROOT / 'scripts/design_harness_entry.py')
entry = importlib.util.module_from_spec(spec)
spec.loader.exec_module(entry)


class EntryTests(unittest.TestCase):
    def test_no_accidental_plugin_store(self):
        for args in [[], ['status'], ['status', '--store', '.design-harness']]:
            with self.assertRaises(ValueError):
                entry.validate_arguments(args, ROOT)

    def test_absolute_external_project_store_is_accepted(self):
        with tempfile.TemporaryDirectory() as directory:
            args = ['status', '--store', str(Path(directory, '.design-harness'))]
            entry.validate_arguments(args, ROOT)

    def test_explicit_plugin_directory_is_denied(self):
        with self.assertRaises(ValueError):
            entry.validate_arguments(['status', '--store', str(ROOT / '.design-harness')], ROOT)


if __name__ == '__main__':
    unittest.main()
