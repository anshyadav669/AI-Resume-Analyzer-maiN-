import re
import unicodedata
from typing import Tuple
from app.schemas.pdf import TextCleaningStats


class TextCleaner:
    """
    Sanitizes, normalizes, and cleans text extracted from PDF resumes.
    Handles Unicode ligatures, exotic bullet characters, broken hyphenated linebreaks,
    and non-printable ASCII control characters.
    """

    LIGATURES = {
        "\ufb00": "ff",
        "\ufb01": "fi",
        "\ufb02": "fl",
        "\ufb03": "ffi",
        "\ufb04": "ffl",
        "\ufb05": "ft",
        "\ufb06": "st",
    }

    # Common PDF bullet symbols including font glyphs
    BULLET_CHARS = r"[\u2022\u2023\u25e6\u2043\u2219\u25cb\u25cf\u25aa\u25ab\u25a0\u25a1\uf0b7\uf0a7\u25c6\u25c7\u27a4\u2794\u2714\u2713\–\—]"

    @classmethod
    def clean(cls, text: str) -> Tuple[str, TextCleaningStats]:
        if not text:
            return "", TextCleaningStats()

        original_len = len(text)
        ligatures_fixed = 0
        bullets_normalized = 0
        hyphens_fixed = 0

        # 1. Ligatures Normalization (processed before NFKC to track count accurately)
        normalized = text
        for lig, repl in cls.LIGATURES.items():
            if lig in normalized:
                count = normalized.count(lig)
                ligatures_fixed += count
                normalized = normalized.replace(lig, repl)

        # 2. Unicode NFKC Normalization
        normalized = unicodedata.normalize("NFKC", normalized)

        # 3. Remove non-printable control characters (keep \n, \t, \r)
        normalized = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", normalized)

        # 4. Repair hyphenated linebreaks (e.g., 'architec-\n  ture' -> 'architecture')
        hyphen_matches = len(re.findall(r"([a-zA-Z]{2,})-\s*\n\s*([a-zA-Z]{2,})", normalized))
        if hyphen_matches > 0:
            hyphens_fixed += hyphen_matches
            normalized = re.sub(r"([a-zA-Z]{2,})-\s*\n\s*([a-zA-Z]{2,})", r"\1\2", normalized)

        # 5. Normalize Bullet Points to standard dash '- '
        # Matches bullets at start of string, after newline, or standalone
        bullet_matches = len(re.findall(cls.BULLET_CHARS, normalized))
        if bullet_matches > 0:
            bullets_normalized += bullet_matches
            # Replace at start of line
            normalized = re.sub(r"(?:^|\n)\s*" + cls.BULLET_CHARS + r"\s*", r"\n- ", normalized)
            # Replace any remaining standalone bullet characters
            normalized = re.sub(cls.BULLET_CHARS + r"\s*", "- ", normalized)

        # 6. Normalize Horizontal Spaces (preserve newlines)
        normalized = re.sub(r"[ \t]+", " ", normalized)

        # 7. Clean up line by line (strip each line)
        lines = [line.strip() for line in normalized.splitlines()]
        
        # 8. Collapse excessive blank lines (max 2 consecutive newlines)
        cleaned_text = "\n".join(lines)
        cleaned_text = re.sub(r"\n{3,}", "\n\n", cleaned_text).strip()

        cleaned_len = len(cleaned_text)
        reduction_pct = round(((original_len - cleaned_len) / original_len) * 100, 2) if original_len > 0 else 0.0

        stats = TextCleaningStats(
            original_character_count=original_len,
            cleaned_character_count=cleaned_len,
            reduction_pct=reduction_pct,
            bullets_normalized=bullets_normalized,
            ligatures_fixed=ligatures_fixed,
            hyphenated_linebreaks_fixed=hyphens_fixed,
        )

        return cleaned_text, stats
