@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install Node.js 18 or newer, then run this file again.
  pause
  exit /b 1
)
echo Walmart Display Studio - local only
echo Open http://127.0.0.1:4173/ in your browser after the Local message appears.
echo Keep this window open while using the studio. Close it to stop the server.
echo.
node server.mjs
pause
