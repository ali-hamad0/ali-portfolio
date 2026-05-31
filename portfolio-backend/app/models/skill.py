from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Skill(Base):
    __tablename__ = "skills"

    id       = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)
    items    = Column(Text, default="")   # comma-separated
    sort_order = Column(Integer, default=0)
