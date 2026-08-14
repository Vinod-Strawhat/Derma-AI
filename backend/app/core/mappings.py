"""
Metadata mappings.

Builds the exact gender and region mappings used by the existing
SkinDiseaseDataset. Region encoding follows the sorted-unique
logic applied to master_metadata.csv.

The region values are case-sensitive canonical strings.
"""

from pathlib import Path

import pandas as pd

from app.config import CLASS_NAMES, METADATA_PATH

# ============================================================
# Gender Mapping
# ============================================================

GENDER_MAPPING = {
    "Male": 0,
    "Female": 1,
    "Unknown": 2,
}

GENDER_VALUES = list(GENDER_MAPPING)


def normalize_gender(gender: str) -> int:
    """
    Convert a raw gender string into the encoded integer.

    Matching mirrors SkinDiseaseDataset:
    fillna("Unknown") -> str -> capitalize().
    Unknown/empty values map to Unknown (2).
    """
    text = str(gender).strip().capitalize()

    return GENDER_MAPPING.get(
        text,
        GENDER_MAPPING["Unknown"],
    )


# ============================================================
# Region Mapping
# ============================================================

_REGION_MAPPING: dict[str, int] | None = None


def _load_region_mapping() -> dict[str, int]:
    """
    Build the canonical region mapping using the same
    sorted-unique logic as SkinDiseaseDataset:

        fillna("Unknown").astype(str).unique() -> sorted

    Returns a case-sensitive region -> index mapping.
    """
    metadata_path = Path(METADATA_PATH)

    if not metadata_path.exists():
        raise FileNotFoundError(
            f"Metadata file not found: {metadata_path}"
        )

    metadata = pd.read_csv(metadata_path)

    regions = sorted(
        metadata["region"]
        .fillna("Unknown")
        .astype(str)
        .unique()
    )

    return {
        region: index
        for index, region in enumerate(regions)
    }


def get_region_mapping() -> dict[str, int]:
    """Return the cached canonical region -> index mapping."""
    global _REGION_MAPPING

    if _REGION_MAPPING is None:
        _REGION_MAPPING = _load_region_mapping()

    return _REGION_MAPPING


def get_canonical_regions() -> list[str]:
    """Return the ordered list of canonical region values."""
    return list(get_region_mapping().keys())


def encode_region(region: str) -> int:
    """
    Convert a raw region string into its canonical index.

    Matching is case-sensitive. If the value is not a canonical
    region, it falls back to the "Unknown" region when present,
    otherwise to the dataset's unknown_region_index behavior.
    """
    text = str(region).strip()

    mapping = get_region_mapping()

    if text in mapping:
        return mapping[text]

    if "Unknown" in mapping:
        return mapping["Unknown"]

    return len(mapping)