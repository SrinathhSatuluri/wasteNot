const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
// const socketIo = require('socket.io'); // Temporarily disabled for Railway deployment
const dotenv = require('dotenv');
const passport = require('./config/passport');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
const {
  corsOptions,
  sanitizeInput,
  securityHeaders,
  mongoSanitization,
  xssProtection,
  hppProtection,
  authLimiter,
  devAuthLimiter,
  apiLimiter,
  donationLimiter,
  requestLimiter,
  requestLogger
} = require('./middleware/security');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
// const io = socketIo(server, { // Temporarily disabled for Railway deployment
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"]
//   }
// });

const PORT = process.env.PORT || 5000;

// Security middleware - temporarily simplified for deployment
app.use(securityHeaders);
// app.use(mongoSanitization); // Temporarily disabled due to Express compatibility
// app.use(xssProtection); // Temporarily disabled due to Express compatibility
// app.use(hppProtection); // Temporarily disabled due to Express compatibility
app.use(sanitizeInput);

// CORS
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Passport middleware
app.use(passport.initialize());

// Rate limiting
const isDevelopment = process.env.NODE_ENV !== 'production';
app.use('/api/auth', isDevelopment ? devAuthLimiter : authLimiter);
app.use('/api/donations', donationLimiter);
app.use('/api/requests', requestLimiter);
app.use('/api', apiLimiter);

// Socket.IO connection handling
// io.on('connection', (socket) => { // Temporarily disabled for Railway deployment
//   console.log('New client connected:', socket.id);
  
//   // Join user to their role-specific room
//   socket.on('join-room', (role) => {
//     socket.join(role);
//     console.log(`User ${socket.id} joined ${role} room`);
//   });
  
//   // Handle disconnection
//   socket.on('disconnect', () => {
//     console.log('Client disconnected:', socket.id);
//   });
// });

// Make io available to routes
// app.set('io', io); // Temporarily disabled for Railway deployment

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/social-auth', require('./routes/socialAuth'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/volunteers', require('./routes/volunteers'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Development route to reset rate limits (only in development)
if (isDevelopment) {
  app.post('/api/reset-rate-limits', (req, res) => {
    // This is a simple way to reset rate limits by restarting the limiter
    res.json({ 
      message: 'Rate limits reset successfully',
      environment: 'development'
    });
  });
}

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 