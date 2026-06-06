from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Content(Base):
    __tablename__ = "content"
    id    = Column(Integer, primary_key=True)
    key   = Column(String(64), unique=True, nullable=False, index=True)
    value = Column(Text, nullable=False, default="null")
