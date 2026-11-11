import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class DshIconTest(unittest.TestCase):
    def test_installed_icon_fits_dsh_metadata_limit(self):
        package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
        icon = ROOT / package["icon"]
        self.assertTrue(icon.is_file())
        self.assertLessEqual(icon.stat().st_size, 256 * 1024)


if __name__ == "__main__":
    unittest.main()
