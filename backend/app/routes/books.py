from collections import defaultdict
from typing import Dict, List, Optional

from fastapi import APIRouter, Query

from app.db.mongo import get_db
from app.schemas.book import Book

router = APIRouter(prefix="/api", tags=["books"])


@router.get("/books", response_model=Dict[str, List[Book]])
async def get_books(genre: Optional[str] = Query(default=None)):
    query = {"genre": genre} if genre else {}
    books = await get_db().books.find(query, {"_id": 0}).to_list(length=200)
    grouped: Dict[str, List[Book]] = defaultdict(list)
    for book in books:
        grouped[book["genre"]].append(book)
    return dict(grouped)
