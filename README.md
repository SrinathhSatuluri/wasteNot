#  WasteNot - Food Waste Rescue Platform

A comprehensive platform connecting food donors with food banks, shelters, and volunteers to reduce food waste and fight hunger.

##  Features

###  **Core Features (Phase 1 Complete)**
- **User Authentication & Authorization**
  - Email/password registration and login
  - Social login (Google, Facebook, Apple) - Configured with fallbacks
  - Role-based access control (Donor, Volunteer, Agency)
  - JWT token authentication
  - Password strength validation

- **Food Donation Management**
  - Create, view, and manage food donations
  - Geolocation-based donation posting
  - Real-time donation status updates
  - Donation claiming and pickup coordination
  - Expiry date tracking

- **Food Request System**
  - Agencies can post food requests
  - Urgency levels and deadline tracking
  - Request fulfillment tracking
  - Location-based request matching

- **Volunteer Management**
  - Volunteer availability tracking
  - Rating and feedback system
  - Pickup completion tracking
  - Agency volunteer management dashboard

- **Interactive Maps**
  - Real-time donation and request mapping
  - Geolocation-based search
  - Distance-based filtering
  - Interactive markers with details

- **Real-time Notifications**
  - Socket.IO integration
  - Live updates for new donations/requests
  - Claim notifications
  - Status change alerts

###  **Security & Performance (Phase 1 Must-Fixes)**
- **Comprehensive Input Validation**
  - Server-side validation with express-validator
  - Client-side form validation
  - Password strength requirements
  - Email and phone validation
  - Geolocation coordinate validation

- **Security Middleware**
  - Rate limiting (different limits for different endpoints)
  - CORS configuration with allowed origins
  - XSS protection
  - MongoDB query sanitization
  - HTTP Parameter Pollution protection
  - Security headers with Helmet
  - Input sanitization

- **Error Handling**
  - Comprehensive error handling middleware
  - Custom error classes
  - Validation error formatting
  - Production-safe error responses
  - Request logging

- **API Documentation**
  - Complete Postman collection with all endpoints
  - Environment variables configuration
  - Test scripts for all API calls
  - Comprehensive request/response examples

##  Tech Stack

