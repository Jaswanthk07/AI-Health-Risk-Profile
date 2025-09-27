require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { body, validationResult } = require('express-validator');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const UserProfile = require('./models/UserProfile');
const { parseTextToAnswers } = require('./utils/parser');
const { computeRisk } = require('./utils/riskEngine');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Health Risk Profiler API',
      version: '1.0.0',
      description: 'AI-powered health risk assessment API with OCR text parsing and dynamic risk computation',
      contact: {
        name: 'Health Risk Profiler',
        email: 'support@healthprofiler.com'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        ParseRequest: {
          type: 'object',
          required: ['userId', 'text'],
          properties: {
            userId: {
              type: 'string',
              description: 'Unique user identifier',
              example: 'user123'
            },
            text: {
              type: 'string',
              description: 'Health data text to parse (from OCR or direct input)',
              example: 'Age: 42\nSmoker: yes\nExercise: rarely\nDiet: high sugar'
            }
          }
        },
        ParseResponse: {
          type: 'object',
          properties: {
            answers: {
              type: 'object',
              properties: {
                age: { type: 'number', example: 42 },
                smoker: { type: 'boolean', example: true },
                exercise: { type: 'string', example: 'rarely' },
                diet: { type: 'string', example: 'high sugar' }
              }
            },
            missing_fields: {
              type: 'array',
              items: { type: 'string' },
              example: []
            },
            confidence: {
              type: 'number',
              minimum: 0,
              maximum: 1,
              example: 0.92
            }
          }
        },
        GuardrailResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'incomplete_profile'
            },
            reason: {
              type: 'string',
              example: '>50% fields missing'
            }
          }
        },
        RiskRequest: {
          type: 'object',
          required: ['userId', 'answers'],
          properties: {
            userId: {
              type: 'string',
              description: 'Unique user identifier',
              example: 'user123'
            },
            answers: {
              type: 'object',
              description: 'Parsed health data answers',
              properties: {
                age: { type: 'number', example: 42 },
                smoker: { type: 'boolean', example: true },
                exercise: { type: 'string', example: 'rarely' },
                diet: { type: 'string', example: 'high sugar' }
              }
            }
          }
        },
        RiskResponse: {
          type: 'object',
          properties: {
            risk_level: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              example: 'high'
            },
            score: {
              type: 'number',
              minimum: 0,
              maximum: 100,
              example: 78
            },
            recommendations: {
              type: 'array',
              items: { type: 'string' },
              example: ['Quit smoking', 'Reduce sugar', 'Walk 30 mins daily']
            },
            factors: {
              type: 'array',
              items: { type: 'string' },
              example: ['smoking', 'poor diet', 'low exercise']
            },
            rationale: {
              type: 'array',
              items: { type: 'string' },
              example: ['smoking', 'high sugar diet', 'low activity']
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok'
            },
            uptime: {
              type: 'number',
              example: 1234.56
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Validation failed'
            },
            details: {
              type: 'array',
              items: { type: 'object' }
            }
          }
        }
      }
    }
  },
  apis: ['./server.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173','http://localhost:3000','http://localhost:8080'],
  credentials: true
}));
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Health Risk Profiler API'
}));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns server status and uptime
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/health_risk_profiler';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('[MongoDB] Connected'))
  .catch((err) => { console.error('[MongoDB] Connection error:', err.message); process.exit(1); });

/**
 * @swagger
 * /parse:
 *   post:
 *     summary: Parse health data text
 *     description: Extracts structured health data from text input (OCR or direct) with guardrails
 *     tags: [Health Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParseRequest'
 *     responses:
 *       200:
 *         description: Successfully parsed health data
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ParseResponse'
 *                 - $ref: '#/components/schemas/GuardrailResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
app.post('/parse', [
  body('userId').isString().trim().notEmpty(),
  body('text').isString().trim().notEmpty(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });

    const { userId, text } = req.body;
    const { answers, patientInfo, missing_fields, confidence } = parseTextToAnswers(text);

    // Guardrail: if more than 50% of expected fields are missing, exit early
    const expectedFields = ['age', 'smoker', 'exercise', 'diet'];
    const missingCount = expectedFields.filter((f) => !Object.prototype.hasOwnProperty.call(answers, f)).length;
    if (missingCount / expectedFields.length > 0.5) {
      return res.json({ status: 'incomplete_profile', reason: '>50% fields missing' });
    }

    await UserProfile.findOneAndUpdate(
      { userId },
      { userId, answers, patientInfo, updatedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ answers, patientInfo, missing_fields, confidence });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /risk:
 *   post:
 *     summary: Compute health risk assessment
 *     description: Calculates risk level, score, and generates personalized recommendations with factor extraction
 *     tags: [Health Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RiskRequest'
 *     responses:
 *       200:
 *         description: Successfully computed risk assessment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RiskResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
app.post('/risk', [
  body('userId').isString().trim().notEmpty(),
  body('answers').isObject().notEmpty(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });

    const { userId, answers } = req.body;
    const { risk_level, score, recommendations, factors, rationale } = computeRisk(answers);

    await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { answers, risk_level, score, recommendations, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true, new: true }
    );

    return res.json({ risk_level, score, recommendations, factors, rationale });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /report/{userId}:
 *   get:
 *     summary: Download patient health report
 *     description: Generate and download a comprehensive health report in JSON format
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to generate report for
 *     responses:
 *       200:
 *         description: Health report generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 patient:
 *                   type: object
 *                 healthData:
 *                   type: object
 *                 riskAssessment:
 *                   type: object
 *                 generatedAt:
 *                   type: string
 *       404:
 *         description: User profile not found
 */
app.get('/report/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const userProfile = await UserProfile.findOne({ userId });
    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Generate comprehensive report
    const report = {
      patient: userProfile.patientInfo || {},
      healthData: {
        answers: userProfile.answers || {},
        riskLevel: userProfile.risk_level || 'unknown',
        riskScore: userProfile.score || 0
      },
      riskAssessment: {
        riskLevel: userProfile.risk_level || 'unknown',
        score: userProfile.score || 0,
        recommendations: userProfile.recommendations || []
      },
      generatedAt: new Date().toISOString(),
      reportId: `RPT-${userId}-${Date.now()}`
    };

    // Set headers for download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="health-report-${userId}.json"`);
    
    return res.json(report);
  } catch (err) { next(err); }
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

