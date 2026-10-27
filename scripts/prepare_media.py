"""Restore large media from repository-friendly parts before publishing."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "media-parts" / "manifest.json"


def restore_media():
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    for entry in manifest["files"]:
        output = ROOT / entry["output"]
        output.parent.mkdir(parents=True, exist_ok=True)
        temporary = output.with_suffix(output.suffix + ".restoring")
        total_hash = hashlib.sha256()
        try:
            with temporary.open("wb") as restored:
                for part in entry["parts"]:
                    path = ROOT / "media-parts" / part["name"]
                    part_hash = hashlib.sha256()
                    with path.open("rb") as source:
                        while chunk := source.read(1024 * 1024):
                            part_hash.update(chunk)
                            total_hash.update(chunk)
                            restored.write(chunk)
                    if part_hash.hexdigest() != part["sha256"]:
                        raise ValueError(f"Checksum mismatch: {path.name}")
            if total_hash.hexdigest() != entry["sha256"]:
                raise ValueError(f"Checksum mismatch: {entry['output']}")
            if temporary.stat().st_size != entry["bytes"]:
                raise ValueError(f"File size mismatch: {entry['output']}")
            temporary.replace(output)
            print(f"Restored and verified {entry['output']}")
        finally:
            temporary.unlink(missing_ok=True)


if __name__ == "__main__":
    restore_media()
