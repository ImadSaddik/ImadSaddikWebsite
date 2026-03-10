from contextlib import asynccontextmanager
from pathlib import Path
from typing import AsyncGenerator

import aiosqlite
from aiosqlite import Connection

DB_FILE = Path(__file__).parent / "visitors.db"


async def initialize_database() -> None:
    async with get_database_connection() as connection:
        await connection.execute(
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
        await connection.commit()


async def add_visitor(
    ip_address: str,
    country: str,
    visited_page: str = "HOME",
    is_bot: bool = False,
) -> None:
    async with get_database_connection() as connection:
        await connection.execute(
            """
            INSERT INTO visitors (ip_address, country, visit_date, visited_page, is_bot)
            VALUES (?, ?, datetime('now'), ?, ?)
            """,
            (ip_address, country, visited_page, int(is_bot)),
        )
        await connection.commit()


@asynccontextmanager
async def get_database_connection() -> AsyncGenerator[Connection, None]:
    async with aiosqlite.connect(DB_FILE) as connection:
        yield connection
