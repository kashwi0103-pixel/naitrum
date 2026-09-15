# Datasets

This directory serves as the root for evaluation and validation datasets used in DR-Sahayak.

*Do not commit actual images to the repository.*

## Directory Structure

- `aptos2019/`: Used for DR severity classification training and validation.
- `idrid/`: Indian Diabetic Retinopathy Image Dataset. Used for validating lesion segmentation and structural mapping in an Indian context.
- `drive/`: Digital Retinal Images for Vessel Extraction. Used for the vessel segmentation U-Net model.
- `messidor-2/`: Used as a strict external test set for final evaluation.

Place the downloaded CSVs and `images/` folders in their respective subdirectories.
