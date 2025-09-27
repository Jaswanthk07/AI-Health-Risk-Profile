# Health Risk Profiler API Test Script (PowerShell)
# Make sure the backend is running on http://localhost:3000

$BaseUrl = "http://localhost:3000"
Write-Host "🧪 Testing Health Risk Profiler API Endpoints" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1️⃣ Testing Health Check Endpoint" -ForegroundColor Yellow
Write-Host "GET $BaseUrl/health"
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/health" -Method GET -ContentType "application/json"
    Write-Host "✅ Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Parse Complete Profile
Write-Host "`n2️⃣ Testing Parse Endpoint - Complete Profile" -ForegroundColor Yellow
Write-Host "POST $BaseUrl/parse"
$body = @{
    userId = "test_user_complete"
    text = "Age: 42`nSmoker: yes`nExercise: rarely`nDiet: high sugar and processed foods"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/parse" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Parse JSON Format
Write-Host "`n3️⃣ Testing Parse Endpoint - JSON Format" -ForegroundColor Yellow
Write-Host "POST $BaseUrl/parse"
$body = @{
    userId = "test_user_json"
    text = '{"age":35,"smoker":false,"exercise":"daily","diet":"balanced"}'
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/parse" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Parse Natural Language
Write-Host "`n4️⃣ Testing Parse Endpoint - Natural Language" -ForegroundColor Yellow
Write-Host "POST $BaseUrl/parse"
$body = @{
    userId = "test_user_natural"
    text = "I am 28 years old, I do not smoke, I exercise 3 times a week, and I eat a healthy Mediterranean diet"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/parse" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Parse Incomplete (Guardrail)
Write-Host "`n5️⃣ Testing Parse Endpoint - Guardrail (Incomplete Data)" -ForegroundColor Yellow
Write-Host "POST $BaseUrl/parse"
$body = @{
    userId = "test_user_incomplete"
    text = "Age: 30"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/parse" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Risk Assessment - High Risk
Write-Host "`n6️⃣ Testing Risk Endpoint - High Risk Profile" -ForegroundColor Yellow
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
    Write-Host "✅ Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Risk Assessment - Low Risk
Write-Host "`n7️⃣ Testing Risk Endpoint - Low Risk Profile" -ForegroundColor Yellow
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
    Write-Host "✅ Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 8: Risk Assessment - Medium Risk
Write-Host "`n8️⃣ Testing Risk Endpoint - Medium Risk Profile" -ForegroundColor Yellow
Write-Host "POST $BaseUrl/risk"
$body = @{
    userId = "test_user_medium_risk"
    answers = @{
        age = 50
        smoker = $false
        exercise = "sometimes"
        diet = "average"
    }
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/risk" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 9: Validation Error - Parse
Write-Host "`n9️⃣ Testing Parse Endpoint - Validation Error" -ForegroundColor Yellow
Write-Host "POST $BaseUrl/parse"
$body = @{
    userId = ""
    text = ""
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/parse" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Expected validation error: $($_.Exception.Message)" -ForegroundColor Orange
}

# Test 10: Validation Error - Risk
Write-Host "`n🔟 Testing Risk Endpoint - Validation Error" -ForegroundColor Yellow
Write-Host "POST $BaseUrl/risk"
$body = @{
    userId = ""
    answers = @{}
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/risk" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Expected validation error: $($_.Exception.Message)" -ForegroundColor Orange
}

Write-Host "`n✅ All endpoint tests completed!" -ForegroundColor Green
Write-Host "📊 Check the responses above for dynamic data processing" -ForegroundColor Cyan
Write-Host "🔗 Visit http://localhost:3000/api-docs for Swagger documentation" -ForegroundColor Cyan
