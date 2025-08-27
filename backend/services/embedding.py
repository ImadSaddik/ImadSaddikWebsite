from typing import List, Optional

from google import genai


def get_query_embedding(query_text: str) -> Optional[List[float]]:
    try:
        google_client = genai.Client()
        result = google_client.models.embed_content(
            model="gemini-embedding-001", contents=query_text
        )
        if result is None:
            raise ValueError("No result returned from embedding model.")

        if not hasattr(result, "embeddings") or result.embeddings is None:
            raise ValueError("No embeddings found in result.")

        embeddings = result.embeddings[0].values
        return embeddings
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return None
