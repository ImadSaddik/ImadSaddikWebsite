# Meilisearch seed data

This folder has files you can use to set up a new Meilisearch server with the right data and settings. It helps anyone who wants to run the project on their own computer if they don't have access to the main Meilisearch server.

## Directory structure

- `index_settings.json`: Contains the Meilisearch index configuration (searchable attributes, filterable attributes, sortable attributes, ranking rules, etc.).
- `documents.json`: A JSON array of articles and documents to be indexed.

## How to seed meilisearch

To load the settings and documents into your local Meilisearch instance, run the following script from the project root:

```bash
python backend/scripts/seed_meilisearch.py
```

## Maintenance

Whenever you finish working on a new blog post, course, or astronomy article, you can update `documents.json` with the new content to ensure it's preserved and can be easily reloaded if you move to a different machine.
