import json
import sys
from pathlib import Path

import meilisearch
from meilisearch.index import Index

# Add parent directory to path to import from core
sys.path.insert(0, str(Path(__file__).parent.parent))

from core.config import settings


def seed_settings(meilisearch_client: meilisearch.Client, index: Index) -> None:
    settings_path = Path(__file__).parent.parent / "seed" / "index_settings.json"

    if not settings_path.exists():
        print(f"Settings file not found at {settings_path}")
        return

    with open(settings_path, "r") as f:
        index_settings = json.load(f)

    print("Updating index settings")
    task = index.update_settings(index_settings)
    meilisearch_client.wait_for_task(task.task_uid)
    print("Index settings updated successfully!")


def seed_documents(meilisearch_client: meilisearch.Client, index: Index) -> None:
    documents_path = Path(__file__).parent.parent / "seed" / "documents.json"

    if not documents_path.exists():
        print(f"Documents file not found at {documents_path}")
        return

    with open(documents_path, "r") as f:
        documents = json.load(f)

    if not documents:
        print("No documents found in the seed file.")
        return

    print(f"Adding {len(documents)} documents to the index")
    task = index.add_documents(documents)
    meilisearch_client.wait_for_task(task.task_uid)
    print("Documents added successfully!")


def main() -> None:
    print("=" * 60)
    print("Seed Meilisearch with real data")
    print("=" * 60)
    print(f"Meilisearch URL: {settings.MEILISEARCH_URL}")
    print(f"Index name: {settings.MEILISEARCH_INDEX_NAME}")
    print("=" * 60)

    try:
        print("\nConnecting to Meilisearch")
        meilisearch_client = meilisearch.Client(url=settings.MEILISEARCH_URL, api_key=settings.MEILISEARCH_MASTER_KEY)

        try:
            meilisearch_client.create_index(settings.MEILISEARCH_INDEX_NAME, {"primaryKey": "id"})
            print(f"Created index '{settings.MEILISEARCH_INDEX_NAME}'")
        except Exception:
            print(f"Index '{settings.MEILISEARCH_INDEX_NAME}' already exists or could not be created.")

        index = meilisearch_client.index(settings.MEILISEARCH_INDEX_NAME)
        print("Successfully connected to Meilisearch!")

        seed_settings(meilisearch_client, index)
        seed_documents(meilisearch_client, index)

    except Exception as e:
        print(f"\nAn error occurred: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
