# WellScan - Lab Tests Booking System

A full-stack patient portal for digital health clinic allowing patients to register, view lab tests, book appointments, and download reports.


## 🚀 Tech Stack

- **Frontend:** React with Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Authentication:** JWT
- **File Upload:** Multer
- **Validation:** Express Validator
- **Password Hashing:** bcryptjs

## 📋 Features Implementation

### Core Requirements
- 🏥 **Patient Registration** - Form to register new patients with validation
  - Components: `RegistrationForm`, `InputField`, `ValidationMessages`
  - API: `POST /api/patients/register`

- 🧪 **Lab Tests Catalog** - Display available lab tests fetched from backend
  - Components: `TestCatalog`, `TestCard`, `LoadingSpinner`
  - API: `GET /api/tests`

- 📊 **Booking History & Reports** - View bookings and download dummy PDF reports
  - Components: `BookingHistory`, `BookingCard`, `ReportDownload`
  - API: `GET /api/bookings/:patientId`, `GET /api/reports/:bookingId`

### Bonus Features
- 🔐 **JWT Authentication** - Secure login/logout with JWT tokens
  - Components: `LoginForm`, `AuthContext`, `ProtectedRoute`
  - API: `POST /api/auth/login`, `POST /api/auth/logout`

- ✅ **Input Validation** - Frontend and backend validation with error messages
  - Components: `ValidationSchema`, `ErrorBoundary`
  - Middleware: `validateInput`, `errorHandler`

## 🛠️ Development Setup

### Prerequisites
- Node.js (>= 16.0.0)
- MongoDB (local or MongoDB Atlas)
- npm

### Current Setup

1. **Project initialized**
   ```bash
   git clone https://github.com/rohit-xo21/Patient_Lab_Test_Portal.git
   cd Patient-Lab-Test-Portal
   ```

2. **Dependencies installation**
   ```bash
   npm run install-deps
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment template
   cp server/.env.example server/.env
   
   # Configure server/.env with:
   # MONGODB_URI=mongodb://localhost:27017/wellscan
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

### Authentication
- `POST /api/auth/login` - Patient login
  - **Body:** `{ email: string, password: string }`
  - **Response:** JWT token and patient data

### Patients
- `POST /api/patients/register` - Register new patient
  - **Body:** `{ name: string, email: string, phone: string, dateOfBirth: date, password: string }`
  - **Response:** Patient object with JWT token

### Tests
- `GET /api/tests` - Fetch available lab tests
  - **Response:** Array of test objects with id, name, description, price

### Bookings
- `POST /api/bookings` - Book a lab test
  - **Body:** `{ patientId: string, testId: string, appointmentDate: date }`
  - **Response:** Booking confirmation object

- `GET /api/bookings/:patientId` - Get patient bookings
  - **Response:** Array of booking objects

### Reports
- `GET /api/reports/:bookingId` - Download PDF report
  - **Response:** PDF file stream

## 🗄️ Database Models

### Patient
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  phone: String (required),
  dateOfBirth: Date,
  password: String (hashed),
  createdAt: Date (default: Date.now)
}
```

### Test
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  price: Number (required),
  category: String,
  duration: String
}
```

### Booking
```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: Patient),
  testId: ObjectId (ref: Test),
  appointmentDate: Date (required),
  status: String (enum: ['scheduled', 'completed', 'cancelled']),
  reportGenerated: Boolean (default: false),
  createdAt: Date (default: Date.now)
}
```

## 🧪 Testing

Run the application and test:
- Patient registration with validation
- Lab tests catalog browsing
- Booking creation and history
- Report download functionality

## 📈 Development Progress

### Phase 1: Project Setup & Backend Foundation
- Initialize project structure
- Setup Express server with basic middleware
- Configure MongoDB connection
- Create database models

### Phase 2: Core API Development
- Implement patient registration endpoint
- Create tests catalog endpoint
- Build booking creation endpoint
- Add booking history endpoint

### Phase 3: Frontend Implementation
- Setup React app with routing
- Create patient registration form
- Build tests catalog view
- Implement booking history page

### Phase 4: Authentication & Security
- Implement JWT authentication
- Add login/logout functionality
- Protect routes with authentication
- Add input validation middleware

### Phase 5: File Handling & Polish
- Implement dummy PDF report generation
- Add file download functionality
- Improve error handling and user feedback
- Add loading states and UI polish

## 🎯 Commit Message Conventions

This project follows structured commit messages:

- **feat:** New feature implementation
- **fix:** Bug fixes
- **docs:** Documentation updates
- **style:** Code formatting/styling
- **refactor:** Code refactoring
- **test:** Adding or updating tests
- **chore:** Build process or auxiliary tool changes
- **ui:** User interface improvements

**Format:** `type: brief description in lowercase`

**Examples:**
- `feat: implement patient registration with email validation`
- `fix: resolve CORS issues in API endpoints`
- `docs: add API endpoint documentation to README`
- `ui: improve form styling and responsive design`

## 🧪 Testing Plan

### Backend Testing
- Test patient registration with valid/invalid data
- Verify JWT token generation and validation
- Test all API endpoints with proper responses
- Validate error handling for database operations

### Frontend Testing
- Test form submissions and validation messages
- Verify navigation between different views
- Test authentication flow (login/logout)
- Check responsive design on different screen sizes

## 🚀 Deployment Plan

### Environment Variables
```bash
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
PORT=5000
NODE_ENV=production
CLIENT_URL=http://localhost:3000
```

### Deployment Targets
- **Frontend:** Netlify or Vercel
- **Backend:** Railway or Render
- **Database:** MongoDB Atlas

## 📝 Development Notes

This WellScan project is being built as a demonstration of full-stack healthcare application development with modern web technologies.

**Current Focus:** Complete implementation with modern UI/UX design and minimal clean interface.
