from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from app.database import get_db
from app.auth import verify_token
from app.models.bio import Bio
from app.schemas.schemas import BioIn
from app.services.uploadcare_service import upload_file, delete_file

router = APIRouter()

async def _get_or_create(db: AsyncSession) -> Bio:
    result = await db.execute(select(Bio))
    bio = result.scalars().first()
    if not bio:
        bio = Bio(); db.add(bio); await db.commit(); await db.refresh(bio)
    return bio

def _to_out(b: Bio) -> dict:
    return {
        "id": b.id, "name": b.name, "title": b.title,
        "email": b.email, "github": b.github,
        "linkedin": b.linkedin, "cv_url": b.cv_url,
        "portrait": b.portrait,
    }

@router.get("/")
async def get_bio(db: AsyncSession = Depends(get_db)):
    return _to_out(await _get_or_create(db))

@router.put("/", dependencies=[Depends(verify_token)])
async def update_bio(body: BioIn, db: AsyncSession = Depends(get_db)):
    bio = await _get_or_create(db)
    bio.name=body.name; bio.title=body.title; bio.email=body.email
    bio.github=body.github; bio.linkedin=body.linkedin; bio.cv_url=body.cv_url
    await db.commit(); await db.refresh(bio)
    return _to_out(bio)

@router.post("/portrait", dependencies=[Depends(verify_token)])
async def upload_portrait(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    bio = await _get_or_create(db)
    if bio.portrait_pid:
        delete_file(bio.portrait_pid)
    data = await file.read()
    fname = f"portrait_{uuid.uuid4().hex[:8]}"
    result = upload_file(data, fname)
    bio.portrait = result["url"]
    bio.portrait_pid = result["public_id"]
    await db.commit(); await db.refresh(bio)
    return _to_out(bio)

@router.delete("/portrait", dependencies=[Depends(verify_token)])
async def remove_portrait(db: AsyncSession = Depends(get_db)):
    bio = await _get_or_create(db)
    if bio.portrait_pid:
        delete_file(bio.portrait_pid)
    bio.portrait = ""; bio.portrait_pid = ""
    await db.commit()
    return _to_out(bio)
