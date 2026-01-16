import os
from pathlib import Path

def load_env(env_path: str | None = None) -> None:
    p = Path(env_path) if env_path else Path.cwd() / ".env"
    if not p.exists():
        # Try parent directory if not found in current (common in nested scripts)
        p = Path.cwd().parent / ".env"
        if not p.exists():
             return

    for line in p.read_text(encoding="utf-8").splitlines():
        s = line.strip()
        if not s or s.startswith("#") or "=" not in s:
            continue
        k, v = s.split("=", 1)
        key = k.strip()
        val = v.strip().strip("'").strip('"')
        # Allow overwriting existing env vars if they are empty
        if key and (key not in os.environ or not os.environ[key]):
            os.environ[key] = val

def env(key: str, default: str | None = None) -> str | None:
    return os.environ.get(key, default)
