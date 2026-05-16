import re
from pathlib import Path
p = Path(__file__).parent / "new-product-sections.snippet"
t = p.read_text(encoding="utf-8")
t = re.sub(r"</?motion\b", lambda m: m.group(0).replace("motion", "motion"), t)
t = t.replace("motion", "motion")  # wrong
t = re.sub(r"</?motion\b", lambda m: m.group(0).replace("motion", "div"), t)
p.write_text(t, encoding="utf-8")
print("fixed")
