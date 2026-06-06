from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Any
from pydantic import BaseModel
import json

from app.database import get_db
from app.auth import verify_token
from app.models.content import Content

router = APIRouter()

class ContentIn(BaseModel):
    value: Any

@router.get("/{key}")
async def get_content(key: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Content).where(Content.key == key))
    row = result.scalar_one_or_none()
    if row is None:
        return {"key": key, "value": None}
    return {"key": key, "value": json.loads(row.value)}

@router.put("/{key}", dependencies=[Depends(verify_token)])
async def set_content(key: str, body: ContentIn, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Content).where(Content.key == key))
    row = result.scalar_one_or_none()
    if row is None:
        row = Content(key=key, value=json.dumps(body.value))
        db.add(row)
    else:
        row.value = json.dumps(body.value)
    await db.commit()
    return {"key": key, "value": body.value}
