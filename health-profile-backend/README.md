# AI-Powered Health Risk Profiler

A full-stack web application that analyzes health data from text or images to provide AI-powered risk assessments and personalized health recommendations.

## 🏗️ Architecture

- **Frontend**: React.js with TypeScript, Tesseract.js for OCR, Axios for API calls
- **Backend**: Node.js + Express.js with comprehensive middleware
- **Database**: MongoDB with Mongoose ODM
- **OCR**: Client-side Tesseract.js processing
- **UI**: Modern React components with Tailwind CSS and shadcn/ui

## 🚀 Features

### Core Functionality
- **Image Upload & OCR**: Upload PNG/JPG medical documents with automatic text extraction
- **Text Input**: Direct text input for health data
- **Dynamic Risk Assessment**: AI-powered analysis of lifestyle factors
- **Personalized Recommendations**: Actionable health guidance based on risk factors
- **Real-time Pipeline**: Visual progress tracking (OCR → Factor Extraction → Risk Assessment)

### Advanced Features
- **Guardrails**: Automatic validation with >50% missing field detection
- **Factor Extraction**: Identifies specific risk contributors (smoking, diet, exercise)
- **Dynamic Scoring**: Computed risk levels with detailed rationale
- **Data Persistence**: MongoDB storage with user profile management
- **Security**: Rate limiting, input sanitization, CORS protection

## 📋 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
```bash
# Navigate to backend directory
cd health-profile-backend

# Install dependencies
npm install

# Start MongoDB locally (if using local MongoDB)
mongod

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup
```bash
# Navigate to frontend directory
cd health-profile-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:8080`

### Environment Configuration
Create a `.env` file in the backend directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/health_risk_profiler
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,http://localhost:8080
```

## 🔌 API Documentation

### Parse Endpoint
**POST** `/parse`

Extracts structured data from text input with guardrails.

