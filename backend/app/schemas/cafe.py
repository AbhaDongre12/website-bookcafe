from pydantic import BaseModel


class CafeProfile(BaseModel):
    name: str
    concept: str
    location: str
    hours: str
    contact: str
    average_rating: float
