/*
  # Add video type column to youtube_videos

  1. Changes
    - Add `video_type` column to `youtube_videos` table
      - Type: text with check constraint
      - Values: 'shorts' or 'normal'
      - Default: 'normal'
    - Update existing records based on URL patterns
  
  2. Purpose
    - Allows different display styles for YouTube Shorts (vertical) vs normal videos (horizontal)
*/

-- Add video_type column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'youtube_videos' AND column_name = 'video_type'
  ) THEN
    ALTER TABLE youtube_videos 
    ADD COLUMN video_type text DEFAULT 'normal' NOT NULL
    CHECK (video_type IN ('shorts', 'normal'));
  END IF;
END $$;

-- Update existing records to set video_type based on URL
UPDATE youtube_videos
SET video_type = CASE
  WHEN youtube_url LIKE '%/shorts/%' THEN 'shorts'
  ELSE 'normal'
END
WHERE video_type = 'normal';