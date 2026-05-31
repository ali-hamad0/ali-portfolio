from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Bio(Base):
    __tablename__ = "bio"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String, default="Ali Hamad")
    title       = Column(String, default="AI & Software Engineer")
    email       = Column(String, default="")
    github      = Column(String, default="")
    linkedin    = Column(String, default="")
    cv_url      = Column(String, default="")
    portrait    = Column(Text, default="")       # Cloudinary URL
    portrait_pid = Column(String, default="")   # Cloudinary public_id
