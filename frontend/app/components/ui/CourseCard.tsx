'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, BookOpen, ArrowRight, Star, User } from 'lucide-react';
import ImageWithFallback from '@components/ui/ImageWithFallback';
import { 
  extractVideoIdFromThumbnailUrl, 
  getYouTubeThumbnailFallbacks,
  logBrokenCourse,
  isValidYouTubeUrl 
} from '@lib/youtube';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  category: string;
  difficulty_level: string;
  estimated_hours: number;
  instructor: string | null;
  video_count?: number | null;
  is_featured: boolean | null;
  tags?: string[] | null;
}

interface CourseCardProps {
  course: Course;
  index?: number;
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function CourseCard({ course, index = 0 }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Validate course data in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Check if thumbnail URL is valid
      if (course.thumbnail_url) {
        const videoId = extractVideoIdFromThumbnailUrl(course.thumbnail_url);
        if (!videoId) {
          logBrokenCourse(course.title, 'thumbnail_url', course.thumbnail_url, 'Could not extract video ID from thumbnail URL');
        }
      }
    }
  }, [course]);

  // Get video ID from thumbnail URL for fallback generation
  const thumbnailVideoId = course.thumbnail_url 
    ? extractVideoIdFromThumbnailUrl(course.thumbnail_url) 
    : null;

  // Generate fallback thumbnail URLs
  const fallbackUrls = thumbnailVideoId 
    ? getYouTubeThumbnailFallbacks(thumbnailVideoId).filter(url => url !== course.thumbnail_url)
    : [];

  const formatEstimatedHours = (hours: number) => {
    if (hours >= 40) return `${Math.round(hours / 10)} weeks`;
    return `${hours} hours`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/courses/${course.slug}`}>
        <div 
          className="group rounded-2xl bg-white dark:bg-slate-800 shadow-soft hover:shadow-lg transition-all overflow-hidden h-full flex flex-col"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Thumbnail */}
          <div className="aspect-video bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
            <ImageWithFallback
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              fallbackClassName="w-full h-full"
              fallbackUrls={fallbackUrls}
              showPlaceholder={true}
            />
            
            {/* Featured Badge */}
            {course.is_featured && (
              <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                Featured
              </div>
            )}
            
            {/* Difficulty Badge */}
            <div className="absolute bottom-3 left-3">
              <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${difficultyColors[course.difficulty_level] || 'bg-slate-100 text-slate-800'}`}>
                {course.difficulty_level}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            {/* Category */}
            <div className="mb-2">
              <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                {course.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {course.title}
            </h3>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
              {course.description}
            </p>

            {/* Instructor */}
            {course.instructor && (
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
                <User className="w-4 h-4" />
                {course.instructor}
              </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-700">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatEstimatedHours(course.estimated_hours)}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {course.video_count || 0} videos
              </span>
            </div>

            {/* View Course Link */}
            <div className="mt-4 flex items-center text-primary-600 dark:text-primary-400 font-medium">
              View Course
              <ArrowRight className={`w-4 h-4 ml-1 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
