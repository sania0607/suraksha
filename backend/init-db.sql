-- Initialize database with default data
-- This script runs when the Docker container starts for the first time

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert default admin user (password will be hashed by the application)
-- The application will handle creating the admin user on startup

-- Insert default disaster modules
-- These will be inserted by the application's startup script

-- Insert default emergency contacts
-- These will be managed through the admin interface

-- Insert default campus locations
-- These will be configured by the admin

-- Create indexes for better performance (in addition to SQLAlchemy indexes)
-- Additional indexes can be added here if needed

-- Set up database permissions
-- Grant necessary permissions to the application user

COMMENT ON DATABASE suraksha IS 'Suraksha Disaster Preparedness Platform Database';