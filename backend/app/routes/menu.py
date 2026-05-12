from collections import defaultdict
from typing import Dict, List

from fastapi import APIRouter

from app.db.mongo import get_db
from app.schemas.menu import MenuItem

router = APIRouter(prefix="/api", tags=["menu"])


@router.get("/menu", response_model=Dict[str, List[MenuItem]])
async def get_menu():
    menu_items = await get_db().menu_items.find({}, {"_id": 0}).to_list(length=200)
    grouped: Dict[str, List[MenuItem]] = defaultdict(list)
    for item in menu_items:
        grouped[item["category"]].append(item)
    return dict(grouped)
