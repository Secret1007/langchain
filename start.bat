@echo off
echo 启动开发环境...

start "后端" cmd /k "cd backend && python \"main copy.py\""
timeout /t 2 /nobreak >nul
start "前端" cmd /k "cd frontend && npm start"

echo 服务已启动!
echo 前端: http://localhost:3000
echo 后端: http://localhost:8000
pause
