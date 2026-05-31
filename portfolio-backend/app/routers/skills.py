from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List

from app.database import get_db
from app.auth import verify_token
from app.models.skill import Skill
from app.schemas.schemas import SkillCategoryIn

router = APIRouter()

def _to_out(s: Skill) -> dict:
    return {
        "id": s.id, "category": s.category,
        "items": [i.strip() for i in s.items.split(",") if i.strip()],
        "sort_order": s.sort_order,
    }

@router.get("/")
async def list_skills(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Skill).order_by(Skill.sort_order, Skill.id))
    return [_to_out(s) for s in result.scalars().all()]

@router.put("/", dependencies=[Depends(verify_token)])
async def save_skills(body: List[SkillCategoryIn], db: AsyncSession = Depends(get_db)):
    """Replace all skill categories with the new list."""
    await db.execute(delete(Skill))
    for i, cat in enumerate(body):
        db.add(Skill(category=cat.category, items=",".join(cat.items), sort_order=i))
    await db.commit()
    result = await db.execute(select(Skill).order_by(Skill.sort_order))
    return [_to_out(s) for s in result.scalars().all()]
