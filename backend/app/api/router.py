from fastapi import APIRouter
from app.api.endpoints import health, pdf, analyzer

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(pdf.router)
api_router.include_router(analyzer.router)
