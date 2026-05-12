from typing import List

from fastapi import APIRouter

from app.db.mongo import get_db
from app.schemas.review import Review

router = APIRouter(prefix="/api", tags=["reviews"])


@router.get("/reviews", response_model=List[Review])
async def get_reviews():
    reviews = await get_db().reviews.find({}, {"_id": 0}).to_list(length=20)
    return reviews
