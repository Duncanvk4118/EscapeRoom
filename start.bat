@echo off
SET "REPO_ROOT=%~dp0"

echo Starting frontend...
start "Frontend" /D "%REPO_ROOT%\frontend" cmd /k npm start

echo Starting backend...
start "Backend" /D "%REPO_ROOT%\backend" cmd /k npm run dev

echo Both windows launched. Close this window if you don't need the launcher.
pause >nul
