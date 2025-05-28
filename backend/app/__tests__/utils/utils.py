from sqlmodel import Session, SQLModel

from app.entities.hero import Hero
from app.infra.engine import engine

def trunk_all_tables():
    # Here you should add your database cleanup logic
    # For example, if you're using SQLAlchemy:
    with Session(engine) as session:
        for table in reversed(SQLModel.metadata.sorted_tables):
            session.execute(table.delete())
            session.commit()
