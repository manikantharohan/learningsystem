'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  AlertCircle, 
  ExternalLink, 
  SkipForward, 
  RefreshCw,
  Loader2,
  Play
} from 'lucide-react';
import YouTube from 'react-youtube';
import { 
  extractYouTubeVideoId, 
  getYouTubeWatchUrl,
  getYouTubeThumbnail,
  logVideoError,
  type VideoStatus 
} from '@lib/youtube';

interface Video {
  id: string;
  title: string;
  description: string | null;
  youtube_video_id: string;
  duration_seconds: number;
  order_index: number;
}

interface VideoPlayerProps {
  video: Video;
  courseSlug: string;
  courseId: string;
  courseTitle: string;
  nextVideo: Video | null;
  prevVideo: Video | null;
  allVideos: Video[];
  currentVideoIndex: number;
  onVideoComplete?: () => void;
  onProgressUpdate?: (seconds: number) => void;
  initialProgress?: number;
}

type PlayerState = 'loading' | 'ready' | 'playing' | 'paused' | 'error' | 'unavailable';

export default function VideoPlayer({
  video,
  courseSlug,
  courseId,
  courseTitle,
  nextVideo,
  prevVideo,
  allVideos,
  currentVideoIndex,
  onVideoComplete,
  onProgressUpdate,
  initialProgress = 0,
}: VideoPlayerProps) {
  const router = useRouter();
  const [playerState, setPlayerState] = useState<PlayerState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loadTimeout, setLoadTimeout] = useState(false);
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extract and validate video ID
  const videoId = extractYouTubeVideoId(video.youtube_video_id);
  const watchUrl = videoId ? getYouTubeWatchUrl(videoId) : null;
  const thumbnailUrl = videoId ? getYouTubeThumbnail(videoId) : null;

  // Set up load timeout protection
  useEffect(() => {
    // Clear any existing timeout
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    // Set new timeout - if video doesn't load in 10 seconds, show error
    loadTimeoutRef.current = setTimeout(() => {
      if (playerState === 'loading') {
        setLoadTimeout(true);
        setPlayerState('unavailable');
        logVideoError(
          'Load Timeout',
          video.youtube_video_id,
          courseId,
          video.title,
          'Video failed to load within timeout period'
        );
      }
    }, 10000);

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [video.youtube_video_id, courseId, video.title, playerState]);

  // Clean up progress interval
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handlePlayerReady = useCallback((event: any) => {
    playerRef.current = event.target;
    setPlayerState('ready');
    
    // Clear load timeout
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    // Seek to initial progress if available
    if (initialProgress > 0) {
      try {
        event.target.seekTo(initialProgress, true);
      } catch (e) {
        console.warn('Failed to seek to initial progress:', e);
      }
    }

    // Start progress tracking
    progressIntervalRef.current = setInterval(() => {
      try {
        if (playerRef.current && onProgressUpdate) {
          const currentTime = playerRef.current.getCurrentTime();
          onProgressUpdate(currentTime);
        }
      } catch (e) {
        // Player not ready
      }
    }, 5000);
  }, [initialProgress, onProgressUpdate]);

  const handlePlayerStateChange = useCallback((event: any) => {
    // YouTube Player States:
    // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: video cued
    
    switch (event.data) {
      case -1: // unstarted
        setPlayerState('ready');
        break;
      case 0: // ended
        setPlayerState('ready');
        if (onVideoComplete) {
          onVideoComplete();
        }
        break;
      case 1: // playing
        setPlayerState('playing');
        break;
      case 2: // paused
        setPlayerState('paused');
        break;
      case 3: // buffering
        setPlayerState('loading');
        break;
      case 5: // video cued
        setPlayerState('ready');
        break;
      default:
        break;
    }
  }, [onVideoComplete]);

  const handlePlayerError = useCallback((event: any) => {
    setPlayerState('error');
    
    // YouTube error codes:
    // 2: Invalid parameter
    // 5: HTML5 player error
    // 100: Video not found (removed or private)
    // 101/150: Embedding disabled
    let error = 'Unknown error';
    switch (event.data) {
      case 2:
        error = 'Invalid video ID or parameter';
        break;
      case 5:
        error = 'HTML5 player error';
        break;
      case 100:
        error = 'Video not found (may be removed or private)';
        break;
      case 101:
      case 150:
        error = 'Embedding disabled by video owner';
        break;
      default:
        error = `Player error (code: ${event.data})`;
    }
    
    setErrorMessage(error);
    logVideoError(
      'Player Error',
      video.youtube_video_id,
      courseId,
      video.title,
      error
    );
  }, [video.youtube_video_id, courseId, video.title]);

  const handleRetry = () => {
    setPlayerState('loading');
    setLoadTimeout(false);
    setErrorMessage('');
    
    // Reload the player
    if (playerRef.current) {
      try {
        playerRef.current.loadVideoById(videoId);
      } catch (e) {
        // If reload fails, just let the timeout handle it
      }
    }
  };

  const handleNextVideo = () => {
    if (nextVideo) {
      router.push(`/learn/${courseSlug}/${nextVideo.id}`);
    }
  };

  const findNextWorkingVideo = (): Video | null => {
    // Try to find the next video that might work
    for (let i = currentVideoIndex + 1; i < allVideos.length; i++) {
      const nextVid = allVideos[i];
      if (extractYouTubeVideoId(nextVid.youtube_video_id)) {
        return nextVid;
      }
    }
    return null;
  };

  const handleTryAlternate = () => {
    const alternate = findNextWorkingVideo();
    if (alternate) {
      logVideoError(
        'Fallback Selected',
        video.youtube_video_id,
        courseId,
        video.title,
        `Falling back to: ${alternate.title}`
      );
      router.push(`/learn/${courseSlug}/${alternate.id}`);
    }
  };

  // If video ID is invalid, show error immediately
  if (!videoId) {
    return (
      <VideoErrorFallback
        title="Invalid Video URL"
        message="The video URL is malformed or missing."
        courseSlug={courseSlug}
        nextVideo={nextVideo}
        onNext={handleNextVideo}
        showTryAlternate={!!findNextWorkingVideo()}
        onTryAlternate={handleTryAlternate}
      />
    );
  }

  // Render based on player state
  if (playerState === 'error' || playerState === 'unavailable' || loadTimeout) {
    return (
      <VideoErrorFallback
        title="Video Unavailable"
        message={errorMessage || "This video cannot be played. It may be private, deleted, or embedding may be disabled."}
        watchUrl={watchUrl}
        courseSlug={courseSlug}
        nextVideo={nextVideo}
        onNext={handleNextVideo}
        onRetry={handleRetry}
        showTryAlternate={!!findNextWorkingVideo()}
        onTryAlternate={handleTryAlternate}
        thumbnailUrl={thumbnailUrl}
      />
    );
  }

  return (
    <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
      {/* Loading Overlay */}
      {playerState === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Loading video...</p>
          </div>
        </div>
      )}

      {/* YouTube Player */}
      <YouTube
        videoId={videoId}
        opts={{
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 0,
            rel: 0,
            modestbranding: 1,
            enablejsapi: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : '',
          },
        }}
        onReady={handlePlayerReady}
        onStateChange={handlePlayerStateChange}
        onError={handlePlayerError}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />
    </div>
  );
}

