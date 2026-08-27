# stop-mongodb.ps1
# Stops the portable MongoDB server started by start-mongodb.ps1.
$p = Get-Process mongod -ErrorAction SilentlyContinue
if ($p) {
  $p | Stop-Process -Force
  Write-Host "🛑 MongoDB stopped." -ForegroundColor Yellow
} else {
  Write-Host "MongoDB is not running." -ForegroundColor Gray
}