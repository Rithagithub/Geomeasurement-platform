import uuid
from sqlalchemy import Column, String, Integer, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class FeatureModel(Base):
    __tablename__ = "features"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    file_id = Column(String(36), ForeignKey("files.id", ondelete="CASCADE"), nullable=False, index=True)
    feature_index = Column(Integer, nullable=False)
    geometry_type = Column(String(50), nullable=False)
    geometry = Column(Text, nullable=False)  # WKT string representation
    properties = Column(JSON, nullable=True, default=dict)
    source_crs = Column(String(100), nullable=True)

    file = relationship("FileModel", back_populates="features")
    measurements = relationship("MeasurementModel", back_populates="feature", cascade="all, delete-orphan")
