/**
 * YouTube URL Utilities for Backend
 * Helper functions for validating and extracting YouTube video IDs
 */

// YouTube video ID pattern (11 characters, alphanumeric, underscore, hyphen)
const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

// YouTube URL patterns
const YOUTUBE_PATTERNS = [
  // Standard watch URL: youtube.com/watch?v=VIDEO_ID
  /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*&v=)([a-zA-Z0-9_-]{11})/,
  // Short URL: youtu.be/VIDEO_ID
  /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  // Embed URL: youtube.com/embed/VIDEO_ID
  /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  // Shorts URL: youtube.com/shorts/VIDEO_ID
  /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  // Live URL: youtube.com/live/VIDEO_ID
  /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
];

/**
 * Extract YouTube video ID from various URL formats
 * @param url - YouTube URL or video ID
 * @returns Video ID or null if invalid
 */
export function extractYouTubeVideoId(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    return null;
  }

  // If it's already just a video ID (11 characters)
  if (YOUTUBE_ID_PATTERN.test(trimmedUrl)) {
    return trimmedUrl;
  }

  // Try to extract ID from URL patterns
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = trimmedUrl.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Validate if a string is a valid YouTube URL or video ID
 * @param url - URL or video ID to validate
 * @returns boolean indicating validity
 */
export function isValidYouTubeUrl(url: string | null | undefined): boolean {
  return extractYouTubeVideoId(url) !== null;
}

/**
 * Sanitize and normalize YouTube URL
 * @param url - Raw URL input
 * @returns Normalized URL or null if invalid
 */
export function sanitizeYouTubeUrl(url: string | null | undefined): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    return null;
  }
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Get YouTube embed URL for iframe
 * @param videoId - YouTube video ID
 * @returns Embed URL or null if invalid
 */
export function getYouTubeEmbedUrl(videoId: string | null | undefined): string | null {
  const id = extractYouTubeVideoId(videoId);
  if (!id) {
    return null;
  }
  return `https://www.youtube.com/embed/${id}`;
}

/**
 * Get YouTube watch URL
 * @param videoId - YouTube video ID
 * @returns Watch URL or null if invalid
 */
export function getYouTubeWatchUrl(videoId: string | null | undefined): string | null {
  const id = extractYouTubeVideoId(videoId);
  if (!id) {
    return null;
  }
  return `https://www.youtube.com/watch?v=${id}`;
}

/**
 * Video availability status
 */
export type VideoStatus = 'active' | 'unavailable' | 'invalid';

/**
 * Validate video and return status
 * @param videoId - Video ID to validate
 * @returns VideoStatus
 */
export function validateVideoStatus(videoId: string | null | undefined): VideoStatus {
  if (!videoId) {
    return 'invalid';
  }
  
  const id = extractYouTubeVideoId(videoId);
  if (!id) {
    return 'invalid';
  }
  
  return 'active';
}

/**
 * Interface for video validation result
 */
export interface VideoValidationResult {
  isValid: boolean;
  videoId: string | null;
  normalizedUrl: string | null;
  embedUrl: string | null;
  status: VideoStatus;
  error?: string;
}

/**
 * Comprehensive video validation
 * @param url - YouTube URL or video ID
 * @returns VideoValidationResult with all validation details
 */
export function validateYouTubeVideo(url: string | null | undefined): VideoValidationResult {
  const videoId = extractYouTubeVideoId(url);
  
  if (!videoId) {
    return {
      isValid: false,
      videoId: null,
      normalizedUrl: null,
      embedUrl: null,
      status: 'invalid',
      error: 'Invalid YouTube URL or video ID format',
    };
  }

  return {
    isValid: true,
    videoId,
    normalizedUrl: getYouTubeWatchUrl(videoId),
    embedUrl: getYouTubeEmbedUrl(videoId),
    status: 'active',
  };
}

/**
 * Middleware to validate video data before saving
 * @param videoData - Video data to validate
 * @returns Validation result with errors if any
 */
export function validateVideoData(videoData: {
  title?: string;
  youtube_url?: string;
  youtube_video_id?: string;
  duration_seconds?: number;
}): { isValid: boolean; errors: string[]; sanitizedData?: any } {
  const errors: string[] = [];
  
  // Validate title
  if (!videoData.title || videoData.title.trim().length === 0) {
    errors.push('Video title is required');
  }
  
  // Validate YouTube URL or video ID
  const youtubeInput = videoData.youtube_video_id || videoData.youtube_url;
  const validation = validateYouTubeVideo(youtubeInput);
  
  if (!validation.isValid) {
    errors.push(validation.error || 'Invalid YouTube URL');
  }
  
  // Validate duration
  if (!videoData.duration_seconds || videoData.duration_seconds <= 0) {
    errors.push('Valid duration is required');
  }
  
  if (errors.length > 0) {
    return { isValid: false, errors };
  }
  
  // Return sanitized data
  return {
    isValid: true,
    errors: [],
    sanitizedData: {
      ...videoData,
      youtube_video_id: validation.videoId,
      youtube_url: validation.normalizedUrl,
    },
  };
}

/**
 * Get YouTube thumbnail URL from video ID
 * @param videoId - YouTube video ID
 * @param quality - Thumbnail quality (default, mq, hq, sd, max)
 * @returns Thumbnail URL or null
 */
export function getYouTubeThumbnail(
  videoId: string | null | undefined,
  quality: 'default' | 'mq' | 'hq' | 'sd' | 'max' = 'hq'
): string | null {
  const id = extractYouTubeVideoId(videoId);
  if (!id) {
    return null;
  }

  const qualityMap = {
    default: 'default',
    mq: 'mqdefault',
    hq: 'hqdefault',
    sd: 'sddefault',
    max: 'maxresdefault',
  };

  return `https://img.youtube.com/vi/${id}/${qualityMap[quality]}.jpg`;
}

/**
 * Extract video ID from a YouTube thumbnail URL
 * @param thumbnailUrl - YouTube thumbnail URL
 * @returns Video ID or null
 */
export function extractVideoIdFromThumbnailUrl(thumbnailUrl: string | null | undefined): string | null {
  if (!thumbnailUrl || typeof thumbnailUrl !== 'string') {
    return null;
  }

  // Match patterns like:
  // https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg
  // https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg
  const match = thumbnailUrl.match(/\/vi\/([a-zA-Z0-9_-]{11})\//);
  if (match && match[1]) {
    return match[1];
  }

  return null;
}
