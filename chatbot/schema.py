# schema.py
from pydantic import BaseModel

# Request schema (from React → FastAPI)
class Message(BaseModel):
    user_input: str

# Response schema (FastAPI → React)
class BotResponse(BaseModel):
    response: str

# Optional: Chat history schema (if you want to return history later)
class ChatHistorySchema(BaseModel):
    id: int
    user_input: str
    bot_response: str

    class Config:
        from_attributes = True   # ✅ for SQLAlchemy compatibility (Pydantic v2)