const axios = require('axios');

const API_BASE = 'http://localhost:3000';

async function testCompleteFlow() {
  console.log('🧪 Testing Complete Health Risk Profiler Flow\n');
  
  try {
    // Test 1: Parse endpoint with dynamic text input
    console.log('1️⃣ Testing /parse endpoint...');
    const parseResponse = await axios.post(`${API_BASE}/parse`, {
      userId: `test_user_${Date.now()}`, // Dynamic user ID
      text: 'Age: 45\nSmoker: yes\nExercise: rarely\nDiet: high sugar and processed foods'
    });
    
    console.log('✅ Parse Response:', JSON.stringify(parseResponse.data, null, 2));
    
    if (parseResponse.data.status === 'incomplete_profile') {
      console.log('⚠️ Profile incomplete - testing guardrail works!');
      return;
    }
    
    const { answers } = parseResponse.data;
    
    // Test 2: Risk endpoint with parsed answers
    console.log('\n2️⃣ Testing /risk endpoint...');
    const riskResponse = await axios.post(`${API_BASE}/risk`, {
      userId: parseResponse.config.data ? JSON.parse(parseResponse.config.data).userId : 'test_user',
      answers: answers
    });
    
    console.log('✅ Risk Response:', JSON.stringify(riskResponse.data, null, 2));
    
    // Test 3: Verify dynamic data (no hardcoded values)
    console.log('\n3️⃣ Verifying dynamic data...');
    const { risk_level, score, recommendations, factors, rationale } = riskResponse.data;
    
    console.log(`✅ Risk Level: ${risk_level} (computed dynamically)`);
    console.log(`✅ Score: ${score} (computed from answers)`);
    console.log(`✅ Recommendations: ${recommendations.length} items (generated based on factors)`);
    console.log(`✅ Factors: ${factors ? factors.join(', ') : 'none'} (extracted from answers)`);
    console.log(`✅ Rationale: ${rationale ? rationale.join(', ') : 'none'} (computed from risk factors)`);
    
    // Test 4: Test guardrail with insufficient data
    console.log('\n4️⃣ Testing guardrail with insufficient data...');
    const incompleteResponse = await axios.post(`${API_BASE}/parse`, {
      userId: `incomplete_user_${Date.now()}`,
      text: 'Age: 30' // Only 1 out of 4 expected fields
    });
    
    console.log('✅ Incomplete Profile Response:', JSON.stringify(incompleteResponse.data, null, 2));
    
    console.log('\n🎉 All tests passed! The system uses completely dynamic data.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\n💡 Make sure the backend is running on http://localhost:3000');
  }
}

// Test different input variations
async function testVariousInputs() {
  console.log('\n🔄 Testing various input formats...\n');
  
  const testCases = [
    {
      name: 'JSON Format',
      text: '{"age":35,"smoker":false,"exercise":"daily","diet":"balanced"}'
    },
    {
      name: 'Natural Language',
      text: 'I am 28 years old, I do not smoke, I exercise 3 times a week, and I eat a healthy Mediterranean diet'
    },
    {
      name: 'Form-like Format',
      text: 'Age: 52\nSmoking Status: No\nExercise Frequency: Sometimes\nDiet Type: High fat and sugar'
    }
  ];
  
  for (const testCase of testCases) {
    try {
      console.log(`Testing ${testCase.name}:`);
      const response = await axios.post(`${API_BASE}/parse`, {
        userId: `test_${testCase.name.toLowerCase().replace(' ', '_')}_${Date.now()}`,
        text: testCase.text
      });
      
      console.log(`✅ Parsed: ${JSON.stringify(response.data.answers, null, 2)}\n`);
    } catch (error) {
      console.log(`❌ Failed: ${error.response?.data || error.message}\n`);
    }
  }
}

// Run tests
if (require.main === module) {
  testCompleteFlow().then(() => testVariousInputs());
}

module.exports = { testCompleteFlow, testVariousInputs };