### **Frontend**
- **React 18** with Next.js 14 (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** components with Stone theme
- **Leaflet** for interactive maps
- **Socket.IO Client** for real-time features
- **Sonner** for toast notifications
- **Lucide React** for icons

### **Backend**
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Passport.js** for OAuth strategies
- **Socket.IO** for real-time communication
- **Express Validator** for input validation
- **Rate Limiting** for API protection
- **Security Middleware** (Helmet, XSS, CORS, etc.)

### **Development Tools**
- **Postman** for API testing
- **Git** for version control
- **Nodemon** for development
- **Environment Variables** for configuration

##  Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Git
- Postman (for API testing)

##  Quick Start

### 1. **Clone the Repository**
```bash
git clone <repository-url>
cd wasteNot
```

### 2. **Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file:
```env
# MongoDB Connection
MONGO_URI=your_mongodb_atlas_connection_string

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Social Login (Optional - placeholders provided)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
APPLE_CLIENT_ID=your_apple_client_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_apple_key_id
APPLE_PRIVATE_KEY_PATH=./path/to/your/AuthKey.p8
```

Start the backend:
```bash
npm run dev
```

### 3. **Frontend Setup**
```bash
cd frontend
npm install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=WasteNot
NEXT_PUBLIC_APP_DESCRIPTION=Food Waste Rescue Platform
```

Start the frontend:
```bash
npm run dev
```

### 4. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

##  API Documentation

### **Postman Collection**
Import the complete API collection:
- `postman/WasteNot_API_Collection.json` - All API endpoints
- `postman/WasteNot_Environment.json` - Environment variables

### **Key Endpoints**

#### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

#### **Social Authentication**
- `GET /api/social-auth/google` - Google OAuth
- `GET /api/social-auth/facebook` - Facebook OAuth
- `POST /api/social-auth/apple` - Apple Sign-In

#### **Donations**
- `POST /api/donations` - Create donation
- `GET /api/donations` - List donations
- `GET /api/donations/my-donations` - User's donations
- `PUT /api/donations/:id/claim` - Claim donation
- `GET /api/donations/my-pickups` - User's pickups
- `PUT /api/donations/:id/complete` - Complete pickup
- `DELETE /api/donations/:id` - Delete donation

#### **Requests**
- `POST /api/requests` - Create request
- `GET /api/requests` - List requests
- `GET /api/requests/my-requests` - User's requests
- `PUT /api/requests/:id/fulfill` - Fulfill request
- `DELETE /api/requests/:id` - Delete request

#### **Volunteers**
- `GET /api/volunteers` - List volunteers
- `GET /api/volunteers/stats` - Volunteer statistics
- `GET /api/volunteers/:id` - Get volunteer details
- `PUT /api/volunteers/:id/availability` - Update availability

##  Security Features

### **Input Validation**
- Comprehensive server-side validation
- Password strength requirements
- Email and phone validation
- Geolocation coordinate validation
- File upload validation

### **Rate Limiting**
- Authentication: 5 requests per 15 minutes
- Donations: 10 requests per 15 minutes
- Requests: 10 requests per 15 minutes
- General API: 100 requests per 15 minutes

### **Security Headers**
- Content Security Policy (CSP)
- XSS Protection
- CORS with allowed origins
- MongoDB query sanitization
- HTTP Parameter Pollution protection

### **Error Handling**
- Custom error classes
- Production-safe error responses
- Comprehensive logging
- Validation error formatting

##   Testing

### **API Testing with Postman**
1. Import the collection and environment files
2. Set up environment variables
3. Run the test suite
4. Verify all endpoints work correctly

### **Manual Testing Checklist**
- [ ] User registration and login
- [ ] Social login buttons (show proper error messages)
- [ ] Donation creation and management
- [ ] Request creation and fulfillment
- [ ] Map functionality with geolocation
- [ ] Real-time notifications
- [ ] Volunteer management
- [ ] Form validation
- [ ] Error handling
- [ ] Mobile responsiveness

##   Deployment

### **Backend Deployment**
1. Set up MongoDB Atlas cluster
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, Railway, etc.)
4. Update CORS origins for production

### **Frontend Deployment**
1. Update API URL in environment variables
2. Deploy to Vercel, Netlify, or your preferred platform
3. Configure custom domain if needed

## 📈 Performance Optimizations

### **Database**
- Geospatial indexes on coordinates
- Compound indexes for common queries
- Connection pooling

### **API**
- Rate limiting to prevent abuse
- Request size limiting
- Efficient error handling
- Response caching where appropriate

### **Frontend**
- Dynamic imports for heavy components
- Image optimization
- Code splitting
- Error boundaries

##   Development

### **Code Structure**
```
wasteNot/
├── backend/
│   ├── config/
│   │   └── passport.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── donationController.js
│   │   ├── requestController.js
│   │   └── volunteerController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── security.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Donation.js
│   │   └── Request.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── donations.js
│   │   ├── requests.js
│   │   ├── socialAuth.js
│   │   └── volunteers.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── auth/
│   │   ├── donations/
│   │   ├── requests/
│   │   ├── volunteers/
│   │   ├── map/
│   │   └── ...
│   ├── components/
│   ├── lib/
│   └── package.json
└── postman/
    ├── WasteNot_API_Collection.json
    └── WasteNot_Environment.json
```

### **Environment Variables**
See `.env.example` files in both backend and frontend directories for complete configuration options.

##   Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

##   License

This project is licensed under the MIT License.

##   Support

For support and questions:
- Check the API documentation
- Review the Postman collection
- Check the console for error messages
- Verify environment variables are set correctly

---

**WasteNot** - Making food waste a thing of the past, one donation at a time! 🍎♻️ 