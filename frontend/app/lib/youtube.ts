/**
 * YouTube URL Utilities
 * Helper functions for extracting video IDs and validating YouTube URLs
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
  return getYouTubeWatchUrl(videoId);
}

/**
 * Video availability status
 */
export type VideoStatus = 'active' | 'unavailable' | 'invalid' | 'checking';

/**
 * Check if video ID format is valid (not checking actual availability)
 * @param videoId - Video ID to check
 * @returns VideoStatus
 */
export function getVideoStatus(videoId: string | null | undefined): VideoStatus {
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
 * Log video errors for debugging
 * @param context - Where the error occurred
 * @param videoId - Video ID that failed
 * @param courseId - Course ID
 * @param lessonTitle - Lesson title
 * @param error - Error details
 */
export function logVideoError(
  context: string,
  videoId: string | null,
  courseId: string | null,
  lessonTitle: string,
  error: string
): void {
  console.error('[Video Error]', {
    context,
    videoId,
    courseId,
    lessonTitle,
    error,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Get thumbnail URL for YouTube video
 * @param videoId - YouTube video ID
 * @param quality - Thumbnail quality (default, mq, hq, sd, max)
 * @returns Thumbnail URL or null
 */
export function getYouTubeThumbnail(
  videoId: string | null | undefined,
  quality: 'default' | 'mq' | 'hq' | 'sd' | 'max' = 'mq'
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
 * Get all possible thumbnail URLs for fallback (ordered by quality)
 * @param videoId - YouTube video ID
 * @returns Array of thumbnail URLs from highest to lowest quality
 */
export function getYouTubeThumbnailFallbacks(videoId: string | null | undefined): string[] {
  const id = extractYouTubeVideoId(videoId);
  if (!id) {
    return [];
  }

  // Order: maxresdefault (highest) -> sddefault -> hqdefault -> mqdefault -> default (lowest)
  return [
    `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${id}/sddefault.jpg`,
    `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
    `https://img.youtube.com/vi/${id}/default.jpg`,
  ];
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
  // https://i.ytimg.com/vi=VIDEO_ID/maxresdefault.jpg (incorrect but handle it)
  const match = thumbnailUrl.match(/\/vi[=/]([a-zA-Z0-9_-]{11})\//);
  if (match && match[1]) {
    return match[1];
  }

  return null;
}

/**
 * Get thumbnail URL from either a video ID or a thumbnail URL
 * This helps handle both cases: direct video IDs and existing thumbnail URLs
 * @param input - Video ID, YouTube URL, or thumbnail URL
 * @param quality - Desired thumbnail quality
 * @returns Thumbnail URL or null
 */
export function getThumbnailFromAny(
  input: string | null | undefined,
  quality: 'default' | 'mq' | 'hq' | 'sd' | 'max' = 'hq'
): string | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  // First, try to extract as a video ID or YouTube URL
  const videoId = extractYouTubeVideoId(input);
  if (videoId) {
    return getYouTubeThumbnail(videoId, quality);
  }

  // If it's already a thumbnail URL, extract the video ID and regenerate
  const extractedId = extractVideoIdFromThumbnailUrl(input);
  if (extractedId) {
    return getYouTubeThumbnail(extractedId, quality);
  }

  // Return the original input as-is (might be an external URL)
  return input;
}

/**
 * Log broken course data in development
 * @param courseTitle - Course title
 * @param field - Field that has an issue
 * @param value - The problematic value
 * @param reason - Why it's broken
 */
export function logBrokenCourse(
  courseTitle: string,
  field: string,
  value: string | null | undefined,
  reason: string
): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[Broken Course Data]', {
      course: courseTitle,
      field,
      value,
      reason,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Validate course data and log issues
 * @param course - Course object to validate
 * @returns Whether the course has valid data
 */
export function validateCourseData(course: {
  title: string;
  thumbnail_url?: string | null;
  sections?: Array<{
    title?: string;
    videos?: Array<{
      youtube_video_id?: string | null;
      youtube_url?: string | null;
      title: string;
    }>;
  }>;
}): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check thumbnail
  if (course.thumbnail_url) {
    const thumbnailVideoId = extractVideoIdFromThumbnailUrl(course.thumbnail_url);
    if (!thumbnailVideoId) {
      issues.push(`Invalid thumbnail URL format`);
      logBrokenCourse(course.title, 'thumbnail_url', course.thumbnail_url, 'Could not extract video ID');
    }
  }

  // Check videos
  if (course.sections) {
    course.sections.forEach((section, sIndex) => {
      section.videos?.forEach((video, vIndex) => {
        const hasValidId = isValidYouTubeUrl(video.youtube_video_id);
        const hasValidUrl = isValidYouTubeUrl(video.youtube_url);
        
        if (!hasValidId && !hasValidUrl) {
          issues.push(`Section ${sIndex + 1}, Video ${vIndex + 1} (${video.title}): Invalid YouTube video`);
          logBrokenCourse(
            course.title,
            'youtube_video_id',
            video.youtube_video_id || video.youtube_url,
            `Invalid video in section "${section.title || 'Unknown'}"`
          );
        }
      });
    });
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
