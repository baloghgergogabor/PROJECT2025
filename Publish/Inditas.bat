@echo off
title TeUtad Inditasa
 
REM ============================================================
REM  Port beallitasok - itt valtoztathatod meg!
REM ============================================================
set BACKEND_PORT=7222
set FRONTEND_PORT=5200
 
REM ============================================================
REM  Backend inditasa (TeUtad.API)
REM ============================================================
echo [1/3] Backend inditasa (https://localhost:%BACKEND_PORT%)...
start "TeUtad - Backend (API)" cmd /k "cd /d %~dp0backend && dotnet TeUtad.API.dll --urls https://localhost:%BACKEND_PORT%"
 
REM Varakozas, hogy a backend elinduljon a frontend elott
echo Varakozas a backendre...
timeout /t 3 > nul
 
REM ============================================================
REM  Frontend inditasa (TeUtad Blazor)
REM ============================================================
echo [2/3] Frontend inditasa (https://localhost:%FRONTEND_PORT%)...
start "TeUtad - Frontend (Blazor)" cmd /k "cd /d %~dp0frontend && dotnet TeUtad.dll --urls https://localhost:%FRONTEND_PORT%"
 
REM Varakozas, hogy a frontend elinduljon a bongeszo elott
echo Varakozas a Frontendre...
timeout /t 4 > nul
 
REM ============================================================
REM  Bongeszo megnyitasa
REM ============================================================
echo [3/3] Bongeszo megnyitasa...
start https://localhost:%FRONTEND_PORT%
 
echo.
echo ============================================================
echo  Mindket alkalmazas el van inditva!
echo  Backend:  http://localhost:%BACKEND_PORT%
echo  Frontend: http://localhost:%FRONTEND_PORT%
echo ============================================================
echo.
echo Bezarashoz nyomj barmely gombot...
pause > nul