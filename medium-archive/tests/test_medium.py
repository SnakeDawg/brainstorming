import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SCRIPT = HERE.parent / "medium.py"
FIX = HERE / "fixtures"

sys.path.insert(0, str(HERE.parent))
import medium  # noqa: E402


def test_parse_feed_extracts_items_and_strips_tracking():
    items = medium.parse_feed((FIX / "tag_feed.xml").read_bytes())
    assert len(items) == 2
    first = items[0]
    assert first["title"] == "Eval for RAG"
    assert first["url"] == "https://medium.com/p/abc123"  # tracking stripped
    assert first["author"] == "Jane Doe"
    assert first["published"] == "2026-06-10"
    assert first["tags"] == ["rag", "evaluation"]


def test_html_to_markdown_keeps_content_drops_chrome():
    md = medium.html_to_markdown((FIX / "article.html").read_text())
    assert "Eval for RAG" in md
    assert "real link" in md and "https://example.com/ref" in md
    assert "## Methods" in md
    assert "Second paragraph" in md
    # chrome + lightbox boilerplate stripped
    assert "Sign in" not in md
    assert "Become a member" not in md
    assert "view image in full size" not in md


def test_extract_full_article_uses_http_get(monkeypatch):
    raw = (FIX / "article.html").read_bytes()
    monkeypatch.setattr(medium, "http_get", lambda url, cookie="": raw)
    md = medium.extract_full_article("https://medium.com/p/abc123", "")
    assert "Eval for RAG" in md
    assert "## Methods" in md


def test_discover_cli_outputs_json():
    # Avoid network: stub http_get to return the fixture feed.
    feed_path = str(FIX / "tag_feed.xml")
    code = (
        "import sys; sys.argv=['medium.py','discover','tag:rag','--limit','5'];"
        "import medium;"
        "medium.http_get=lambda url, cookie='': open(r'%s','rb').read();"
        "sys.exit(medium.main())" % feed_path
    )
    out = subprocess.run([sys.executable, "-c", code],
                         capture_output=True, text=True, cwd=str(HERE.parent))
    assert out.returncode == 0, out.stderr
    data = json.loads(out.stdout)
    assert [d["title"] for d in data] == ["Eval for RAG", "Chunking 101"]
    assert all({"title", "url", "author", "published", "tags"} <= d.keys()
               for d in data)


def test_feed_spec_parsing():
    assert medium._parse_feed_spec("tag:rag") == {"tag": "rag"}
    assert medium._parse_feed_spec("pub:better-programming") == {
        "publication": "better-programming"}
    assert medium._parse_feed_spec("author:@x") == {"author": "@x"}
