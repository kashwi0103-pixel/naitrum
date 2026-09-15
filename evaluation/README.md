# Evaluation

This directory stores the outputs and metrics generated from the model evaluation scripts against the test datasets.

## Metrics Tracked

- `accuracy.csv`: Overall accuracy across classes.
- `roc_auc.json`: ROC and AUC scores per class.
- `confusion_matrix.png`: Plotted confusion matrices.
- `calibration/`: ECE (Expected Calibration Error) and Brier scores for confidence calibration.
- `segmentation/`: Dice and IoU scores for vessel and lesion segmentation masks.

*Run the evaluation scripts (e.g. `backend/evaluate.py`) to generate these files.*
