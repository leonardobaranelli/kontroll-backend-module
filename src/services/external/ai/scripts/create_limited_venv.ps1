param (
    [string]$envPath = "venv"
)

# Prompt for the amount of RAM to allocate
$ramLimit = Read-Host "Enter the amount of RAM to allocate (in GB)"
$ramLimitBytes = [math]::Round([double]$ramLimit * 1GB)

# Check if the virtual environment already exists
if (-Not (Test-Path -Path $envPath)) {
    Write-Output "Creating the virtual environment in $envPath"
    python -m venv $envPath
} else {
    Write-Output "The virtual environment already exists in $envPath"
}

# Function to set memory limit for a given process
function Set-MemoryLimit {
    param (
        [int]$pid,
        [int]$limitBytes
    )
    $process = Get-Process -Id $pid
    $process.MaxWorkingSet = [System.IntPtr]::new($limitBytes)
}

# Modify the virtual environment's activate script to set the memory limit for any new Python processes
function ModifyActivateScript {
    $activateScriptPath = Join-Path $envPath "Scripts\Activate.ps1"
    $limitScript = @"
if (-not (Test-Path function:\global:python)) {
    function global:python {
        param([string]`$args)
        `$proc = Start-Process python -ArgumentList `$args -PassThru
        Set-MemoryLimit -pid `$proc.Id -limitBytes $ramLimitBytes
        `$proc.WaitForExit()
    }
}
"@
    # Ensure we're not appending the script multiple times
    if (-not (Select-String -Path $activateScriptPath -Pattern "function global:python")) {
        Add-Content -Path $activateScriptPath -Value $limitScript
    }
}

# Run the function to modify the activate script
ModifyActivateScript

Write-Output "Virtual environment is set up with a RAM limit of $ramLimit GB. Use 'Activate.ps1' to activate it."
