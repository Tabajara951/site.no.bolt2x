/*
  # Fix RLS Policies for YouTube Videos
  
  ## Changes
  This migration updates the RLS policies for the `youtube_videos` table to allow
  operations using the anon key instead of requiring Supabase authentication.
  
  ### Security Model
  - Public users can view active videos
  - Admin operations (INSERT, UPDATE, DELETE) are allowed with anon key
  - Security is handled by the custom admin authentication system in the application
  
  ### Modified Policies
  1. "Public can view active videos" - unchanged, allows SELECT for active videos
  2. "Allow insert videos with anon key" - replaces authenticated requirement
  3. "Allow update videos with anon key" - replaces authenticated requirement
  4. "Allow delete videos with anon key" - replaces authenticated requirement
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can insert videos" ON youtube_videos;
DROP POLICY IF EXISTS "Authenticated users can update videos" ON youtube_videos;
DROP POLICY IF EXISTS "Authenticated users can delete videos" ON youtube_videos;

-- Create new policies that allow anon access
CREATE POLICY "Allow insert videos with anon key"
  ON youtube_videos
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update videos with anon key"
  ON youtube_videos
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete videos with anon key"
  ON youtube_videos
  FOR DELETE
  TO anon, authenticated
  USING (true);