@echo off
setlocal

set "LOCAL_PORT=8093"
set "REMOTE_HOST=127.0.0.1"
set "REMOTE_PORT=8093"

if "%TABFLOW_SSH_HOST%"=="" (
  echo TABFLOW_SSH_HOST is not set.
  echo Example: set TABFLOW_SSH_HOST=user@tailscale-ip
  pause
  exit /b 1
)

if "%TABFLOW_SSH_KEY%"=="" (
  set "TABFLOW_SSH_KEY=%USERPROFILE%\.ssh\minipc2_ed25519"
)

if not exist "%TABFLOW_SSH_KEY%" (
  echo SSH key not found: %TABFLOW_SSH_KEY%
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:%LOCAL_PORT%' -Method Head -TimeoutSec 2; if ($r.StatusCode -ge 200) { exit 0 } } catch { exit 1 }"
if not errorlevel 1 (
  echo Tunnel already looks active: http://localhost:%LOCAL_PORT%
  pause
  exit /b 0
)

echo Opening TabFlow localhost tunnel...
echo.
echo Keep this window open while using microphone practice.
echo Open the app here: http://localhost:%LOCAL_PORT%
echo.

ssh -N -L 127.0.0.1:%LOCAL_PORT%:%REMOTE_HOST%:%REMOTE_PORT% -i "%TABFLOW_SSH_KEY%" -o ExitOnForwardFailure=yes -o ServerAliveInterval=30 -o ServerAliveCountMax=3 %TABFLOW_SSH_HOST%

echo.
echo Tunnel closed. Run this BAT again to reopen it.
pause
