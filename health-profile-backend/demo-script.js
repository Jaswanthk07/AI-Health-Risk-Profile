const axios = require("axios");

const API_BASE = "http://localhost:3000";

async function runDemo() {
  console.log("🎬 Health Risk Profiler - Live Demo");
  console.log("===================================\n");

  try {
    // Demo 1: Health Check
    console.log("🏥 Step 1: Health Check");
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log("✅ Server Status:", healthResponse.data);
    console.log("🔗 Swagger Docs: http://localhost:3000/api-docs\n");

    // Demo 2: Parse Complete Health Profile
    console.log("📋 Step 2: Parse Complete Health Profile");
    const parseResponse = await axios.post(`${API_BASE}/parse`, {
      userId: `demo_user_${Date.now()}`,
      text: "Age: 45\nSmoker: yes\nExercise: rarely\nDiet: high sugar and processed foods",
    });

    console.log("✅ Parsed Data:", JSON.stringify(parseResponse.data, null, 2));
    const { answers } = parseResponse.data;

    // Demo 3: Risk Assessment
    console.log("\n🎯 Step 3: Risk Assessment with Factor Extraction");
    const riskResponse = await axios.post(`${API_BASE}/risk`, {
      userId: parseResponse.data.userId || "demo_user",
      answers: answers,
    });

    console.log(
      "✅ Risk Assessment:",
      JSON.stringify(riskResponse.data, null, 2)
    );

    // Demo 4: Guardrail Test
    console.log("\n🛡️ Step 4: Testing Guardrail (Incomplete Data)");
    const guardrailResponse = await axios.post(`${API_BASE}/parse`, {
      userId: `incomplete_${Date.now()}`,
      text: "Age: 30", // Only 1 out of 4 required fields
    });

    console.log(
      "✅ Guardrail Response:",
      JSON.stringify(guardrailResponse.data, null, 2)
    );

    // Demo 5: Different Input Formats
    console.log("\n🔄 Step 5: Testing Different Input Formats");

    // JSON format
    const jsonResponse = await axios.post(`${API_BASE}/parse`, {
      userId: `json_${Date.now()}`,
      text: '{"age":35,"smoker":false,"exercise":"daily","diet":"balanced"}',
    });
    console.log(
      "📄 JSON Format:",
      JSON.stringify(jsonResponse.data.answers, null, 2)
    );

    // Natural language
    const nlResponse = await axios.post(`${API_BASE}/parse`, {
      userId: `nl_${Date.now()}`,
      text: "I am 28 years old, I do not smoke, I exercise 3 times a week, and I eat a healthy Mediterranean diet",
    });
    console.log(
      "💬 Natural Language:",
      JSON.stringify(nlResponse.data.answers, null, 2)
    );

    console.log("\n🎉 Demo Complete! All endpoints working with dynamic data.");
    console.log("🌐 Frontend: http://localhost:8080");
    console.log("📚 API Docs: http://localhost:3000/api-docs");
  } catch (error) {
    console.error("❌ Demo Error:", error.response?.data || error.message);
    console.log(
      "\n💡 Make sure the backend is running: cd health-profile-backend && npm run dev"
    );
  }
}

// Run the demo
runDemo();
