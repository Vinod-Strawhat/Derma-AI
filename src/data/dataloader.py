"""
PyTorch DataLoader utilities for the HAM10000 dataset.

Provides reusable helper functions to create training and validation
DataLoaders.
"""

from torch.utils.data import DataLoader, Dataset


DEFAULT_BATCH_SIZE = 32
DEFAULT_NUM_WORKERS = 0


def get_train_dataloader(
    dataset: Dataset,
    batch_size: int = DEFAULT_BATCH_SIZE,
    num_workers: int = DEFAULT_NUM_WORKERS,
) -> DataLoader:
    """
    Create the training DataLoader.

    Args:
        dataset: Training dataset.
        batch_size: Number of samples per batch.
        num_workers: Number of worker processes.

    Returns:
        Configured training DataLoader.
    """
    return DataLoader(
        dataset=dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers,
        drop_last=False,
    )


def get_validation_dataloader(
    dataset: Dataset,
    batch_size: int = DEFAULT_BATCH_SIZE,
    num_workers: int = DEFAULT_NUM_WORKERS,
) -> DataLoader:
    """
    Create the validation DataLoader.

    Args:
        dataset: Validation dataset.
        batch_size: Number of samples per batch.
        num_workers: Number of worker processes.

    Returns:
        Configured validation DataLoader.
    """
    return DataLoader(
        dataset=dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        drop_last=False,
    )