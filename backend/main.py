from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

from backend.routers import phishing, factcheck, link

load_dotenv()

app = FastAPI(title="Agent Aegis", description="AI 기반 개인 보안 어시스턴트")

app.include_router(phishing.router, prefix="/api")
app.include_router(factcheck.router, prefix="/api")
app.include_router(link.router, prefix="/api")

app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
