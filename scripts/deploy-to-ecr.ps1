param(
    [Parameter(Mandatory = $true)][string]$BackendRepoUrl,
    [Parameter(Mandatory = $true)][string]$FrontendRepoUrl,
    [string]$Region = "eu-west-1",
    [string]$Tag = "latest"
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$RegistryHost = ($BackendRepoUrl -split "/")[0]

Write-Host "Logging in to ECR ($RegistryHost)..."
aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin $RegistryHost
if ($LASTEXITCODE -ne 0) { throw "ECR login failed" }

Write-Host "Building backend image..."
docker build -t "${BackendRepoUrl}:${Tag}" -f "$RepoRoot\Dockerfile" $RepoRoot
if ($LASTEXITCODE -ne 0) { throw "Backend build failed" }

Write-Host "Pushing backend image..."
docker push "${BackendRepoUrl}:${Tag}"
if ($LASTEXITCODE -ne 0) { throw "Backend push failed" }

Write-Host "Building frontend image..."
docker build -t "${FrontendRepoUrl}:${Tag}" -f "$RepoRoot\frontend\Dockerfile" "$RepoRoot\frontend"
if ($LASTEXITCODE -ne 0) { throw "Frontend build failed" }

Write-Host "Pushing frontend image..."
docker push "${FrontendRepoUrl}:${Tag}"
if ($LASTEXITCODE -ne 0) { throw "Frontend push failed" }

Write-Host "Done. Both images pushed with tag '$Tag'."
