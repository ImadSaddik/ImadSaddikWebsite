import re
import sys
from pathlib import Path

import meilisearch

sys.path.insert(0, str(Path(__file__).parent.parent))

from core.config import settings


def camel_to_kebab(name: str) -> str:
    name = re.sub("(.)([A-Z][a-z]+)", r"\1-\2", name)
    name = re.sub("([a-z0-9])([A-Z])", r"\1-\2", name)
    return name.lower()


def migrate() -> None:
    print(f"Connecting to Meilisearch at {settings.MEILISEARCH_URL}")
    try:
        client = meilisearch.Client(settings.MEILISEARCH_URL, settings.MEILISEARCH_MASTER_KEY)
        index = client.index(settings.MEILISEARCH_INDEX_NAME)

        client.health()
    except Exception as e:
        print(f"Could not connect to Meilisearch: {e}")
        return

    try:
        documents = index.get_documents({"limit": 10000}).results
        print(f"Found {len(documents)} documents.")
    except Exception as e:
        print(f"Error fetching documents: {e}")
        return

    updates = []

    for document in documents:
        doc_dict = vars(document)
        old_name = doc_dict.get("name")

        if not old_name:
            continue

        new_name = camel_to_kebab(old_name)

        if old_name != new_name:
            print(f"Renaming '{old_name}' -> '{new_name}'")
            doc_dict["name"] = new_name
            updates.append(doc_dict)

    if updates:
        print(f"Updating {len(updates)} documents...")
        try:
            task = index.update_documents(updates)
            print(f"Update task submitted. Task UID: {task.task_uid}")
            client.wait_for_task(task.task_uid)
            print("Migration completed successfully.")
        except Exception as e:
            print(f"Error updating documents: {e}")
    else:
        print("No updates needed.")


if __name__ == "__main__":
    migrate()
