"""Initial database migration for files, features, and measurements tables.

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-10-08 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create files table
    op.create_table(
        'files',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('filename', sa.String(length=255), nullable=False),
        sa.Column('original_filename', sa.String(length=255), nullable=False),
        sa.Column('file_type', sa.String(length=50), nullable=False),
        sa.Column('crs', sa.String(length=100), nullable=True),
        sa.Column('feature_count', sa.Integer(), nullable=True, default=0),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Create features table
    op.create_table(
        'features',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('file_id', sa.String(length=36), nullable=False),
        sa.Column('feature_index', sa.Integer(), nullable=False),
        sa.Column('geometry_type', sa.String(length=50), nullable=False),
        sa.Column('geometry', sa.Text(), nullable=False),
        sa.Column('properties', sa.JSON(), nullable=True),
        sa.Column('source_crs', sa.String(length=100), nullable=True),
        sa.ForeignKeyConstraint(['file_id'], ['files.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_features_file_id'), 'features', ['file_id'], unique=False)

    # Create measurements table
    op.create_table(
        'measurements',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('feature_id', sa.String(length=36), nullable=False),
        sa.Column('measurement_type', sa.String(length=50), nullable=False),
        sa.Column('measurement_value', sa.Float(), nullable=False),
        sa.Column('unit', sa.String(length=20), nullable=False),
        sa.ForeignKeyConstraint(['feature_id'], ['features.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_measurements_feature_id'), 'measurements', ['feature_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_measurements_feature_id'), table_name='measurements')
    op.drop_table('measurements')
    op.drop_index(op.f('ix_features_file_id'), table_name='features')
    op.drop_table('features')
    op.drop_table('files')
