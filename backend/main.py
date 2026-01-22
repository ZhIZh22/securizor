"""
FastAPI бэкенд для отправки заявок в Telegram
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

app = FastAPI(title="Securizor Telegram API")

# Настройка CORS для работы с фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене укажите конкретный домен
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Получаем токен и chat_id из переменных окружения
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

# Проверяем наличие обязательных переменных
if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
    raise ValueError(
        "Необходимо установить TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в .env файле"
    )


class FormData(BaseModel):
    """Модель данных формы"""
    name: str
    contact: str
    comment: str
    theme: str
    platform: str  # Платформа для связи (WhatsApp, Telegram, Email, Телефон)


@app.get("/")
async def root():
    """Проверка работоспособности API"""
    return {"status": "ok", "message": "Securizor Telegram API работает"}


@app.post("/api/send-form")
async def send_form(form_data: FormData):
    """
    Отправка данных формы в Telegram
    
    Args:
        form_data: Данные формы (имя, контакт, вопрос, тема, платформа)
    
    Returns:
        dict: Результат отправки
    """
    try:
        # Формируем сообщение для Telegram
        theme_line = f"\n📋 <b>Тема:</b> {form_data.theme}\n" if form_data.theme and form_data.theme != "Не указано" else ""
        
        message = f"""🔔 <b>Новая заявка с сайта</b>{theme_line}
👤 <b>Имя:</b> {form_data.name}

📱 <b>Платформа для связи:</b> {form_data.platform}

📞 <b>Контакт:</b> {form_data.contact}

💬 <b>Вопрос:</b>
{form_data.comment}"""

        # URL для отправки сообщения в Telegram
        telegram_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"

        # Данные для отправки
        payload = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": message,
            "parse_mode": "HTML"
        }

        # Отправляем запрос в Telegram API
        async with httpx.AsyncClient() as client:
            response = await client.post(telegram_url, json=payload, timeout=10.0)
            response.raise_for_status()
            result = response.json()

            if result.get("ok"):
                return {
                    "success": True,
                    "message": "Заявка успешно отправлена в Telegram"
                }
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"Ошибка Telegram API: {result.get('description', 'Unknown error')}"
                )

    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при отправке в Telegram: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Внутренняя ошибка сервера: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
