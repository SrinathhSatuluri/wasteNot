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

- **Frontend:** Next.js (React), Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens)
- **API Testing:** Postman (collection included)
- **Deployment:** Vercel (frontend), MongoDB Atlas (database)

---

## ✨ Features

- **Role-based authentication:** Donor, Volunteer, Agency
- **Secure JWT login & registration**
- **Donation posts:** Donors can create, agencies/volunteers can claim
- **Role-based dashboards** (coming soon)
- **API-first design:** Clean separation of backend and frontend
- **Modern, responsive UI**
- **API tested with Postman**
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
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

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
- [ ] Donation post creation & claiming
- [ ] Role-based dashboards
- [ ] Notifications (email/SMS)
- [ ] Impact analytics for donors/agencies
- [ ] Mobile-friendly UI
- [ ] Multi-language support

---

## 💡 Inspiration & Credits

Inspired by real-world food rescue efforts and platforms like Too Good To Go, OLIO, and Copia. WasteNot is built for social good, open collaboration, and real impact.

---

## 📄 License

MIT

---

> **Waste less. Feed more. Make an impact with WasteNot.**
