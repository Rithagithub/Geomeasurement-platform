import uuid
from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class MeasurementModel(Base):
    __tablename__ = "measurements"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    feature_id = Column(String(36), ForeignKey("features.id", ondelete="CASCADE"), nullable=False, index=True)
    measurement_type = Column(String(50), nullable=False)  # 'area' or 'length'
    measurement_value = Column(Float, nullable=False)
    unit = Column(String(20), nullable=False)  # 'm²' or 'm'

    feature = relationship("FeatureModel", back_populates="measurements")
