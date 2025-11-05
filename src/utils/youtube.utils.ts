/**
 * Extracts YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 */
export function extractYouTubeId(url: string): string | null {
  try {
    const patterns = [
      /(?:(?:www\.)?youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
      /(?:(?:www\.)?youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
      /(?:(?:www\.)?youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
      /(?:(?:www\.)?youtube\.com\/v\/)([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1].split(/[&?]/)[0];
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Generates YouTube thumbnail URL from video ID
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    maxres: 'maxresdefault',
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Validates if a URL is a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}

/**
 * Detects if a YouTube URL is a Shorts video
 */
export function isYouTubeShorts(url: string): boolean {
  return url.includes('/shorts/');
}

/**
 * Generates YouTube embed URL from video ID
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}
