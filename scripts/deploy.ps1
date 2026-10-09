param(
    [switch]$InitOnly
)

$ErrorActionPreference = "Stop"

$ProjectDir = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectDir

function New-HexSecret([int]$Bytes) {
    $Buffer = New-Object byte[] $Bytes
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($Buffer)
    return ([System.BitConverter]::ToString($Buffer)).Replace("-", "").ToLowerInvariant()
}

$EnvFile = if ($env:AI_SAAS_ENV_FILE) {
    if ([System.IO.Path]::IsPathRooted($env:AI_SAAS_ENV_FILE)) {
        $env:AI_SAAS_ENV_FILE
    } else {
        Join-Path $ProjectDir $env:AI_SAAS_ENV_FILE
    }
} else {
    Join-Path $ProjectDir ".env"
}

if (-not (Test-Path $EnvFile)) {
    $Content = [System.IO.File]::ReadAllText((Join-Path $ProjectDir ".env.example"))
    $Content = $Content.Replace("CHANGE_ME_POSTGRES_PASSWORD", (New-HexSecret 24))
    $Content = $Content.Replace("CHANGE_ME_REDIS_PASSWORD", (New-HexSecret 24))
    $Content = $Content.Replace("CHANGE_ME_NEW_API_SESSION_SECRET", (New-HexSecret 32))
    $Content = $Content.Replace("CHANGE_ME_NEW_API_CRYPTO_SECRET", (New-HexSecret 32))
    $Content = $Content.Replace("CHANGE_ME_SAAS_SESSION_SECRET", (New-HexSecret 32))
    $Content = $Content.Replace("CHANGE_ME_SAAS_ADMIN_KEY", (New-HexSecret 24))
    $Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($EnvFile, $Content, $Utf8NoBom)
    Write-Host "Created environment file with random database, Redis, and session secrets."
} else {
    $Content = [System.IO.File]::ReadAllText($EnvFile)
    if ($Content -notmatch "(?m)^SAAS_SESSION_SECRET=") {
        $Content += "`nSAAS_SESSION_SECRET=$(New-HexSecret 32)`n"
    }
    if ($Content -notmatch "(?m)^SAAS_ADMIN_KEY=") {
        $Content += "SAAS_ADMIN_KEY=$(New-HexSecret 24)`n"
    }
    $Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($EnvFile, $Content, $Utf8NoBom)
    Write-Host "Using existing environment file; existing secrets were preserved and missing SaaS keys were added."
}

if ($InitOnly) {
    Write-Host "Environment initialization completed."
    exit 0
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw "Docker Desktop is required."
}

docker compose version | Out-Null
if ($LASTEXITCODE -ne 0) {
    throw "Docker Compose v2 is required."
}

docker compose --env-file $EnvFile config --quiet
if ($LASTEXITCODE -ne 0) {
    throw "Docker Compose configuration validation failed."
}
docker compose --env-file $EnvFile up -d --build
if ($LASTEXITCODE -ne 0) {
    throw "The integrated stack failed to start."
}
docker compose --env-file $EnvFile ps

Write-Host ""
Write-Host "AI SaaS: http://127.0.0.1:3000"
Write-Host "New API: http://127.0.0.1:3001"
Write-Host "Next: initialize the New API administrator, create a token, and set NEW_API_ADMIN_TOKEN in .env."
