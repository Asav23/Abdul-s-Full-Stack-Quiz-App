<#
.SYNOPSIS
  Reloads a backup produced by backup.ps1, overwriting whatever is
  currently in the database.

.USAGE
  .\scripts\restore.ps1 -BackupFile .\backups\quizzer-backup-2026-09-05_120000.sql
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$BackupFile,

    # Skips the confirmation prompt - only use this if you're certain.
    [switch]$Force
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $BackupFile)) {
    throw "Backup file not found: $BackupFile"
}

$running = docker ps --filter "name=quiz-postgres" --filter "status=running" --format "{{.Names}}"
if (-not $running) {
    throw "quiz-postgres isn't running. Start the app first: docker-compose up"
}

if (-not $Force) {
    Write-Host "This will overwrite everything currently in the database with the contents of:" -ForegroundColor Yellow
    Write-Host "  $BackupFile" -ForegroundColor Yellow
    $confirm = Read-Host "Type 'yes' to continue"
    if ($confirm -ne "yes") {
        Write-Host "Cancelled - nothing was changed."
        exit
    }
}

Write-Host "==> Restoring from $BackupFile" -ForegroundColor Cyan
Get-Content $BackupFile -Raw | docker exec -i quiz-postgres psql -U postgres -d quizdb

if ($LASTEXITCODE -ne 0) {
    throw "Restore failed - check the output above for details."
}

Write-Host "Restore complete." -ForegroundColor Green
