import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { YouTubeVideo } from '../types/database.types';

interface UseYouTubeVideosResult {
  videos: YouTubeVideo[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useYouTubeVideos(): UseYouTubeVideosResult {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    if (!supabase) {
      setError('Supabase not configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('youtube_videos')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setVideos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch videos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return {
    videos,
    loading,
    error,
    refetch: fetchVideos,
  };
}
