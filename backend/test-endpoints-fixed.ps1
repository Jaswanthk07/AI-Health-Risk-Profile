# Health Risk Profiler API Test Script (PowerShell)
# Make sure the backend is running on http://localhost:3000

$BaseUrl = "http://localhost:3000"
Write-Host "Testing Health Risk Profiler API Endpoints" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Testing Health Check Endpoint" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/health"
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/health" -Method GET -ContentType "application/json"
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Parse Complete Profile
Write-Host "`n2. Testing Parse Endpoint - Complete Profile" -ForegroundColor Yellow
Write-Host "POST $BaseUrl/parse"
$body = @{
    userId = "test_user_complete"
    text = "Age: 42`nSmoker: yes`nExercise: rarely`nDiet: high sugar and processed foods"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/parse" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Parse Incomplete (Guardrail)
Write-Host "`n3. Testing Parse Endpoint - Guardrail (Incomplete Data)" -ForegroundColor Yellow
Write-Host "POST $BaseUrl/parse"
$body = @{
    userId = "test_user_incomplete"
    text = "Age: 30"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/parse" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Risk Assessment - High Risk
Write-Host "`n4. Testing Risk Endpoint - High Risk Profile" -ForegroundColor Yellow
Write-Host "POST $BaseUrl/risk"
$body = @{
    userId = "test_user_high_risk"
    answers = @{
        age = 42
        smoker = $true
        exercise = "rarely"
        diet = "high sugar"
    }
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/risk" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Risk Assessment - Low Risk
Write-Host "`n5. Testing Risk Endpoint - Low Risk Profile" -ForegroundColor Yellow
Write-Host "POST $BaseUrl/risk"
$body = @{
    userId = "test_user_low_risk"
    answers = @{
        age = 25
        smoker = $false
        exercise = "daily"
        diet = "balanced"
    }
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/risk" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nAll endpoint tests completed!" -ForegroundColor Green
Write-Host "Check the responses above for dynamic data processing" -ForegroundColor Cyan
Write-Host "Visit http://localhost:3000/api-docs for Swagger documentation" -ForegroundColor Cyan
