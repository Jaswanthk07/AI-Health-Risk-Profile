# AI-Powered Health Risk Profiler
> **A full-stack health risk assessment application that processes health survey data from text and images to provide personalized recommendations.**

[![Node.js](https://img.shields.io/badge/Node.js-18.0%2B-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0%2B-green.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18.0%2B-blue.svg)](https://reactjs.org/)

## Problem Statement

**Focus Area:** OCR → Factor Extraction → Risk Assessment → Recommendations

This project analyzes lifestyle survey responses from both typed text and scanned forms to generate health risk profiles. The system handles incomplete data and provides intelligent responses while delivering actionable, non-diagnostic health recommendations.

## 🎯 Project Overview

The AI-Powered Health Risk Profiler processes health data through a four-stage pipeline:

1. **OCR/Text Parsing** - Extract health data from images and text
2. **Factor Extraction** - Identify lifestyle risk factors
3. **Risk Classification** - Calculate risk scores and levels
4. **Recommendations** - Generate personalized health guidance

## 🏗️ Technology Stack

- **Frontend:** React.js with TypeScript, Tesseract.js OCR
- **Backend:** Node.js + Express.js
- **Database:** MongoDB with Mongoose
- **Documentation:** Swagger/OpenAPI 3.0
- **Security:** Rate limiting, CORS, input validation

### System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Express Backend │    │   MongoDB       │
│                 │    │                  │    │                 │
│ • OCR Processing│◄──►│ • Text Parsing   │◄──►│ • User Data     │
│ • Image Upload  │    │ • Risk Engine    │    │ • Risk History  │
│ • Results UI    │    │ • Recommendations│    │ • Analytics     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔬 Processing Pipeline

### Stage 1: OCR/Text Parsing

**Input Formats:**

- **JSON:** `{"age":42,"smoker":true,"exercise":"rarely","diet":"high sugar"}`
- **Natural Language:** `"I am 42 years old, I smoke, I rarely exercise"`
- **Form Format:** `"Age: 42\nSmoker: yes\nExercise: rarely"`
- **Image OCR:** PNG/JPG medical forms

**Output:**

```json
{
  "answers": {
    "age": 42,
    "smoker": true,
    "exercise": "rarely",
    "diet": "high sugar"
  },
  "missing_fields": [],
  "confidence": 0.92
}
```

**Guardrail for Incomplete Data:**

```json
{
  "status": "incomplete_profile",
  "reason": ">50% fields missing"
}
```

### Stage 2: Factor Extraction

**Processing:**

- Smoking status assessment
- Exercise frequency categorization
- Diet pattern analysis
- Age-related risk evaluation

**Output:**

```json
{
  "factors": ["smoking", "poor diet", "low exercise"],
  "confidence": 0.88
}
```

### Stage 3: Risk Classification

**Scoring System:**

- **Age:** 30+: +10, 45+: +20, 60+: +30 points
- **Smoking:** +30 points
- **Exercise:** rarely: +20, sometimes: +10 points
- **Diet:** high sugar/processed: +20 points

**Risk Levels:**

- **Low Risk:** 0-39 points
- **Medium Risk:** 40-69 points
- **High Risk:** 70-100 points

**Output:**

```json
{
  "risk_level": "high",
  "score": 78,
  "rationale": ["smoking", "high sugar diet", "low activity"]
}
```

### Stage 4: Recommendations

**Categories:**

- Immediate actions (smoking cessation, diet changes)
- Lifestyle changes (exercise, stress management)
- Monitoring (health checkups, progress tracking)
- Professional guidance (healthcare consultations)

**Output:**

```json
{
  "risk_level": "high",
  "factors": ["smoking", "poor diet", "low exercise"],
  "recommendations": [
    "Consult a healthcare provider for personalized guidance",
    "Quit smoking",
    "Start light physical activity (walk 30 mins daily)",
    "Reduce sugar and processed foods"
  ],
  "status": "ok"
}
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0+
- MongoDB (local or Atlas cloud)
- Modern web browser
- ngrok (optional, for public demo)

### Installation

```bash
# Clone repository
git clone https://github.com/jaswanthk07/AI-Health-Risk-Profile.git
cd AI-Health-Risk-Profile

# Install dependencies
npm run install-all

# Configure environment
# Backend: health-profile-backend/.env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/health_risk_profiler
CORS_ORIGIN=http://localhost:8080
```

### Start Application

```bash
# Terminal 1: Start backend
npm run start-backend

# Terminal 2: Start frontend
npm run start-frontend

# Terminal 3: Public demo (optional)
ngrok http 3000
```

### Access Points

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3000
- **API Docs:** http://localhost:3000/api-docs
- **Public Demo:** https://your-ngrok-url.ngrok.io

## 📚 API Documentation

### Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "ok",
  "uptime": 1234.56
}
```

### Parse Health Data

```http
POST /parse
Content-Type: application/json

{
  "userId": "string",
  "text": "string"
}
```

**Success Response:**

```json
{
  "answers": {
    "age": 42,
    "smoker": true,
    "exercise": "rarely",
    "diet": "high sugar"
  },
  "missing_fields": [],
  "confidence": 0.92
}
```

**Incomplete Data Response:**

```json
{
  "status": "incomplete_profile",
  "reason": ">50% fields missing"
}
```

### Risk Assessment

```http
POST /risk
Content-Type: application/json

{
  "userId": "string",
  "answers": {
    "age": 42,
    "smoker": true,
    "exercise": "rarely",
    "diet": "high sugar"
  }
}
```

**Response:**

```json
{
  "risk_level": "high",
  "score": 78,
  "recommendations": [
    "Consult a healthcare provider for personalized guidance",
    "Quit smoking",
    "Start light physical activity (walk 30 mins daily)",
    "Reduce sugar and processed foods"
  ],
  "factors": ["smoking", "poor diet", "low exercise"],
  "rationale": ["smoking", "high sugar diet", "low activity"]
}
```

## 📊 Project Structure

```
AI-Health-Risk-Profile/
├── health-profile-backend/          # Express.js API server
│   ├── src/
│   │   ├── controllers/            # Request handlers
│   │   ├── models/                 # MongoDB schemas
│   │   ├── routes/                 # API endpoints
│   │   ├── services/               # Business logic
│   │   └── middleware/             # Custom middleware
│   ├── tests/                      # Backend tests
│   └── swagger/                    # API documentation
├── health-profile-frontend/         # React application
│   ├── src/
│   │   ├── components/             # UI components
│   │   ├── pages/                  # Route components
│   │   ├── services/               # API integration
│   │   └── utils/                  # Helper functions
│   └── public/                     # Static assets
├── screenshots/                     # Application screenshots
├── tests/                          # Integration tests
│   ├── postman/                    # Postman collections
│   └── sample-data/                # Test datasets
└── docs/                           # Documentation
```

## 🧪 Testing

### Test Commands

```bash
# Run API tests
npm run test-api

# Run demo workflow
npm run demo

# PowerShell endpoint testing
cd health-profile-backend
powershell -ExecutionPolicy Bypass -File test-endpoints-fixed.ps1
```

### Sample API Tests

#### Health Check

```bash
curl -X GET https://your-ngrok-url.ngrok.io/health
```

#### Parse Complete Profile

```bash
curl -X POST https://your-ngrok-url.ngrok.io/parse \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "demo_user_001",
    "text": "Age: 42\nSmoker: yes\nExercise: rarely\nDiet: high sugar"
  }'
```

#### Parse Incomplete Profile (Guardrail Test)

```bash
curl -X POST https://your-ngrok-url.ngrok.io/parse \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "incomplete_user",
    "text": "Age: 30"
  }'
```

#### Risk Assessment

```bash
curl -X POST https://your-ngrok-url.ngrok.io/risk \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "demo_user_001",
    "answers": {
      "age": 42,
      "smoker": true,
      "exercise": "rarely",
      "diet": "high sugar"
    }
  }'
```

### Testing Resources

- **Postman Collection:** `HealthRiskProfiler.postman_collection.json`
- **Automated Tests:** `npm run test`
- **Sample Data:** [Test datasets](./tests/sample-data/)

## 🛡️ Security & Features

### Security

- **Rate Limiting:** 120 requests/minute per IP
- **Input Validation:** Comprehensive request validation
- **CORS Protection:** Configured allowed origins
- **Security Headers:** Helmet.js implementation
- **Environment Variables:** Secure configuration management

### Key Features

- **OCR Processing:** Client-side image text extraction
- **Multiple Input Formats:** JSON, natural language, structured text, images
- **Guardrails:** Intelligent handling of incomplete data
- **Real-time Processing:** Dynamic risk assessment
- **Comprehensive API:** Full Swagger documentation

### Data Privacy

- **No PHI Storage:** Health data processed in memory only
- **User Control:** Users maintain full data control
- **Secure Processing:** HTTPS in production
- **Non-Diagnostic:** Educational recommendations only

## 🤝 Contributing

### Development Process

1. Fork repository and create feature branch
2. Implement changes with tests
3. Update documentation
4. Submit pull request

### Code Standards

- ESLint for code quality
- TypeScript for type safety
- Test coverage requirements
- Comprehensive documentation

## 📄 License & Disclaimer

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Medical Disclaimer

This application provides educational health risk assessments and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.

## 📞 Support

### Documentation

- **API Reference:** Complete Swagger documentation
- **GitHub Issues:** Bug reports and feature requests
- **Community Support:** Developer forums and discussions

---

## 🎯 Getting Started

### Quick Setup

```bash
# 1. Clone and setup
git clone https://github.com/jaswanthk07/AI-Health-Risk-Profile.git
cd AI-Health-Risk-Profile
npm run install-all

# 2. Start services
npm run start-backend  # Terminal 1
npm run start-frontend # Terminal 2
ngrok http 3000        # Terminal 3 (optional)
```

### Access Points

- **Frontend Application:** http://localhost:8080
- **Backend API:** http://localhost:3000
- **API Documentation:** http://localhost:3000/api-docs
- **Public Demo:** https://your-ngrok-url.ngrok.io

### Screenshots:
Application overview showing the main interface
![alt text](<screenshots/Screenshot 2025-09-27 163218.png>)
![alt text](<screenshots/Screenshot 2025-09-27 175701.png>)
![alt text](<screenshots/Screenshot 2025-09-27 175723.png>)
![alt text](<screenshots/Screenshot 2025-09-27 181006.png>)
![alt_text](<screenshots/image.png>)
## 📸 Application Preview
![API EndPoints](<screenshots/Screenshot 2025-09-27 181518.png>)
![API EndPoints](<screenshots/Screenshot 2025-09-27 181525.png>)
![API EndPoints](<screenshots/Screenshot 2025-09-27 163141.png>)
![API EndPoints](<screenshots/Screenshot 2025-09-27 163208.png>)
_AI-Powered Health Risk Profiler - Complete health assessment interface with OCR processing, risk analysis, and personalized recommendations_
---
## 💙 Acknowledgments
This project is built with appreciation for the open-source community and the collaborative spirit of developers working to improve healthcare technology. Special thanks to contributors who help make health risk assessment more accessible through technology.
Contributing
We welcome contributions from developers passionate about healthcare innovation. Whether it's bug fixes, feature enhancements, documentation improvements, or testing - every contribution helps make this tool more effective for users seeking health insights.
Made with care for better health outcomes 🏥

