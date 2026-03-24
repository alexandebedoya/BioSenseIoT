-- BioSense IoT - Normalized 3NF Schema for R2DBC
-- Drop existing tables for a fresh start (optional, but requested to "Generate final schema")
DROP TABLE IF EXISTS ai_diagnostics;
DROP TABLE IF EXISTS sensor_readings;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS user_health_mapping;
DROP TABLE IF EXISTS health_conditions;
DROP TABLE IF EXISTS users;

-- 1. Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Health conditions master table
CREATE TABLE health_conditions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 3. Mapping users to their health conditions (many-to-many)
CREATE TABLE user_health_mapping (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    condition_id INTEGER NOT NULL REFERENCES health_conditions(id) ON DELETE CASCADE,
    UNIQUE(user_id, condition_id)
);

-- 4. Pets table
CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50), -- e.g., 'Dog', 'Cat'
    breed VARCHAR(100),
    vulnerabilities TEXT, -- e.g., 'Asthmatic', 'Sensitive to CO'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Devices table
CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mac_address VARCHAR(17) UNIQUE NOT NULL,
    name VARCHAR(100),
    last_seen TIMESTAMP WITH TIME ZONE
);

-- 6. Sensor readings table (Optimized for time-series)
CREATE TABLE sensor_readings (
    id BIGSERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    mq4_value DOUBLE PRECISION NOT NULL, -- CH4/Natural Gas
    mq7_value DOUBLE PRECISION NOT NULL, -- Carbon Monoxide
    mq135_value DOUBLE PRECISION NOT NULL, -- Air Quality (NH3, NOx, Alcohol, Benzene, Smoke, CO2)
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. AI Diagnostics results
CREATE TABLE ai_diagnostics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reading_id BIGINT NOT NULL REFERENCES sensor_readings(id) ON DELETE CASCADE,
    diagnostic_text TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    recommendation TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_sensor_readings_device_id ON sensor_readings(device_id);
CREATE INDEX idx_sensor_readings_timestamp ON sensor_readings(timestamp DESC);
CREATE INDEX idx_ai_diagnostics_user_id ON ai_diagnostics(user_id);
CREATE INDEX idx_pets_user_id ON pets(user_id);
