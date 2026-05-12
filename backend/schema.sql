-- GovConnect Database Schema

-- Users table
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  aadhaar_number VARCHAR(20),
  state VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'citizen',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- OTP verifications table
CREATE TABLE otp_verifications (
  otp_id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp_code VARCHAR(10) NOT NULL,
  purpose VARCHAR(20) NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Schemes table
CREATE TABLE schemes (
  scheme_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  ministry VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  benefit TEXT NOT NULL,
  income_limit INTEGER NOT NULL,
  deadline VARCHAR(100),
  processing VARCHAR(100),
  color VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Scheme documents table
CREATE TABLE scheme_documents (
  document_id SERIAL PRIMARY KEY,
  scheme_id INTEGER REFERENCES schemes(scheme_id) ON DELETE CASCADE,
  document_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
  application_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  scheme_id INTEGER REFERENCES schemes(scheme_id) ON DELETE CASCADE,
  applicant_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  aadhaar_number VARCHAR(20),
  state VARCHAR(100),
  income INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'Submitted',
  submitted_on TIMESTAMP DEFAULT NOW(),
  next_step TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Application documents table
CREATE TABLE application_documents (
  document_id SERIAL PRIMARY KEY,
  application_id INTEGER REFERENCES applications(application_id) ON DELETE CASCADE,
  document_name VARCHAR(255) NOT NULL,
  document_url TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  notification_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample schemes
INSERT INTO schemes (name, ministry, category, benefit, income_limit, deadline, processing, color) VALUES
('PM Scholarship Support', 'Ministry of Education', 'Education', 'Financial support up to Rs. 25,000 for eligible students.', 250000, '30 June 2026', '7 to 15 days', 'from-cyan-500 to-blue-600'),
('Ayushman Bharat Health Card', 'Ministry of Health', 'Healthcare', 'Health insurance support for eligible families.', 300000, 'Open all year', '5 to 10 days', 'from-emerald-500 to-teal-600'),
('Housing Assistance Scheme', 'Ministry of Housing', 'Housing support for low-income families.', 200000, '15 August 2026', '15 to 30 days', 'from-purple-500 to-fuchsia-600'),
('Digital Skill Development', 'Skill India Mission', 'Employment', 'Free digital training and job assistance.', 500000, 'Open all year', '3 to 7 days', 'from-amber-500 to-orange-600'),
('Women Entrepreneurship Grant', 'Ministry of Women and Child Development', 'Business', 'Startup assistance for women entrepreneurs.', 400000, '20 September 2026', '20 to 35 days', 'from-pink-500 to-rose-600'),
('Senior Citizen Pension', 'Social Welfare Department', 'Pension', 'Monthly pension support for eligible senior citizens.', 180000, 'Open all year', '10 to 20 days', 'from-indigo-500 to-violet-600');

INSERT INTO scheme_documents (scheme_id, document_name) VALUES
(1, 'Aadhaar Card'),
(1, 'Income Certificate'),
(1, 'Student ID'),
(2, 'Aadhaar Card'),
(2, 'Ration Card'),
(2, 'Address Proof'),
(3, 'Aadhaar Card'),
(3, 'Income Certificate'),
(3, 'Residence Proof'),
(4, 'Aadhaar Card'),
(4, 'Education Certificate'),
(5, 'Aadhaar Card'),
(5, 'Business Plan'),
(5, 'Bank Details'),
(6, 'Aadhaar Card'),
(6, 'Age Proof'),
(6, 'Income Certificate');

-- Insert admin user (password: admin123)
INSERT INTO users (full_name, email, phone, aadhaar_number, state, password_hash, role, is_verified) VALUES
('Admin User', 'admin@govconnect.com', '9999999999', '111111111111', 'Delhi', '.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', true);
