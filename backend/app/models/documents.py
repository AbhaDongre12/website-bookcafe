from typing import TypedDict


class CafeProfileDocument(TypedDict):
    name: str
    concept: str
    location: str
    hours: str
    contact: str
    average_rating: float


class ReviewDocument(TypedDict):
    reviewer_name: str
    rating: float
    comment: str


class BookDocument(TypedDict):
    title: str
    author: str
    genre: str
    available: bool


class MenuItemDocument(TypedDict):
    name: str
    category: str
    price: float
    icon: str