// Error Fallback Component
interface VideoErrorFallbackProps {
  title: string;
  message: string;
  watchUrl?: string | null;
  courseSlug: string;
  nextVideo: Video | null;
  onNext: () => void;
  onRetry?: () => void;
  showTryAlternate?: boolean;
  onTryAlternate?: () => void;
  thumbnailUrl?: string | null;
}

function VideoErrorFallback({
  title,
  message,
  watchUrl,
  courseSlug,
  nextVideo,
  onNext,
  onRetry,
  showTryAlternate,
  onTryAlternate,
  thumbnailUrl,
}: VideoErrorFallbackProps) {
  return (
    <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
      <div className="max-w-md w-full mx-4 text-center">
        {/* Thumbnail if available */}
        {thumbnailUrl && (
          <div className="relative mb-4 rounded-lg overflow-hidden opacity-50">
            <img 
              src={thumbnailUrl} 
              alt="Video thumbnail"
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>
        )}

        {!thumbnailUrl && (
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        )}

        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-400 mb-6 text-sm">{message}</p>

        <div className="flex flex-col gap-2">
          {/* Retry Button */}
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}

          {/* Open on YouTube */}
          {watchUrl && (
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open on YouTube
            </a>
          )}

          {/* Try Alternate Video */}
          {showTryAlternate && onTryAlternate && (
            <button
              onClick={onTryAlternate}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              Try Next Lesson
            </button>
          )}

          {/* Next Lesson Button */}
          {nextVideo && (
            <button
              onClick={onNext}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
              Skip to Next Lesson
            </button>
          )}

          {/* Back to Course */}
          <Link
            href={`/courses/${courseSlug}`}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors text-sm"
          >
            Back to Course
          </Link>
        </div>
      </div>
    </div>
  );
}
