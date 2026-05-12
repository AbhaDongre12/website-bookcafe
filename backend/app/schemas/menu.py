from pydantic import BaseModel


class MenuItem(BaseModel):
    name: str
    category: str
    price: float
    icon: str