**Request:**
```json
{
  "userId": "user123",
  "text": "Age: 42\nSmoker: yes\nExercise: rarely\nDiet: high sugar"
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

**Guardrail Response (>50% fields missing):**
```json
{
  "status": "incomplete_profile",
  "reason": ">50% fields missing"
}
```

### Risk Assessment Endpoint
**POST** `/risk`

Computes health risk level and generates recommendations.

**Request:**
```json
{
  "userId": "user123",
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

### Health Check Endpoint
**GET** `/health`

Returns server status and uptime.

**Response:**
```json
{
  "status": "ok",
  "uptime": 1234.56
}
```

## 🧪 Testing

### API Testing with curl
```bash
# Test parse endpoint
curl -X POST http://localhost:3000/parse \
  -H "Content-Type: application/json" \
  -d '{"userId": "test123", "text": "Age: 42\nSmoker: yes\nExercise: rarely\nDiet: high sugar"}'

# Test risk endpoint
curl -X POST http://localhost:3000/risk \
  -H "Content-Type: application/json" \
  -d '{"userId": "test123", "answers": {"age": 42, "smoker": true, "exercise": "rarely", "diet": "high sugar"}}'
```

### Automated Testing
Run the included test script:
```bash
node test-api.js
```

### Frontend Testing
1. Open `http://localhost:8080`
2. Upload a medical document image or enter text
3. Watch the pipeline progress through OCR → Factor Extraction → Risk Assessment
4. View results with risk level, factors, and recommendations

## 📊 Data Flow

```
User Input (Image/Text)
    ↓
OCR Processing (Tesseract.js)
    ↓
Text Parsing (/parse endpoint)
    ↓
Guardrail Check (>50% fields)
    ↓
Factor Extraction
    ↓
Risk Computation (/risk endpoint)
    ↓
MongoDB Storage
    ↓
Frontend Display
```

## 🛡️ Security Features

- **Rate Limiting**: 120 requests per minute per IP
- **Input Sanitization**: MongoDB injection prevention
- **CORS Protection**: Configured allowed origins
- **Helmet.js**: Security headers
- **Request Size Limits**: 1MB maximum payload
- **Input Validation**: Express-validator for all endpoints

## 🗄️ Database Schema

```javascript
// UserProfile Schema
{
  userId: String,           // Unique user identifier
  answers: Object,          // Parsed health data
  risk_level: String,       // 'low', 'medium', 'high'
  score: Number,           // Computed risk score (0-100)
  recommendations: [String], // Generated recommendations
  createdAt: Date,         // Profile creation timestamp
  updatedAt: Date          // Last update timestamp
}
```

## 🚀 Deployment

### Local Development with Ngrok
```bash
# Install ngrok globally
npm install -g ngrok

# Expose backend
ngrok http 3000
```

### Cloud Deployment (Heroku + MongoDB Atlas)

1. **MongoDB Atlas Setup**:
   - Create cluster at [MongoDB Atlas](https://www.mongodb.com/atlas/database)
   - Get connection URI
   - Update `MONGODB_URI` environment variable

2. **Heroku Backend Deployment**:
   ```bash
   # Login to Heroku
   heroku login
   
   # Create app
   heroku create your-health-profiler-backend
   
   # Set environment variables
   heroku config:set MONGODB_URI=your_atlas_uri
   heroku config:set CORS_ORIGIN=your_frontend_url
   
   # Deploy
   git push heroku main
   ```

3. **Frontend Deployment** (Netlify/Vercel):
   - Update API base URL to your Heroku backend
   - Deploy frontend to hosting service

## 📁 Project Structure

```
health-profile-backend/
├── models/
│   └── UserProfile.js      # MongoDB schema
├── utils/
│   ├── parser.js          # Text parsing logic
│   └── riskEngine.js      # Risk computation
├── middleware/
│   └── errorHandler.js    # Error handling
├── server.js              # Main server file
├── package.json
└── .env

health-profile-frontend/
├── src/
│   ├── components/
│   │   ├── FileUpload.tsx
│   │   ├── TextInput.tsx
│   │   └── RiskAssessment.tsx
│   ├── services/
│   │   ├── riskAnalysis.ts
│   │   └── backendDatabaseService.ts
│   ├── pages/
│   │   └── Index.tsx
│   └── hooks/
│       └── useOCR.ts
├── package.json
└── vite.config.ts
```

## 🔧 Configuration

### Backend Environment Variables
```env
PORT=3000                                    # Server port
MONGODB_URI=mongodb://localhost:27017/health_risk_profiler  # Database URI
CORS_ORIGIN=http://localhost:8080           # Allowed origins
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:3000          # Backend API URL
```

## 🐛 Error Handling

The application includes comprehensive error handling:

- **Validation Errors**: 400 Bad Request with details
- **Missing Data**: Guardrail responses for incomplete profiles
- **Database Errors**: 500 Internal Server Error with logging
- **OCR Failures**: User-friendly error messages
- **Network Issues**: Retry mechanisms and timeout handling

## 📈 Performance Optimizations

- **Client-side OCR**: Reduces server load
- **Request rate limiting**: Prevents abuse
- **Database indexing**: Fast user lookups
- **Efficient parsing**: Regex-based text extraction
- **Memory management**: Object URL cleanup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the verification report: `VERIFICATION_REPORT.md`
2. Run the test script: `node test-api.js`
3. Check server logs for backend issues
4. Verify MongoDB connection

## ✅ Verification Status

**Status**: ✅ FULLY FUNCTIONAL WITH DYNAMIC DATA

All components tested and verified:
- ✅ OCR processing with Tesseract.js
- ✅ Dynamic text parsing with guardrails
- ✅ Risk computation with factor extraction
- ✅ MongoDB data persistence
- ✅ React frontend with real-time updates
- ✅ Complete error handling
- ✅ Security middleware
- ✅ API documentation and testing

**No static or mock data** - all functionality uses dynamic, real-time processing.
