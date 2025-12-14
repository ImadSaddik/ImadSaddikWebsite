import sys
from pathlib import Path

import meilisearch

# Add parent directory to path to import from core
sys.path.insert(0, str(Path(__file__).parent.parent))

from core.config import settings


def fetch_all_documents(index: meilisearch.index.Index) -> list:
    all_documents = []
    limit = 1000
    offset = 0

    print(f"Fetching all documents from the '{index.uid}' index...")

    while True:
        response = index.get_documents({"limit": limit, "offset": offset})
        batch = response.results
        all_documents.extend(batch)

        if len(batch) < limit:
            break

        offset += limit

    print(f"Total documents retrieved: {len(all_documents)}")
    return all_documents


def reset_counts(meilisearch_client: meilisearch.Client, index: meilisearch.index.Index) -> None:
    all_documents = fetch_all_documents(index)

    if not all_documents:
        print("No documents found in the index.")
        return

    documents_to_update = []
    for document in all_documents:
        documents_to_update.append({"id": document.id, "view_count": 0, "claps_count": 0, "read_count": 0})

    print(f"Resetting counts for {len(documents_to_update)} documents...")
    task = index.update_documents(documents_to_update)
    meilisearch_client.wait_for_task(task.task_uid)
    print("✓ Counts have been successfully reset!")

    print("\nVerifying the changes...")
    updated_documents = fetch_all_documents(index)

    errors = []
    for document in updated_documents:
        if document.view_count != 0 or document.claps_count != 0 or document.read_count != 0:
            errors.append(f"Document {document.id} still has non-zero counts")

    if errors:
        print("✗ Verification failed:")
        for error in errors:
            print(f"  - {error}")
    else:
        print("✓ All documents have been successfully verified!")


def main():
    print("=" * 60)
    print("Reset Meilisearch count fields script")
    print("=" * 60)
    print(f"Meilisearch URL: {settings.MEILISEARCH_URL}")
    print(f"Index Name: {settings.MEILISEARCH_INDEX_NAME}")
    print("=" * 60)

    confirmation = input(
        "\nThis will reset view_count, read_count, and claps_count to 0 for ALL documents. Continue? (yes/no): "
    )

    if confirmation.lower() != "yes":
        print("Operation cancelled.")
        return

    try:
        print("\nConnecting to Meilisearch...")
        meilisearch_client = meilisearch.Client(url=settings.MEILISEARCH_URL, api_key=settings.MEILISEARCH_MASTER_KEY)
        index = meilisearch_client.index(settings.MEILISEARCH_INDEX_NAME)
        print("✓ Successfully connected to Meilisearch!")

        reset_counts(meilisearch_client, index)

    except Exception as e:
        print(f"\n✗ An error occurred: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
    main()
