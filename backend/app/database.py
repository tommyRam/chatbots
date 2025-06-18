import sqlalchemy
import sqlalchemy.ext.declarative as declarative
import sqlalchemy.orm as orm

from config import settings

DB_URL = settings.SQL_LITE_DB_URL
engine = sqlalchemy.create_engine(
    DB_URL,
    connect_args={"check_same_thread": False, "timeout": 15}
)

SessionLocal = orm.sessionmaker(autoflush=False, autocommit=False, bind=engine)
Base = declarative.declarative_base()

    