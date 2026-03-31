# test_db.py
from db import SessionLocal
from sqlalchemy import text

db = SessionLocal()

try:
    # Wrap raw SQL in text()
    result = db.execute(text("SELECT 1"))
    print("DB Connected:", result.fetchone())
finally:
    db.close()