@echo off
setlocal enabledelayedexpansion

REM ARTEMIS local runner (new ports)
set FRONTEND_PORT=4100
set BACKEND_PORT=4101

echo == Stopping anything on %FRONTEND_PORT%/%BACKEND_PORT% ==
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%BACKEND_PORT% " ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%FRONTEND_PORT% " ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>nul

echo == Cleaning logs ==
del /q server.out.log server.err.log client.out.log client.err.log 2>nul

echo == Starting backend (port %BACKEND_PORT%) ==
pushd server
start "ARTEMIS_BACKEND" /b cmd /c "set PORT=%BACKEND_PORT% & npm.cmd start 1> ..\server.out.log 2> ..\server.err.log"
popd

echo == Starting frontend (port %FRONTEND_PORT%) ==
pushd client
start "ARTEMIS_FRONTEND" /b cmd /c "npm.cmd run dev -- --port %FRONTEND_PORT% --strictPort 1> ..\client.out.log 2> ..\client.err.log"
popd

echo == Waiting for startup ==
ping 127.0.0.1 -n 3 >nul

echo == LISTENING (should show :%FRONTEND_PORT% and :%BACKEND_PORT%) ==
netstat -ano | findstr ":%FRONTEND_PORT% "
netstat -ano | findstr ":%BACKEND_PORT% "

echo == Backend smoke tests ==
powershell -NoProfile -Command "(Invoke-WebRequest -UseBasicParsing -TimeoutSec 5 http://127.0.0.1:%BACKEND_PORT%/).StatusCode" 2>nul
powershell -NoProfile -Command "(Invoke-WebRequest -UseBasicParsing -TimeoutSec 5 http://127.0.0.1:%BACKEND_PORT%/api/matches/today).StatusCode" 2>nul

echo.
echo Open in browser:
echo   Frontend: http://localhost:%FRONTEND_PORT%/
echo   Backend:  http://localhost:%BACKEND_PORT%/
echo.
echo Logs:
echo   server.out.log / server.err.log
echo   client.out.log / client.err.log

endlocal
