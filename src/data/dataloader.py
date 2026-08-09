"""
PyTorch DataLoader utilities for the DermaAI multimodal dataset.

Provides reusable helper functions for creating training
and validation DataLoaders.
"""

from torch.utils.data import DataLoader, Dataset


# --------------------------------------------------
# Default Settings
# --------------------------------------------------

DEFAULT_BATCH_SIZE = 32
DEFAULT_NUM_WORKERS = 0


# --------------------------------------------------
# Training DataLoader
# --------------------------------------------------

def get_train_dataloader(
    dataset: Dataset,
    batch_size: int = DEFAULT_BATCH_SIZE,
    num_workers: int = DEFAULT_NUM_WORKERS,
) -> DataLoader:
    """
    Create the training DataLoader.

    Args:
        dataset:
            Training dataset.

        batch_size:
            Number of samples in each batch.

        num_workers:
            Number of worker processes used to load data.

    Returns:
        Configured training DataLoader.
    """

    return DataLoader(
        dataset=dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers,
        drop_last=False,
        pin_memory=True,
    )


# --------------------------------------------------
# Validation DataLoader
# --------------------------------------------------

def get_validation_dataloader(
    dataset: Dataset,
    batch_size: int = DEFAULT_BATCH_SIZE,
    num_workers: int = DEFAULT_NUM_WORKERS,
) -> DataLoader:
    """
    Create the validation DataLoader.

    Args:
        dataset:
            Validation dataset.

        batch_size:
            Number of samples in each batch.

        num_workers:
            Number of worker processes used to load data.

    Returns:
        Configured validation DataLoader.
    """

    return DataLoader(
        dataset=dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        drop_last=False,
        pin_memory=True,
    )