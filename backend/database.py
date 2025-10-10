import sqlite3
from contextlib import contextmanager
from pathlib import Path
from sqlite3 import Connection
from typing import Generator

from models.visitor import Visitor

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
                ip_address TEXT PRIMARY KEY,
                country TEXT NOT NULL,
                first_visit_date TEXT NOT NULL,
                visit_count INTEGER NOT NULL DEFAULT 1
            )
        """
        )
        connection.commit()


def add_visitor(ip_address: str, country: str) -> None:
    with get_database_connection() as connection:
        cursor = connection.cursor()
        cursor.execute(
            """
            INSERT INTO visitors (ip_address, country, first_visit_date, visit_count)
            VALUES (?, ?, datetime('now'), 1)
            ON CONFLICT(ip_address) DO UPDATE SET
                visit_count = visit_count + 1;
            """,
            (ip_address, country),
        )
        connection.commit()


def get_visitor_by_ip(ip_address: str) -> Visitor | None:
    with get_database_connection() as connection:
        cursor = connection.cursor()
        cursor.execute(
            "SELECT ip_address, country, first_visit_date, visit_count FROM visitors WHERE ip_address = ?",
            (ip_address,),
        )
        row = cursor.fetchone()
        if row:
            return Visitor(
                ip_address=row[0],
                country=row[1],
                first_visit_date=row[2],
                visit_count=row[3],
            )
        return None
