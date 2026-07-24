from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
from models import Base

from routers.auth_router import router as auth_router
from routers.recipe_router import router as recipe_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Home Chef Buddy API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(recipe_router)


@app.get("/")
def home():
    return {
        "message": "Home Chef Buddy Backend Running"
    }