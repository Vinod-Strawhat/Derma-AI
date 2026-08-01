# DermaAI - Design Decisions

## Decision 001

### Title

Unknown Disease Detection

### Problem

The HAM10000 dataset contains only seven disease classes.

If a user uploads an image belonging to another skin disease, the model may incorrectly classify it as one of the known diseases.

### Decision

The prediction system will not always force a classification.

After prediction, the highest confidence score will be checked.

If the confidence is below a configurable threshold, DermaAI will display:

"The uploaded image does not closely match any disease known by the model.

Please consult a dermatologist."

### Reason

This makes the application safer and more trustworthy than always forcing a prediction.

### Status

Approved