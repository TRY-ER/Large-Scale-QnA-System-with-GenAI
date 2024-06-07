from pathlib import Path 
import os
from dotenv import load_dotenv
env_path = Path("./.env")
load_dotenv(dotenv_path = env_path)

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from api.chat.chat_points import router as chat_router

from setup import do_setup


do_setup()

app = FastAPI()
CLIENT = os.environ["CLIENT"]

origins = [
    CLIENT,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix='/chat', tags=['chat'])