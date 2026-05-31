from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
import json, uuid

from app.database import get_db
from app.auth import verify_token
from app.models.project import Project
from app.schemas.schemas import ProjectOut, ProjectCreate, ProjectUpdate
from app.services.uploadcare_service import upload_file, delete_file

router = APIRouter()

def _to_out(p: Project) -> dict:
    return {
        "id": p.id, "title": p.title, "cat": p.cat,
        "short": p.short, "full": p.full,
        "tags": [t.strip() for t in p.tags.split(",") if t.strip()],
        "github": p.github, "live": p.live,
        "mediaType": p.media_type, "mediaSrc": p.media_src,
        "featured": p.featured, "sort_order": p.sort_order,
    }

# ── PUBLIC
@router.get("/", response_model=List[dict])
async def list_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).order_by(Project.sort_order, Project.id))
    return [_to_out(p) for p in result.scalars().all()]

# ── ADMIN: create (JSON, no media)
@router.post("/", dependencies=[Depends(verify_token)])
async def create_project(body: ProjectCreate, db: AsyncSession = Depends(get_db)):
    p = Project(
        title=body.title, cat=body.cat, short=body.short, full=body.full,
        tags=",".join(body.tags), github=body.github, live=body.live,
        featured=body.featured,
    )
    db.add(p); await db.commit(); await db.refresh(p)
    return _to_out(p)

# ── ADMIN: update fields
@router.put("/{pid}", dependencies=[Depends(verify_token)])
async def update_project(pid: int, body: ProjectUpdate, db: AsyncSession = Depends(get_db)):
    p = await db.get(Project, pid)
    if not p: raise HTTPException(404, "Not found")
    p.title=body.title; p.cat=body.cat; p.short=body.short; p.full=body.full
    p.tags=",".join(body.tags); p.github=body.github; p.live=body.live; p.featured=body.featured
    await db.commit(); await db.refresh(p)
    return _to_out(p)

# ── ADMIN: upload media (image or video) to Cloudinary
@router.post("/{pid}/media", dependencies=[Depends(verify_token)])
async def upload_media(pid: int, file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    p = await db.get(Project, pid)
    if not p: raise HTTPException(404, "Not found")
    # delete old media from Cloudinary
    if p.media_pid:
        delete_file(p.media_pid)
    data = await file.read()
    fname = f"project_{pid}_{uuid.uuid4().hex[:8]}"
    result = upload_file(data, fname)
    p.media_src = result["url"]
    p.media_pid = result["public_id"]
    p.media_type = "video" if result["type"] == "video" else "image"
    await db.commit(); await db.refresh(p)
    return _to_out(p)

# ── ADMIN: remove media
@router.delete("/{pid}/media", dependencies=[Depends(verify_token)])
async def remove_media(pid: int, db: AsyncSession = Depends(get_db)):
    p = await db.get(Project, pid)
    if not p: raise HTTPException(404, "Not found")
    if p.media_pid:
        delete_file(p.media_pid)
    p.media_src = ""; p.media_pid = ""; p.media_type = "none"
    await db.commit()
    return _to_out(p)

# ── ADMIN: delete project
@router.delete("/{pid}", dependencies=[Depends(verify_token)])
async def delete_project(pid: int, db: AsyncSession = Depends(get_db)):
    p = await db.get(Project, pid)
    if not p: raise HTTPException(404, "Not found")
    if p.media_pid:
        delete_file(p.media_pid)
    await db.delete(p); await db.commit()
    return {"ok": True}
