import sqlite3
from contextlib import contextmanager
from pathlib import Path
from sqlite3 import Connection
from typing import Generator

DB_FILE = Path(__file__).parent / "visitors.db"


@contextmanager
def get_database_connection() -> Generator[Connection, None, None]:
    connection = sqlite3.connect(DB_FILE)
    try:
        yield connection
    finally:
        connection.close()


def initialize_database() -> None:
    with get_database_connection() as connection:
        cursor = connection.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS visitors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ip_address TEXT NOT NULL,
                country TEXT NOT NULL,
                visit_date TEXT NOT NULL,
                visited_page TEXT NOT NULL DEFAULT 'HOME',
                is_bot INTEGER NOT NULL DEFAULT 0
            )
        """
        )
        connection.commit()


def add_visitor(ip_address: str, country: str, visited_page: str = "HOME", is_bot: bool = False) -> None:
    with get_database_connection() as connection:
        cursor = connection.cursor()
        cursor.execute(
            """
            INSERT INTO visitors (ip_address, country, visit_date, visited_page, is_bot)
            VALUES (?, ?, datetime('now'), ?, ?)
            """,
            (ip_address, country, visited_page, int(is_bot)),
        )
        connection.commit()
