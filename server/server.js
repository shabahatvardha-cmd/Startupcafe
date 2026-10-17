import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load from master root .env first, fallback to local server/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bookingRoutes from './routes/bookingRoutes.js';
import franchiseRoutes from './routes/franchiseRoutes.js';
import brochureRoutes from './routes/brochureRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Robust CORS Configuration
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://start.arunlive.com",
    "https://startupcafe.co.in",
    "https://www.startupcafe.co.in",
    "http://startupcafe.co.in",
    "http://www.startupcafe.co.in"
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`CORS Error: Origin ${origin} not allowed`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: true,
    optionsSuccessStatus: 200 // Success status for legacy browsers
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.get('/', (req, res) => {
    res.send('API is running');
});

app.use('/api/book', bookingRoutes);
app.use('/api/franchise', franchiseRoutes);
app.use('/api/brochure', brochureRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Startup Cafe API is running.' });
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/startupcafe';

if (!process.env.MONGODB_URI) {
  console.warn('⚠️ Notice: MONGODB_URI is not set in .env. Using fallback mongodb://localhost:27017/startupcafe');
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
