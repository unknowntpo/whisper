from sqlalchemy import create_engine, inspect, text
from sqlmodel import SQLModel, Session
import os

# PostgreSQL connection parameters
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5433")
DB_NAME = os.getenv("DB_NAME", "app_db")


def get_postgres_url(db_name=None):
    """Generate a PostgreSQL connection URL for the given database name."""
    db_to_use = db_name or DB_NAME
    return f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{db_to_use}"


# Create engine at module level
is_test = eval(os.getenv("TEST", "False"))
if is_test:
    test_db_name = f"{DB_NAME}_test"
    postgres_url = get_postgres_url(test_db_name)
else:
    postgres_url = get_postgres_url()

engine = create_engine(postgres_url)


def create_test_database():
    test_db_name = f"{DB_NAME}_test"
    # Create connection to default postgres database to create test db if needed
    temp_url = get_postgres_url("postgres")
    # Create engine with autocommit enabled for database creation
    temp_engine = create_engine(temp_url, isolation_level="AUTOCOMMIT")

    with temp_engine.connect() as conn:
        # Check if test database exists
        result = conn.execute(
            text(f"SELECT 1 FROM pg_database WHERE datname = '{test_db_name}'")
        )
        if not result.scalar():
            print(f"Creating test database: {test_db_name}")
            conn.execute(text(f"CREATE DATABASE {test_db_name}"))
            # No need to commit with autocommit enabled

    # Update connection URL to use test database
    test_postgres_url = get_postgres_url(test_db_name)
    test_engine = create_engine(test_postgres_url)
    print(f"Using test database: {test_db_name}")

    return test_postgres_url, test_engine


def create_db_and_tables():
    global engine, postgres_url

    is_test = eval(os.getenv("TEST", "False"))
    print(f"is test: {is_test}")

    if is_test:
        postgres_url, engine = create_test_database()
    else:
        # Engine already created at module level, just ensure tables exist
        pass

    print(f"postgres_url: {postgres_url}")
    print(f"engine: {engine}")

    SQLModel.metadata.create_all(engine)

    print("Database tables:")
    for table in SQLModel.metadata.tables.keys():
        print(f"- {table}")
