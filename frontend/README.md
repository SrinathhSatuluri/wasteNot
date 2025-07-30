# WasteNot – Food Waste Rescue Platform

WasteNot is a mission-driven platform that connects food donors (restaurants, bakeries, grocers) with local food banks, shelters, and volunteers. Our goal: **rescue surplus food, reduce waste, and fight hunger** through a simple, scalable, and community-powered logistics solution.

---

## 🌱 Why WasteNot?

Every year, millions of pounds of edible food are thrown away while people go hungry. WasteNot bridges this gap by making it easy for businesses to donate surplus food and for agencies and volunteers to claim and distribute it—**maximizing social impact with minimal friction**.

---

## 🚀 Product Overview

- **For Donors:** Post available food donations in seconds.
- **For Agencies & Volunteers:** Discover, claim, and coordinate pickups of nearby food donations.
- **For All:** Track your impact, receive notifications, and help build a more sustainable community.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (React), Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens)
- **Real-time:** Socket.IO for notifications
- **Maps:** Leaflet with React-Leaflet
- **API Testing:** Postman (collection included)
- **Deployment:** Vercel (frontend), MongoDB Atlas (database)

---

## ✨ Features

- **Role-based authentication:** Donor, Volunteer, Agency
- **Secure JWT login & registration**
- **Food donation management:** Create, claim, and track donations
- **Food request system:** Post and fulfill food requests
- **Interactive map interface:** View donations and requests on a map
- **Real-time notifications:** Socket.IO powered updates
- **Volunteer management:** Agencies can view and manage volunteers
- **Geolocation support:** Location-based filtering and search
- **Role-based dashboards:** Customized views for each user type
- **API-first design:** Clean separation of backend and frontend
- **Modern, responsive UI:** Built with Tailwind CSS and shadcn/ui
- **Error handling:** Comprehensive error boundaries and validation
- **API tested with Postman:** Complete test collection included
- **Ready for cloud deployment**

---

## 📸 Screenshots

*Coming soon!*

---

## 🏁 Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- [Optional] Postman for API testing

### 1. Backend Setup

```bash
cd backend
npm install
# Create a .env file with:
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_random_secret
# PORT=5000
# FRONTEND_URL=http://localhost:3000
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
# Create a .env.local file with:
# NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🔧 Critical Fixes & Improvements

### ✅ Completed Fixes

1. **Centralized API Configuration**
   - Created `frontend/lib/api.ts` with centralized API endpoints
   - Replaced hardcoded URLs with environment variables
   - Added `NEXT_PUBLIC_API_URL` configuration

2. **Error Handling**
   - Implemented comprehensive Error Boundary component
   - Added error boundaries to root layout
   - Graceful error handling throughout the application

3. **Form Validation**
   - Created validation utility (`frontend/lib/validation.ts`)
   - Common validation rules for forms
   - Type-safe validation functions

4. **Loading States**
   - Created reusable LoadingSpinner component
   - LoadingPage and LoadingCard variants
   - Consistent loading states across the app

5. **Environment Configuration**
   - Frontend environment variables in `.env.local`
   - Backend environment variables in `.env`
   - Proper configuration documentation

### 🚀 Performance & UX Improvements

- **Real-time Updates:** Socket.IO integration for live notifications
- **Interactive Maps:** Leaflet integration with geolocation support
- **Responsive Design:** Mobile-friendly interface
- **Type Safety:** Comprehensive TypeScript implementation
- **API Consistency:** Standardized API request patterns

---

## 🧪 API Testing

- Import the Postman collection from `/postman/wasteNot API.postman_collection.json`
- Test endpoints such as:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Example requests and responses are included in the collection.

---

## 🗂️ Project Structure

```
wasteNot/
  backend/    # Express API, MongoDB models, authentication
  frontend/   # Next.js app, React components, styling
  postman/    # Postman API test collections
```

---

**This README covers:**
- What the product is and why it matters
- Features and tech stack
- Setup instructions
- API testing
- Project structure
- Contribution guidelines
- Roadmap
- License and inspiration



---

## 📝 Contributing

We welcome contributions from the community!

1. **Fork** the repository and clone your fork.
2. **Create a feature branch:** `git checkout -b feature/your-feature`
3. **Commit** your changes with clear messages.
4. **Push** to your fork and open a **Pull Request**.
5. Please document any new endpoints or features in the README or Postman collection.

---

## 📈 Roadmap

- [x] User authentication (register/login)
- [x] Donation post creation & claiming
- [x] Role-based dashboards
- [x] Interactive map interface
- [x] Real-time notifications
- [x] Volunteer management
- [x] Food request system
- [x] Geolocation support
- [ ] Social login (Google, Apple, Meta)
- [ ] Notifications (email/SMS)
- [ ] Impact analytics for donors/agencies
- [ ] Mobile app development
- [ ] Multi-language support

---

## 💡 Inspiration & Credits

Inspired by real-world food rescue efforts and platforms like Too Good To Go, OLIO, and Copia. WasteNot is built for social good, open collaboration, and real impact.

---

## 📄 License

MIT

---

> **Waste less. Feed more. Make an impact with WasteNot.**
