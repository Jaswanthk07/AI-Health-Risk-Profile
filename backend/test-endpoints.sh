#!/bin/bash

# Health Risk Profiler API Test Script
# Make sure the backend is running on http://localhost:3000

BASE_URL="http://localhost:3000"
echo "🧪 Testing Health Risk Profiler API Endpoints"
echo "=============================================="

# Test 1: Health Check
echo -e "\n1️⃣ Testing Health Check Endpoint"
echo "GET $BASE_URL/health"
curl -X GET "$BASE_URL/health" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'

# Test 2: Parse Complete Profile
echo -e "\n2️⃣ Testing Parse Endpoint - Complete Profile"
echo "POST $BASE_URL/parse"
curl -X POST "$BASE_URL/parse" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_complete",
    "text": "Age: 42\nSmoker: yes\nExercise: rarely\nDiet: high sugar and processed foods"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'

# Test 3: Parse JSON Format
echo -e "\n3️⃣ Testing Parse Endpoint - JSON Format"
echo "POST $BASE_URL/parse"
curl -X POST "$BASE_URL/parse" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_json",
    "text": "{\"age\":35,\"smoker\":false,\"exercise\":\"daily\",\"diet\":\"balanced\"}"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'

# Test 4: Parse Natural Language
echo -e "\n4️⃣ Testing Parse Endpoint - Natural Language"
echo "POST $BASE_URL/parse"
curl -X POST "$BASE_URL/parse" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_natural",
    "text": "I am 28 years old, I do not smoke, I exercise 3 times a week, and I eat a healthy Mediterranean diet"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'

# Test 5: Parse Incomplete (Guardrail)
echo -e "\n5️⃣ Testing Parse Endpoint - Guardrail (Incomplete Data)"
echo "POST $BASE_URL/parse"
curl -X POST "$BASE_URL/parse" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_incomplete",
    "text": "Age: 30"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'

# Test 6: Risk Assessment - High Risk
echo -e "\n6️⃣ Testing Risk Endpoint - High Risk Profile"
echo "POST $BASE_URL/risk"
curl -X POST "$BASE_URL/risk" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_high_risk",
    "answers": {
      "age": 42,
      "smoker": true,
      "exercise": "rarely",
      "diet": "high sugar"
    }
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'

# Test 7: Risk Assessment - Low Risk
echo -e "\n7️⃣ Testing Risk Endpoint - Low Risk Profile"
echo "POST $BASE_URL/risk"
curl -X POST "$BASE_URL/risk" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_low_risk",
    "answers": {
      "age": 25,
      "smoker": false,
      "exercise": "daily",
      "diet": "balanced"
    }
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'

# Test 8: Risk Assessment - Medium Risk
echo -e "\n8️⃣ Testing Risk Endpoint - Medium Risk Profile"
echo "POST $BASE_URL/risk"
curl -X POST "$BASE_URL/risk" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_medium_risk",
    "answers": {
      "age": 50,
      "smoker": false,
      "exercise": "sometimes",
      "diet": "average"
    }
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'

# Test 9: Validation Error - Parse
echo -e "\n9️⃣ Testing Parse Endpoint - Validation Error"
echo "POST $BASE_URL/parse"
curl -X POST "$BASE_URL/parse" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "",
    "text": ""
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'

# Test 10: Validation Error - Risk
echo -e "\n🔟 Testing Risk Endpoint - Validation Error"
echo "POST $BASE_URL/risk"
curl -X POST "$BASE_URL/risk" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "",
    "answers": {}
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'

echo -e "\n✅ All endpoint tests completed!"
echo "📊 Check the responses above for dynamic data processing"
echo "🔗 Visit http://localhost:3000/api-docs for Swagger documentation"
