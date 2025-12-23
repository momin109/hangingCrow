@echo off
echo ========================================
echo  VEIKI BETTING PLATFORM - QUICK START
echo  Backend: http://localhost:5000
echo  Frontend: http://localhost:3000
echo ========================================
echo.

REM Create .env files from examples if they don't exist
if not exist "server\.env" (
    echo Creating server/.env from template...
    copy "server\.env.example" "server\.env"
)

if not exist "client\.env" (
    echo Creating client/.env from template...
    copy "client\.env.example" "client\.env"
)

REM Check if node_modules exists
if not exist "server\node_modules\" (
    echo.
    echo Installing backend dependencies...
    cd server
    call npm install
    cd ..
)

if not exist "client\node_modules\" (
    echo.
    echo Installing frontend dependencies...
    cd client
    call npm install
    cd ..
)

echo.
echo Generating Prisma Client...
cd server
call npx prisma generate
cd ..

echo.
echo ========================================
echo  Starting Servers...
echo ========================================
echo.

echo [1/2] Starting Backend Server (Port 5000)...
start "VEIKI Backend" cmd /k "cd server && npm run start:dev"

timeout /t 5 /nobreak >nul

echo [2/2] Starting Frontend Server (Port 3000)...
start "VEIKI Frontend" cmd /k "cd client && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo  VEIKI Platform Started Successfully!
echo ========================================
echo.
echo Backend API:  http://localhost:5000
echo Frontend UI:  http://localhost:3000
echo API Docs:     http://localhost:5000/api
echo.
echo Press any key to open the app in your browser...
pause >nul

start http://localhost:3000

echo.
echo Both servers are running in separate windows.
echo.
echo IMPORTANT:
echo - Backend window title: "VEIKI Backend"
echo - Frontend window title: "VEIKI Frontend"
echo - Close those windows to stop the servers
echo.
echo Default login credentials:
echo   Username: testuser
echo   Password: password123
echo.
pause
