@echo off
title Startup Cafe Launcher
echo ========================================================
echo   Starting Startup Cafe Ecosystem (Server, Website, Admin)
echo ========================================================
echo.

echo [1/3] Starting Backend Server (Port 5000)...
start "Startup Cafe - Backend Server (Port 5000)" cmd /k "cd /d "%~dp0server" && node server.js"

echo [2/3] Starting Customer Website (Port 5173)...
start "Startup Cafe - Customer Website (Port 5173)" cmd /k "cd /d "%~dp0client" && npm run dev"

echo [3/3] Starting Admin Panel (Port 5174)...
start "Startup Cafe - Admin Panel (Port 5174)" cmd /k "cd /d "%~dp0admin" && npm run dev"

echo.
echo All 3 apps are launching!
echo - Customer Website: http://localhost:5173
echo - Admin Panel:      http://localhost:5174
echo - Backend API:      http://localhost:5000
echo.
pause
