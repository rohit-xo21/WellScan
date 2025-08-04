# Patient Portal - Lab Tests Booking System

A full-stack patient portal for digital health clinic allowing patients to register, view lab tests, book appointments, and download reports.

## 🚀 Tech Stack

- **Frontend:** React with Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Authentication:** JWT
- **File Upload:** Multer

## 📋 Features

### Core Requirements
- ✅ Patient Registration with validation
- ✅ Lab Tests Catalog with dynamic rendering
- ✅ Booking History & Report Downloads

### Bonus Features
- 🔐 JWT Authentication System
- ✅ Comprehensive Input Validation
- 📱 Responsive Design

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (>= 16.0.0)
- MongoDB (local or MongoDB Atlas)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd patient-lab-test-portal
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp server/.env.example server/.env
   
   # Edit server/.env with your values:
   # MONGODB_URI=mongodb://localhost:27017/patient-portal
   # JWT_SECRET=your-super-secret-key-here
   # PORT=5000
   # NODE_ENV=development
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Main page components
│   │   ├── services/    # API service functions
│   │   ├── contexts/    # React contexts
│   │   └── styles/      # CSS/styling files
│   └── public/          # Static assets
├── server/              # Node.js backend
│   ├── routes/          # Express route handlers
│   ├── models/          # MongoDB schemas
│   ├── controllers/     # Route controller logic
│   ├── middleware/      # Custom middleware
│   ├── config/          # Database configuration
│   ├── utils/           # Backend utilities
│   └── uploads/         # File upload directory
└── README.md
```

## 🔗 API Endpoints

### Patients
- `POST /api/patients/register` - Register new patient
- `POST /api/auth/login` - Patient login

### Tests
- `GET /api/tests` - Fetch available lab tests

### Bookings
- `POST /api/bookings` - Book a lab test
- `GET /api/bookings/:patientId` - Get patient bookings

### Reports
- `GET /api/reports/:bookingId` - Download PDF report

## 🧪 Testing

Run the application and test:
- Patient registration with validation
- Lab tests catalog browsing
- Booking creation and history
- Report download functionality

## 📈 Development Timeline

**Estimated Duration:** 3-4 hours

1. **Phase 1:** Project Setup & Backend Foundation
2. **Phase 2:** Core API Development
3. **Phase 3:** Frontend Implementation
4. **Phase 4:** Authentication & Security
5. **Phase 5:** File Handling & Polish

## 🚀 Deployment

### Environment Variables
```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
PORT=5000
NODE_ENV=production
```

### Recommended Platforms
- **Frontend:** Netlify, Vercel, or AWS S3
- **Backend:** Heroku, Railway, or AWS EC2
- **Database:** MongoDB Atlas

## 📝 License

MIT License - see LICENSE file for details

---

*This project was built as a demonstration of full-stack healthcare application development with modern web technologies.*
