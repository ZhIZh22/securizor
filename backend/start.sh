#!/bin/bash

echo "===================================="
echo "Запуск FastAPI бэкенда для Securizor"
echo "===================================="
echo ""

# Проверяем наличие .env файла
if [ ! -f .env ]; then
    echo "[ОШИБКА] Файл .env не найден!"
    echo ""
    echo "Создайте файл .env на основе env.example:"
    echo "  cp env.example .env"
    echo ""
    echo "Затем заполните TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID"
    echo ""
    exit 1
fi

echo "Запуск сервера на http://localhost:8001"
echo "Нажмите Ctrl+C для остановки"
echo ""

uvicorn main:app --reload --port 8001
