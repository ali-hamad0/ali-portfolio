from sqlalchemy import Column, Integer, String, Boolean, Text, ARRAY
from sqlalchemy.dialects.postgresql import ARRAY as PG_ARRAY
from app.database import Base

class Project(Base):
    __tablename__ = "projects"

    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String, nullable=False)
    cat         = Column(String, default="SaaS")
    short       = Column(Text, default="")
    full        = Column(Text, default="")
    tags        = Column(Text, default="")      # stored as comma-separated
    github      = Column(String, default="")
    live        = Column(String, default="")
    media_type  = Column(String, default="none")  # none | image | video
    media_src   = Column(Text, default="")         # Cloudinary URL
    media_pid   = Column(String, default="")       # Cloudinary public_id for deletion
    featured    = Column(Boolean, default=False)
    sort_order  = Column(Integer, default=0)
