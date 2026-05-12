import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.books import router as books_router
from app.routes.cafe import router as cafe_router
from app.routes.menu import router as menu_router
from app.routes.reviews import router as reviews_router

load_dotenv()

app = FastAPI(title=os.getenv("APP_NAME", "Book Cafe API"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "ok"}


app.include_router(cafe_router)
app.include_router(reviews_router)
app.include_router(books_router)
app.include_router(menu_router)
