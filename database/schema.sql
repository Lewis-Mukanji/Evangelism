CREATE DATABASE IF NOT EXISTS followhim CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE followhim;

CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  phone VARCHAR(30) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('ADMIN','SUPERVISOR','PARTICIPANT') NOT NULL,
  status ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE discipleship_groups (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  supervisor_id CHAR(36) NOT NULL,
  meeting_day VARCHAR(30) NULL,
  meeting_time VARCHAR(30) NULL,
  meeting_location VARCHAR(180) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supervisor_id) REFERENCES users(id)
);
CREATE TABLE participant_profiles (
  user_id CHAR(36) PRIMARY KEY,
  conversion_date DATE NULL,
  location VARCHAR(150) NULL,
  emergency_contact VARCHAR(150) NULL,
  current_week TINYINT NOT NULL DEFAULT 1,
  group_id CHAR(36) NULL,
  registered_by CHAR(36) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (group_id) REFERENCES discipleship_groups(id),
  FOREIGN KEY (registered_by) REFERENCES users(id)
);
CREATE TABLE program_weeks (
  week_number TINYINT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  overview TEXT NULL,
  scripture VARCHAR(255) NULL,
  published BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE TABLE materials (
  id CHAR(36) PRIMARY KEY,
  week_number TINYINT NOT NULL,
  day_number TINYINT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT NULL,
  pdf_url VARCHAR(500) NULL,
  video_url VARCHAR(500) NULL,
  available_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (week_number) REFERENCES program_weeks(week_number)
);
CREATE TABLE attendance (
  id CHAR(36) PRIMARY KEY,
  participant_id CHAR(36) NOT NULL,
  week_number TINYINT NOT NULL,
  engagement_type ENUM('CLASS','CHECK_IN') NOT NULL,
  status ENUM('PRESENT','ABSENT','EXCUSED','LATE') NOT NULL,
  recorded_by CHAR(36) NOT NULL,
  notes TEXT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY one_engagement (participant_id, week_number, engagement_type),
  FOREIGN KEY (participant_id) REFERENCES users(id),
  FOREIGN KEY (recorded_by) REFERENCES users(id)
);
CREATE TABLE prayer_requests (
  id CHAR(36) PRIMARY KEY,
  participant_id CHAR(36) NOT NULL,
  request_text TEXT NOT NULL,
  visibility ENUM('SUPERVISOR','GROUP') NOT NULL DEFAULT 'SUPERVISOR',
  status ENUM('OPEN','PRAYED_FOR','ANSWERED') NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (participant_id) REFERENCES users(id)
);
CREATE TABLE follow_ups (
  id CHAR(36) PRIMARY KEY,
  participant_id CHAR(36) NOT NULL,
  supervisor_id CHAR(36) NOT NULL,
  due_at DATETIME NOT NULL,
  type ENUM('CALL','MESSAGE','VISIT','PRAYER') NOT NULL,
  note TEXT NULL,
  completed_at DATETIME NULL,
  FOREIGN KEY (participant_id) REFERENCES users(id),
  FOREIGN KEY (supervisor_id) REFERENCES users(id)
);
CREATE TABLE certificates (
  id CHAR(36) PRIMARY KEY,
  participant_id CHAR(36) NOT NULL UNIQUE,
  supervisor_approved_at DATETIME NULL,
  admin_approved_at DATETIME NULL,
  certificate_number VARCHAR(60) NOT NULL UNIQUE,
  issued_at DATETIME NULL,
  FOREIGN KEY (participant_id) REFERENCES users(id)
);
