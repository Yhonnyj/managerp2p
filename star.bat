@echo off
echo Iniciando servidores...

REM Iniciar backend Django
start cmd /k "venv\Scripts\activate && python manage.py runserver"

REM Iniciar frontend Next.js
start cmd /k "cd frontend && npm run dev"

echo Servidores en ejecución...
