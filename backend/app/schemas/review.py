from pydantic import BaseModel


class Review(BaseModel):
    reviewer_name: str
    rating: float
    comment: str
