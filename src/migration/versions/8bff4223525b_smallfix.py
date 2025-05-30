"""smallfix

Revision ID: 8bff4223525b
Revises: fae2ad1b1a82
Create Date: 2025-04-17 16:41:26.940034

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8bff4223525b'
down_revision: Union[str, None] = 'fae2ad1b1a82'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('analyses', 'examples',
               existing_type=sa.VARCHAR(length=400),
               nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('analyses', 'examples',
               existing_type=sa.VARCHAR(length=400),
               nullable=False)
    # ### end Alembic commands ###
