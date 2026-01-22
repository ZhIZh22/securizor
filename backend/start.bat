@echo off
echo ====================================
echo Запуск FastAPI бэкенда для Securizor
echo ====================================
echo.

REM Проверяем наличие .env файла
if not exist .env (
    echo [ОШИБКА] Файл .env не найден!
    echo.
    echo Создайте файл .env на основе env.example:
    echo   copy env.example .env
    echo.
    echo Затем заполните TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID
    echo.
    pause
    exit /b 1
)

echo Запуск сервера на http://localhost:8001
echo Нажмите Ctrl+C для остановки
echo.

uvicorn main:app --reload --port 8001
