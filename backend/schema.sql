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
  purpose VARCHAR(20) NOT NULL, -- 'register' or 'login'
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
  documents TEXT[], -- Array of required documents
  deadline VARCHAR(100),
  processing VARCHAR(100),
  color VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
  application_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  scheme_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  ministry VARCHAR(255) NOT NULL,
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

-- Insert sample schemes
INSERT INTO schemes (name, ministry, category, benefit, income_limit, documents, deadline, processing, color) VALUES
('PM Scholarship Support', 'Ministry of Education', 'Education', 'Financial support up to Rs. 25,000 for eligible students.', 250000, ARRAY['Aadhaar Card', 'Income Certificate', 'Student ID'], '30 June 2026', '7 to 15 days', 'from-cyan-500 to-blue-600'),
('Ayushman Bharat Health Card', 'Ministry of Health', 'Healthcare', 'Health insurance support for eligible families.', 300000, ARRAY['Aadhaar Card', 'Ration Card', 'Address Proof'], 'Open all year', '5 to 10 days', 'from-emerald-500 to-teal-600'),
('Housing Assistance Scheme', 'Ministry of Housing', 'Housing', 'Housing support for low-income families.', 200000, ARRAY['Aadhaar Card', 'Income Certificate', 'Residence Proof'], '15 August 2026', '15 to 30 days', 'from-purple-500 to-fuchsia-600'),
('Digital Skill Development', 'Skill India Mission', 'Employment', 'Free digital training and job assistance.', 500000, ARRAY['Aadhaar Card', 'Education Certificate'], 'Open all year', '3 to 7 days', 'from-amber-500 to-orange-600'),
('Women Entrepreneurship Grant', 'Ministry of Women and Child Development', 'Business', 'Startup assistance for women entrepreneurs.', 400000, ARRAY['Aadhaar Card', 'Business Plan', 'Bank Details'], '20 September 2026', '20 to 35 days', 'from-pink-500 to-rose-600'),
('Senior Citizen Pension', 'Social Welfare Department', 'Pension', 'Monthly pension support for eligible senior citizens.', 180000, ARRAY['Aadhaar Card', 'Age Proof', 'Income Certificate'], 'Open all year', '10 to 20 days', 'from-indigo-500 to-violet-600');

-- Insert admin user (password: admin123)
INSERT INTO users (full_name, email, phone, aadhaar_number, state, password_hash, role, is_verified) VALUES
('Admin User', 'admin@govconnect.com', '9999999999', '111111111111', 'Delhi', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', true);