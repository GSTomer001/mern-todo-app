# start-mongodb.ps1
# Starts the portable MongoDB server that this project uses.
# It lives in %LOCALAPPDATA%\mongodbLocal so no system install or
# admin rights are needed. Run this whenever MongoDB is not running:
#     powershell -ExecutionPolicy Bypass -File .\backend\scripts\start-mongodb.ps1
# (or just:  .\backend\scripts\start-mongodb.ps1)

$m = "$env:LOCALAPPDATA\mongodbLocal"

if (-not (Test-Path "$m\mongodb-win32-x86_64-windows-8.0.7\bin\mongod.exe")) {
  Write-Host "MongoDB binary not found at $m" -ForegroundColor Red
  Write-Host "Download it from https://www.mongodb.com/try/download/community (Windows ZIP) and extract into $m"
  exit 1
}

if (Get-Process mongod -ErrorAction SilentlyContinue) {
  Write-Host "MongoDB is already running (pid $((Get-Process mongod).Id)) on port 27017." -ForegroundColor Green
  exit 0
}

New-Item -ItemType Directory -Force "$m\data\db" | Out-Null
Start-Process "$m\mongodb-win32-x86_64-windows-8.0.7\bin\mongod.exe" `
  -ArgumentList "--dbpath", "$m\data\db", `
                 "--logpath", "$m\mongod.log", `
                 "--port", "27017", "--bind_ip", "127.0.0.1" -WindowStyle Hidden

Start-Sleep -Seconds 6
if (Get-Process mongod -ErrorAction SilentlyContinue) {
  Write-Host "✅ MongoDB started on mongodb://127.0.0.1:27017" -ForegroundColor Green
} else {
  Write-Host "❌ MongoDB failed to start - check $m\mongod.log" -ForegroundColor Red
}