@echo off
title DR-Sahayak - Full Stack Launcher
echo ================================================
echo  DR-Sahayak Full Stack Launcher
echo  Backend  : http://127.0.0.1:8000
echo  Frontend : http://localhost:5173
echo ================================================
echo.

REM --- Step 1: Start FastAPI Backend in a new window ---
echo [1/2] Starting FastAPI Backend (port 8000)...
start "DR-Sahayak Backend" cmd /k "cd /d "%~dp0backend" && call "..\.venv\Scripts\activate.bat" && python -m uvicorn main:app --port 8000"

REM --- Give the backend 5 seconds to fully initialise ---
echo Waiting 5s for backend to initialize...
timeout /t 5 /nobreak >nul

REM --- Step 2: Start Vite Frontend Dev Server in a new window ---
echo [2/2] Starting Vite Frontend (port 5173)...
start "DR-Sahayak Frontend" cmd /k "cd /d "%~dp0" && npm run dev"

echo.
echo Both servers are running in their own windows.
echo Close those windows to stop them.
echo.
pause
