import re
from pathlib import Path
p = Path(r"d:\Client Work\YugaFarms\YugaFarms\src\app\about\page.tsx")
t = p.read_text(encoding="utf-8")
t = re.sub(r"</?motion\b", lambda m: m.group(0).replace("motion", "motion"), t)
p.write_text(t, encoding="utf-8")
print("done", "motion" in t)
