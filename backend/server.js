const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const passport = require('./config/passport');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
const {
  securityHeaders,
  mongoSanitization,
  xssProtection,
  hppProtection,
  sanitizeInput,
  corsOptions,
  apiLimiter,
  authLimiter,
  donationLimiter,
  requestLimiter,
  requestLogger
} = require('./middleware/security');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Security middleware
app.use(securityHeaders);
app.use(mongoSanitization);
app.use(xssProtection);
app.use(hppProtection);
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
app.use('/api/auth', authLimiter);
app.use('/api/donations', donationLimiter);
app.use('/api/requests', requestLimiter);
app.use('/api', apiLimiter);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Join user to their role-specific room
  socket.on('join-room', (role) => {
    socket.join(role);
    console.log(`User ${socket.id} joined ${role} room`);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

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