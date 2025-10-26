@echo off
echo ========================================
echo  启动 React-LangChain App (含 WebSocket)
echo ========================================
echo.

:: 检查后端依赖
echo [1/4] 检查后端依赖...
cd backend
if not exist "venv" (
    echo 创建虚拟环境...
    python -m venv venv
)

call venv\Scripts\activate
echo 安装/更新依赖...
pip install -q -r requirements.txt

:: 启动后端
echo.
echo [2/4] 启动后端服务 (含 WebSocket)...
start "Backend Server" cmd /k "cd /d %cd% && venv\Scripts\activate && python main.py"
timeout /t 3 /nobreak > nul

:: 检查前端依赖
echo.
echo [3/4] 检查前端依赖...
cd ..\frontend
if not exist "node_modules" (
    echo 安装前端依赖...
    call npm install
)

:: 启动前端
echo.
echo [4/4] 启动前端应用...
start "Frontend App" cmd /k "cd /d %cd% && npm start"

echo.
echo ========================================
echo  ✅ 启动完成！
echo ========================================
echo.
echo  后端: http://localhost:8000
echo  WebSocket: ws://localhost:8000/ws/writing-assistant/
echo  前端: http://localhost:3000
echo.
echo  按任意键关闭此窗口...
pause > nul



