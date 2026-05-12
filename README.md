# GovConnect - Government Scheme Analyzer

A full-stack web application for citizens to discover, check eligibility, and apply for government welfare schemes.

## Features

- **User Authentication**: Register and login with OTP verification
- **Scheme Discovery**: Browse government schemes with eligibility criteria
- **Eligibility Check**: Automatic income-based eligibility verification
- **Application Management**: Submit applications and track status
- **Admin Dashboard**: Manage applications and view statistics
- **Responsive Design**: Modern UI with dark theme

## Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Framer Motion for animations
- Axios for API calls

### Backend
- Node.js with Express
- PostgreSQL database
- JWT for authentication
- bcrypt for password hashing
- Nodemailer for email OTP
- CORS enabled

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- PostgreSQL database
- Git

### Database Setup
1. Create a PostgreSQL database named `govconnect`
2. Run the SQL schema from `backend/schema.sql` to create tables and insert sample data

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   - Update `DATABASE_URL` with your PostgreSQL connection string
   - Set `JWT_SECRET` to a secure random string
   - Configure `EMAIL_USER` and `EMAIL_PASS` for Gmail SMTP
4. Start the server:
   ```bash
   npm start
   ```
   Server runs on http://localhost:5000

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   App runs on http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/resend-otp` - Resend OTP

### Schemes
- `GET /api/schemes` - Get all schemes

### Applications
- `POST /api/applications` - Submit application
- `GET /api/applications` - Get user applications

### Admin
- `GET /api/admin/applications` - Get all applications
- `PUT /api/admin/applications/:id/status` - Update application status
- `GET /api/admin/stats` - Get dashboard statistics

## Default Credentials

### Admin Login
- Email: admin@govconnect.com
- Password: admin123

### Sample Schemes
The database includes 6 sample government schemes with different categories and eligibility criteria.

## Project Structure

```
govconnect/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── schema.sql
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── hooks/
    │   ├── utils/
    │   ├── assets/
    │   └── config.js
    ├── public/
    ├── package.json
    └── vite.config.js
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.