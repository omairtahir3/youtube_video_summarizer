/**
 * YouTube URL utility functions
 */

/**
 * Extract video ID from various YouTube URL formats
 */
export function extractVideoId(url) {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Validate if a string is a valid YouTube URL
 */
export function isValidYouTubeUrl(url) {
  return extractVideoId(url) !== null;
}

/**
 * Fetch video metadata via YouTube oEmbed API
 */
export async function getVideoMetadata(videoId) {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch video metadata');
    }

    const data = await response.json();

    return {
      title: data.title || 'Untitled Video',
      channelName: data.author_name || 'Unknown Channel',
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      videoId: videoId,
    };
  } catch (error) {
    return {
      title: 'YouTube Video',
      channelName: 'Unknown Channel',
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      videoId: videoId,
    };
  }
}

/**
 * Convert seconds to timestamp string (MM:SS or HH:MM:SS)
 */
export function formatTimestamp(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Generate YouTube link at specific timestamp
 */
export function getTimestampLink(videoId, seconds) {
  return `https://www.youtube.com/watch?v=${videoId}&t=${Math.floor(seconds)}s`;
}
