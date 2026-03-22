'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, BookOpen, User, ArrowLeft, Play, Check, Lock, Star } from 'lucide-react';
import { useCourseStore } from '@store/courseStore';
import { useAuthStore } from '@store/authStore';
import ImageWithFallback from '@components/ui/ImageWithFallback';
import { extractVideoIdFromThumbnailUrl, getYouTubeThumbnailFallbacks } from '@lib/youtube';

interface Video {
  id: string;
  title: string;
  description: string | null;
  duration_seconds: number;
  order_index: number;
}

interface Section {
  id: string;
  title: string;
  order_index: number;
  videos: Video[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const { user, isAuthenticated } = useAuthStore();
  const { 
    currentSubject, 
    isEnrolled, 
    isLoading, 
    error, 
    fetchSubjectTree, 
    enroll,
    clearCurrentSubject 
  } = useCourseStore();

  const [enrolling, setEnrolling] = useState(false);

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

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (!currentSubject) return;
    
    setEnrolling(true);
    try {
      await enroll(currentSubject.id);
    } catch (error) {
      console.error('Enrollment failed:', error);
    } finally {
      setEnrolling(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatEstimatedHours = (hours: number) => {
    if (hours >= 40) return `${Math.round(hours / 10)} weeks`;
    return `${hours} hours`;
  };

  const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-8" />
            <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl mb-8" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentSubject) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Course Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {error || 'The course you are looking for does not exist.'}
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const firstVideo = currentSubject.sections?.[0]?.videos?.[0];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>

        {/* Course Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                  {currentSubject.category}
                </span>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${difficultyColors[currentSubject.difficulty_level]}`}>
                  {currentSubject.difficulty_level}
                </span>
                {currentSubject.is_featured && (
                  <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {currentSubject.title}
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                {currentSubject.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400 mb-6">
                {currentSubject.instructor && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{currentSubject.instructor}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatEstimatedHours(currentSubject.estimated_hours)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{currentSubject.video_count || 0} videos</span>
                </div>
              </div>

              {currentSubject.tags && currentSubject.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentSubject.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Enrollment Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:sticky lg:top-8 h-fit"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-video bg-slate-100 dark:bg-slate-700 relative">
                <ImageWithFallback
                  src={currentSubject.thumbnail_url}
                  alt={currentSubject.title}
                  className="w-full h-full object-cover"
                  fallbackClassName="w-full h-full"
                  fallbackUrls={
                    currentSubject.thumbnail_url
                      ? getYouTubeThumbnailFallbacks(extractVideoIdFromThumbnailUrl(currentSubject.thumbnail_url))
                      : []
                  }
                  showPlaceholder={true}
                />
                {isEnrolled && firstVideo && (
                  <Link
                    href={`/learn/${currentSubject.slug}/${firstVideo.id}`}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-8 h-8 text-slate-900 ml-1" />
                    </div>
                  </Link>
                )}
              </div>
              
              <div className="p-6">
                {isEnrolled ? (
                  <>
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Enrolled</span>
                    </div>
                    <Link
                      href={firstVideo ? `/learn/${currentSubject.slug}/${firstVideo.id}` : '#'}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-colors font-medium"
                    >
                      <Play className="w-5 h-5" />
                      Continue Learning
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {isAuthenticated ? 'Start learning today!' : 'Sign in to enroll'}
                      </p>
                    </div>
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling || !isAuthenticated}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrolling ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Enroll Now
                          <BookOpen className="w-5 h-5" />
                        </>
                      )}
                    </button>
                    {!isAuthenticated && (
                      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-2">
                        <Link href="/login" className="text-primary-600 dark:text-primary-400 hover:underline">
                          Sign in
                        </Link>
                        {' '}to enroll in this course
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Course Content */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Course Content
          </h2>
          
          <div className="space-y-4">
            {currentSubject.sections?.map((section: Section, sectionIndex: number) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + sectionIndex * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden"
              >
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {section.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {section.videos?.length || 0} lessons
                  </p>
                </div>
                
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {section.videos?.map((video: Video, videoIndex: number) => {
                    const isLocked = !isEnrolled && videoIndex > 0;
                    
                    return (
                      <div
                        key={video.id}
                        className={`flex items-center gap-4 p-4 ${
                          isLocked 
                            ? 'opacity-50' 
                            : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                          {isLocked ? (
                            <Lock className="w-4 h-4 text-slate-400" />
                          ) : (
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                              {videoIndex + 1}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-900 dark:text-white truncate">
                            {video.title}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                            {video.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          {formatDuration(video.duration_seconds)}
                        </div>
                        
                        {!isLocked && isEnrolled && (
                          <Link
                            href={`/learn/${currentSubject.slug}/${video.id}`}
                            className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                          >
                            <Play className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
