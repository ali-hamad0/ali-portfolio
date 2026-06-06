from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Recommendation(Base):
    __tablename__ = "recommendations"
    id          = Column(Integer, primary_key=True)
    name        = Column(String(120), nullable=False)
    title       = Column(String(200), nullable=False, default="")
    institution = Column(String(200), nullable=False, default="")
    quote       = Column(Text, nullable=False, default="")
    avatar      = Column(String(500), nullable=False, default="")
    sort_order  = Column(Integer, nullable=False, default=0)
