<#
.SYNOPSIS
  Dumps the running quiz-postgres database to a timestamped .sql file under
  backups/, so quizzes/collections/attempt history survive things like an
  accidental `docker-compose down -v` or a Docker reset.

.USAGE
  .\scripts\backup.ps1
#>

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$backupDir = Join-Path $repoRoot "backups"

$running = docker ps --filter "name=quiz-postgres" --filter "status=running" --format "{{.Names}}"
if (-not $running) {
    throw "quiz-postgres isn't running. Start the app first: docker-compose up"
}

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

$timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$backupFile = Join-Path $backupDir "quizzer-backup-$timestamp.sql"

Write-Host "==> Backing up quizdb to $backupFile" -ForegroundColor Cyan
docker exec quiz-postgres pg_dump -U postgres -d quizdb --clean --if-exists > $backupFile

if ($LASTEXITCODE -ne 0) {
    Remove-Item $backupFile -ErrorAction SilentlyContinue
    throw "pg_dump failed"
}

Write-Host "Done: $backupFile" -ForegroundColor Green
