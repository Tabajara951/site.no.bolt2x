/*
  # Fix Security Issues

  ## Changes
  1. Remove unused index `idx_youtube_videos_display_order`
  2. Fix function `update_updated_at_column` to have immutable search_path

  ## Security Improvements
  - Removes unused database objects to reduce attack surface
  - Sets explicit search_path on function to prevent search_path manipulation attacks
*/

-- Drop unused index
DROP INDEX IF EXISTS idx_youtube_videos_display_order;

-- Recreate function with secure search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = pg_catalog, public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;