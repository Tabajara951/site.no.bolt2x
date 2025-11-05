/*
  # YouTube Videos Management System

  ## Overview
  This migration creates a complete system for managing YouTube videos with administrative access.

  ## New Tables

  ### `youtube_videos`
  Stores YouTube video information for display on the main site.
  - `id` (uuid, primary key) - Unique identifier for each video
  - `youtube_url` (text, not null) - Full YouTube URL
  - `youtube_id` (text, not null) - Extracted YouTube video ID
  - `title` (text) - Optional custom title for the video
  - `description` (text) - Optional description
  - `display_order` (integer, default 0) - Order in which videos appear (lower numbers first)
  - `is_active` (boolean, default true) - Whether video is visible on site
  - `created_at` (timestamptz) - When video was added
  - `updated_at` (timestamptz) - Last modification time

  ### `admin_users`
  Stores administrative credentials for accessing the admin panel.
  - `id` (uuid, primary key) - Unique identifier
  - `password_hash` (text, not null) - Hashed password for admin access
  - `created_at` (timestamptz) - Account creation time
  - `last_login` (timestamptz) - Last successful login

  ## Security

  ### Row Level Security (RLS)
  - **youtube_videos**: Public read access for active videos, authenticated admin-only write access
  - **admin_users**: No public access, only service role can read/write

  ### Policies
  1. Public users can SELECT active videos from youtube_videos
  2. Admin operations (INSERT, UPDATE, DELETE) require authentication
  3. admin_users table is completely restricted from public access

  ## Initial Data
  - Creates one admin user with password: $Tabajara951
*/

-- Create youtube_videos table
CREATE TABLE IF NOT EXISTS youtube_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_url text NOT NULL,
  youtube_id text NOT NULL,
  title text DEFAULT '',
  description text DEFAULT '',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Enable RLS on youtube_videos
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view active videos" ON youtube_videos;
DROP POLICY IF EXISTS "Authenticated users can insert videos" ON youtube_videos;
DROP POLICY IF EXISTS "Authenticated users can update videos" ON youtube_videos;
DROP POLICY IF EXISTS "Authenticated users can delete videos" ON youtube_videos;
DROP POLICY IF EXISTS "Service role only for admin_users" ON admin_users;

-- Policy: Anyone can view active videos
CREATE POLICY "Public can view active videos"
  ON youtube_videos
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users can insert videos
CREATE POLICY "Authenticated users can insert videos"
  ON youtube_videos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update videos
CREATE POLICY "Authenticated users can update videos"
  ON youtube_videos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete videos
CREATE POLICY "Authenticated users can delete videos"
  ON youtube_videos
  FOR DELETE
  TO authenticated
  USING (true);

-- Policy: Only service role can access admin_users (no public access)
CREATE POLICY "Service role only for admin_users"
  ON admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_youtube_videos_display_order ON youtube_videos(display_order, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_active ON youtube_videos(is_active);

-- Insert admin user with custom password
INSERT INTO admin_users (password_hash)
VALUES (md5('$Tabajara951'))
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for youtube_videos
DROP TRIGGER IF EXISTS update_youtube_videos_updated_at ON youtube_videos;
CREATE TRIGGER update_youtube_videos_updated_at
  BEFORE UPDATE ON youtube_videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();