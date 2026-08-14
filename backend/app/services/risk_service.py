"""
Risk & uncertainty decision layer.

A SEPARATE post-inference stage that consumes the raw model
prediction (probabilities) and produces a preliminary risk level
and uncertainty flag. It is intentionally independent of the model.

IMPORTANT — medical safety:
- Outputs are AI-generated PRELIMINARY indicators.
- They are NOT a diagnosis, a confirmed disease, a cure, a
  worsening assessment, or a guaranteed risk.
- No disease-specific clinical thresholds are invented.
  Uncertainty thresholds and class risk categories live in
  config.py so they are transparent and easy to change.
"""

from app import config


def assess(prediction: dict) -> dict:
    """
    Assess a model prediction for uncertainty and preliminary risk.

    Args:
        prediction: Dict from the predictor containing at least:
            - "className": predicted class name
            - "confidence": top-1 softmax probability
            - "topPredictions": list of
              {"className", "confidence", "probability"}

    Returns:
        {
            "riskLevel": "low" | "medium" | "high" | "uncertain",
            "isUncertain": bool,
            "message": str,
        }
    """
    top_confidence = float(prediction["confidence"])

    top_predictions = prediction.get("topPredictions", [])

    top_two_confidence = (
        top_predictions[1]["confidence"]
        if len(top_predictions) > 1
        else 0.0
    )

    margin = top_confidence - float(top_two_confidence)

    # --------------------------------------------------------
    # Uncertainty
    # --------------------------------------------------------

    is_uncertain = (
        top_confidence < config.UNCERTAINTY_MIN_CONFIDENCE
        or margin < config.UNCERTAINTY_MIN_MARGIN
    )

    if is_uncertain:
        return {
            "riskLevel": "uncertain",
            "isUncertain": True,
            "message": (
                "AI confidence is limited. "
                "Consider professional evaluation."
            ),
        }

    # --------------------------------------------------------
    # Preliminary risk category
    # --------------------------------------------------------

    class_name = prediction["className"]

    risk_level = config.CLASS_RISK_CATEGORY.get(
        class_name,
        "low",
    )

    return {
        "riskLevel": risk_level,
        "isUncertain": False,
        "message": (
            "Preliminary AI risk estimate. "
            "Not a medical diagnosis."
        ),
    }