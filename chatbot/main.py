from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from db import SessionLocal, init_db, ChatHistory
from schema import Message, BotResponse
import queries

# 🔹 Initialize DB
init_db()

# 🔹 Create FastAPI app
app = FastAPI(title="AI Chatbot with DB + Ollama")

# 🔹 Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ MAIN RESPONSE FUNCTION
def generate_response(user_input: str, db: Session):
    user_input_lower = user_input.lower()

    # 🔥 normalize typo
    user_input_lower = user_input_lower.replace("transfered", "transferred")

    result = None

    try:
        # ✅ TOTAL
        if "total assets" in user_input_lower:
            count = db.execute(queries.get_total_assets()).scalar()
            return f"Total assets: {count}"

        # ✅ SHOW ALL
        elif "show all assets" in user_input_lower or "list all assets" in user_input_lower:
            result = db.execute(queries.show_all_assets())

        # ✅ SHOW DAMAGED BUT REPAIRED (FIRST PRIORITY)
        elif "show" in user_input_lower and ("repaired" in user_input_lower or "dmg-rep" in user_input_lower):
            result = db.execute(queries.show_dmg_repaired())

        # ✅ SHOW DAMAGED
        elif "show" in user_input_lower and "damaged" in user_input_lower:
            result = db.execute(queries.show_damaged())

        # ✅ SHOW AVAILABLE
        elif "show" in user_input_lower and "available" in user_input_lower:
            result = db.execute(queries.show_available())

        # ✅ SHOW TRANSFERRED
        elif "show" in user_input_lower and ("transferred" in user_input_lower or "ltrf" in user_input_lower):
            result = db.execute(queries.show_ltrf())

        # ✅ SHOW IN USE
        elif "show" in user_input_lower and ("in use" in user_input_lower or "working" in user_input_lower):
            result = db.execute(queries.show_in_use())

        # ✅ SHOW RETIRED
        elif "show" in user_input_lower and "retired" in user_input_lower:
            result = db.execute(queries.show_retired())

        # ✅ COUNT DAMAGED
        elif "damaged" in user_input_lower:
            count = db.execute(queries.count_damaged()).scalar()
            return f"{count} assets are damaged"

        # ✅ COUNT AVAILABLE
        elif "available" in user_input_lower:
            count = db.execute(queries.count_available()).scalar()
            return f"Available assets: {count}"

        else:
            return "I don't understand that query. Please ask about assets."

        # 🔥 FORMAT TABLE RESPONSE
        rows = result.fetchall()

        if not rows:
            return "No data found."

        columns = result.keys()

        header = " | ".join(columns)
        separator = " | ".join(["---"] * len(columns))

        rows_data = []
        for row in rows:
            rows_data.append(" | ".join([str(val) for val in row]))

        return f"{header}\n{separator}\n" + "\n".join(rows_data)

    except Exception as e:
        print("Error:", e)
        db.rollback()
        return "❌ Something went wrong. Please try again."


# ✅ CHAT API
@app.post("/chat", response_model=BotResponse)
def chat_endpoint(msg: Message, db: Session = Depends(get_db)):

    if not msg.user_input.strip():
        raise HTTPException(status_code=400, detail="Empty input not allowed")

    greetings = ["hi", "hello", "hey", "good morning", "good evening"]

    if msg.user_input.strip().lower() in greetings:
        bot_response = "Hello! 👋 Ask me about assets, locations, status, or departments."
    else:
        bot_response = generate_response(msg.user_input, db)

    # 💾 Save chat history
    try:
        chat_record = ChatHistory(
            user_input=msg.user_input,
            bot_response=bot_response
        )
        db.add(chat_record)
        db.commit()
        db.refresh(chat_record)
    except Exception as e:
        print("DB Save Error:", e)

    return BotResponse(response=bot_response)


# ✅ HISTORY API
@app.get("/history")
def get_history(db: Session = Depends(get_db)):
    try:
        return db.query(ChatHistory).all()
    except Exception as e:
        return {"error": str(e)}

