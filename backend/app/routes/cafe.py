from fastapi import APIRouter

from app.db.mongo import get_db
from app.schemas.cafe import CafeProfile

router = APIRouter(prefix="/api", tags=["cafe"])


@router.get("/cafe", response_model=CafeProfile)
async def get_cafe_profile():
    cafe = await get_db().cafe_profile.find_one({}, {"_id": 0})
    if not cafe:
        return CafeProfile(
            name="The Turning Page Cafe",
            concept="A cozy book cafe where stories and coffee meet.",
            location="Maple Street, Pune",
            hours="8:00 AM - 9:00 PM",
            contact="+91 98765 43210",
            average_rating=4.7,
        )
    return cafe
