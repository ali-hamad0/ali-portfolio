from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.database import get_db
from app.auth import verify_token
from app.models.recommendation import Recommendation

router = APIRouter()

class RecIn(BaseModel):
    name:        str
    title:       str = ""
    institution: str = ""
    quote:       str = ""
    avatar:      str = ""
    sort_order:  int = 0

def _out(r: Recommendation) -> dict:
    return {
        "id": r.id, "name": r.name, "title": r.title,
        "institution": r.institution, "quote": r.quote,
        "avatar": r.avatar, "sort_order": r.sort_order,
    }

@router.get("/")
async def list_recs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Recommendation).order_by(Recommendation.sort_order, Recommendation.id))
    return [_out(r) for r in result.scalars().all()]

@router.post("/", dependencies=[Depends(verify_token)])
async def create_rec(body: RecIn, db: AsyncSession = Depends(get_db)):
    rec = Recommendation(**body.model_dump())
    db.add(rec)
    await db.commit()
    await db.refresh(rec)
    return _out(rec)

@router.put("/{rec_id}", dependencies=[Depends(verify_token)])
async def update_rec(rec_id: int, body: RecIn, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Recommendation).where(Recommendation.id == rec_id))
    rec = result.scalar_one_or_none()
    if not rec:
        raise HTTPException(status_code=404)
    for k, v in body.model_dump().items():
        setattr(rec, k, v)
    await db.commit()
    await db.refresh(rec)
    return _out(rec)

@router.delete("/{rec_id}", dependencies=[Depends(verify_token)])
async def delete_rec(rec_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Recommendation).where(Recommendation.id == rec_id))
    rec = result.scalar_one_or_none()
    if rec:
        await db.delete(rec)
        await db.commit()
    return {"ok": True}
