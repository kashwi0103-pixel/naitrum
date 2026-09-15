@echo off
title DR-Sahayak Backend Server
echo ==========================================
echo  DR-Sahayak AI Backend
echo  Running on http://127.0.0.1:8000
echo ==========================================
echo.
echo Starting FastAPI server... (keep this window open)
echo.

cd /d "%~dp0backend"

call ..\.venv\Scripts\activate.bat

python -m uvicorn main:app --reload --port 8000

pause
