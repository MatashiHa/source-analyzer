"""empty message

Revision ID: 2ca37d4b5986
Revises: 7a0040760708
Create Date: 2025-04-27 17:36:24.500995

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import pgvector


# revision identifiers, used by Alembic.
revision: str = '2ca37d4b5986'
down_revision: Union[str, None] = '7a0040760708'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('documents', 'content',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('documents', 'url',
               existing_type=sa.VARCHAR(),
               nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('documents', 'url',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('documents', 'content',
               existing_type=sa.VARCHAR(),
               nullable=False)
    # ### end Alembic commands ###
