'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  ChevronRight, 
  ChevronDown,
  Check,
  Play,
  Lock
} from 'lucide-react';
import { useCourseStore } from '@store/courseStore';
import { useAuthStore } from '@store/authStore';
import { useProgressStore } from '@store/progressStore';
import VideoPlayer from '@components/player/VideoPlayer';
import { extractYouTubeVideoId } from '@lib/youtube';

interface Video {
  id: string;
  title: string;
  description: string | null;
  youtube_video_id: string;
  duration_seconds: number;
  order_index: number;
}

interface Section {
  id: string;
  title: string;
  order_index: number;
  videos: Video[];
}

export default function VideoPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const videoId = params.videoId as string;
  
  const { isAuthenticated } = useAuthStore();
  const { 
    currentSubject, 
    currentVideo,
    nextVideo,
    prevVideo,
    fetchSubjectTree,
    fetchVideo,
    clearCurrentSubject,
    isLoading 
  } = useCourseStore();
  const { 
    videoProgress, 
    fetchVideoProgress, 
    updateVideoProgress 
  } = useProgressStore();

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Fetch subject tree on mount - only when slug changes
  useEffect(() => {
    if (slug) {
      fetchSubjectTree(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearCurrentSubject();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch video when videoId changes
  useEffect(() => {
    if (videoId) {
      fetchVideo(videoId);
      if (isAuthenticated) {
        fetchVideoProgress(videoId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, isAuthenticated]);

  // Expand section containing current video
  useEffect(() => {
    if (currentSubject?.sections && currentVideo) {
      const expanded = new Set<string>();
      currentSubject.sections.forEach((section: Section) => {
        const hasCurrentVideo = section.videos?.some((v: Video) => v.id === videoId);
        if (hasCurrentVideo) {
          expanded.add(section.id);
        }
      });
      setExpandedSections(expanded);
    }
  }, [currentSubject, currentVideo, videoId]);

  // Get all videos flattened for fallback navigation
  const allVideos = useMemo(() => {
    if (!currentSubject?.sections) return [];
    return currentSubject.sections.flatMap((section: Section) => section.videos || []);
  }, [currentSubject]);

  // Get current video index
  const currentVideoIndex = useMemo(() => {
    return allVideos.findIndex((v: Video) => v.id === videoId);
  }, [allVideos, videoId]);

  // Get initial progress
  const initialProgress = useMemo(() => {
    const progress = videoProgress.get(videoId);
    return progress?.last_position_seconds || 0;
  }, [videoProgress, videoId]);

  const handleVideoComplete = () => {
    if (isAuthenticated && videoId) {
      updateVideoProgress(videoId, {
        lastPositionSeconds: currentVideo?.duration_seconds || 0,
        isCompleted: true
      });
    }
    
    // Auto-play next video if available
    if (nextVideo) {
      router.push(`/learn/${slug}/${nextVideo.id}`);
    }
  };

  const handleProgressUpdate = (seconds: number) => {
    if (isAuthenticated && videoId) {
      updateVideoProgress(videoId, {
        lastPositionSeconds: Math.floor(seconds),
        isCompleted: false
      });
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Please Sign In
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            You need to be signed in to access this course.
          </p>
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !currentSubject) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4" />
            <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-xl mb-4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Video Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            The video you are looking for does not exist.
          </p>
          <Link
            href={`/courses/${slug}`}
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col lg:flex-row">
        {/* Video Player Area */}
        <div className="flex-1 p-4 lg:p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
            <Link href="/courses" className="hover:text-slate-900 dark:hover:text-white">
              Courses
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link 
              href={`/courses/${currentSubject.slug}`} 
              className="hover:text-slate-900 dark:hover:text-white"
            >
              {currentSubject.title}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 dark:text-white truncate max-w-[200px]">
              {currentVideo.title}
            </span>
          </div>

          {/* Video Player with Error Handling */}
          <div className="mb-4">
            <VideoPlayer
              video={currentVideo}
              courseSlug={slug}
              courseId={currentSubject.id}
              courseTitle={currentSubject.title}
              nextVideo={nextVideo}
              prevVideo={prevVideo}
              allVideos={allVideos}
              currentVideoIndex={currentVideoIndex}
              onVideoComplete={handleVideoComplete}
              onProgressUpdate={handleProgressUpdate}
              initialProgress={initialProgress}
            />
          </div>

          {/* Video Info */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-4">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {currentVideo.title}
            </h1>
            {currentVideo.description && (
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {currentVideo.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDuration(currentVideo.duration_seconds)}
              </span>
              {(() => {
                const progress = videoProgress.get(videoId);
                return progress?.is_completed ? (
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <Check className="w-4 h-4" />
                    Completed
                  </span>
                ) : null;
              })()}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {prevVideo ? (
              <Link
                href={`/learn/${slug}/${prevVideo.id}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous Lesson
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            
            {nextVideo ? (
              <Link
                href={`/learn/${slug}/${nextVideo.id}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                Next Lesson
                <ChevronRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href={`/courses/${slug}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                <Check className="w-5 h-5" />
                Course Complete!
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar - Course Content */}
        <div className="w-full lg:w-80 xl:w-96 bg-white dark:bg-slate-800 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Course Content
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {currentSubject.sections?.length || 0} sections • {currentSubject.video_count || 0} lessons
            </p>
          </div>
          
          <div className="overflow-y-auto max-h-[calc(100vh-120px)]">
            {currentSubject.sections?.map((section: Section) => {
              const isExpanded = expandedSections.has(section.id);
              
              return (
                <div key={section.id} className="border-b border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <ChevronDown 
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        isExpanded ? '' : '-rotate-90'
                      }`} 
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 dark:text-white truncate">
                        {section.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {section.videos?.length || 0} lessons
                      </p>
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="pb-2">
                      {section.videos?.map((video: Video, index: number) => {
                        const isCurrentVideo = video.id === videoId;
                        const progress = videoProgress.get(video.id);
                        const isCompleted = progress?.is_completed || false;
                        const hasValidVideo = extractYouTubeVideoId(video.youtube_video_id) !== null;
                        
                        return (
                          <Link
                            key={video.id}
                            href={`/learn/${slug}/${video.id}`}
                            className={`flex items-center gap-3 px-4 py-3 ${
                              isCurrentVideo 
                                ? 'bg-primary-50 dark:bg-primary-900/20 border-l-2 border-primary-500' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                            } ${!hasValidVideo ? 'opacity-50' : ''}`}
                          >
                            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              ) : isCurrentVideo ? (
                                <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                                  <Play className="w-3 h-3 text-white" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
                                  <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {index + 1}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate ${
                                isCurrentVideo 
                                  ? 'font-medium text-primary-700 dark:text-primary-400' 
                                  : 'text-slate-700 dark:text-slate-300'
                              }`}>
                                {video.title}
                              </p>
                              {!hasValidVideo && (
                                <p className="text-xs text-red-500">Unavailable</p>
                              )}
                            </div>
                            
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {formatDuration(video.duration_seconds)}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
