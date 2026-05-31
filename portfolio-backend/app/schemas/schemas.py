from pydantic import BaseModel
from typing import List, Optional

# ── AUTH
class LoginRequest(BaseModel):
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ── PROJECTS
class ProjectOut(BaseModel):
    id: int
    title: str
    cat: str
    short: str
    full: str
    tags: List[str]
    github: str
    live: str
    mediaType: str
    mediaSrc: str
    featured: bool
    sort_order: int

    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    title: str
    cat: str = "SaaS"
    short: str = ""
    full: str = ""
    tags: List[str] = []
    github: str = ""
    live: str = ""
    featured: bool = False

class ProjectUpdate(ProjectCreate):
    pass

# ── SKILLS
class SkillCategoryOut(BaseModel):
    id: int
    category: str
    items: List[str]
    sort_order: int

    class Config:
        from_attributes = True

class SkillCategoryIn(BaseModel):
    category: str
    items: List[str]

# ── BIO
class BioOut(BaseModel):
    id: int
    name: str
    title: str
    email: str
    github: str
    linkedin: str
    cv_url: str
    portrait: str

    class Config:
        from_attributes = True

class BioIn(BaseModel):
    name: str
    title: str
    email: str
    github: str
    linkedin: str
    cv_url: str
