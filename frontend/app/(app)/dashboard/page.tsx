'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Flame, Clock, Play, ArrowRight, Star, TrendingUp } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { useGamificationStore } from '@store/gamificationStore';
import { useCourseStore } from '@store/courseStore';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { xp, streak, fetchProfile } = useGamificationStore();
  const { 
    featuredSubjects, 
    enrolledWithProgress, 
    continueLearning,
    fetchFeatured, 
    fetchEnrolledWithProgress,
    fetchContinueLearning 
  } = useCourseStore();

  // Fetch data on mount only
  useEffect(() => {
    fetchProfile();
    fetchFeatured();
    fetchEnrolledWithProgress();
    fetchContinueLearning(4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatEstimatedHours = (hours: number) => {
    if (hours >= 40) return `${Math.round(hours / 10)} weeks`;
    return `${hours}h`;
  };

  const calculateProgress = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0] || 'Learner'}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Continue your learning journey today
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-soft"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">Level</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {xp?.current_level || 1}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {xp?.level_title || 'Beginner'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-soft"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-success-600" />
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">XP</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {xp?.total_xp || 0}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total earned</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-soft"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center">
                <Flame className="w-5 h-5 text-warning-600" />
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">Streak</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {streak?.current_streak || 0}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Days</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-soft"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-error-100 dark:bg-error-900/30 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-error-600" />
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">Courses</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {enrolledWithProgress.length}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Enrolled</p>
          </motion.div>
        </div>

        {/* Continue Learning */}
        {continueLearning.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary-500" />
                Continue Learning
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {continueLearning.map((course, index) => (
                <Link key={course.id} href={`/learn/${course.slug}/${course.last_video_id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="group p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-soft hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="aspect-video rounded-xl bg-slate-100 dark:bg-slate-700 mb-3 overflow-hidden relative">
                      {course.thumbnail_url ? (
                        <img 
                          src={course.thumbnail_url} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="w-6 h-6 text-slate-900 ml-1" />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                      {course.last_video_title}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* My Courses */}
        {enrolledWithProgress.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                My Courses
              </h2>
              <Link
                href="/my-courses"
                className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledWithProgress.slice(0, 3).map((course, index) => {
                const progress = calculateProgress(course.completed_videos, course.total_videos);
                return (
                  <Link key={course.id} href={`/courses/${course.slug}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="group p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-soft hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                          {course.thumbnail_url ? (
                            <img 
                              src={course.thumbnail_url} 
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {course.total_videos} videos • {formatEstimatedHours(course.estimated_hours)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-500 dark:text-slate-400">Progress</span>
                          <span className="font-medium text-slate-900 dark:text-white">{progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {course.completed_videos} of {course.total_videos} videos completed
                      </p>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Featured Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Featured Courses
            </h2>
            <Link
              href="/courses"
              className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSubjects.slice(0, 3).map((subject, index) => (
              <Link key={subject.id} href={`/courses/${subject.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="group rounded-2xl bg-white dark:bg-slate-800 shadow-soft hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="aspect-video bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
                    {subject.thumbnail_url ? (
                      <img
                        src={subject.thumbnail_url}
                        alt={subject.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-success-100 dark:from-primary-900/30 dark:to-success-900/30">
                        <BookOpen className="w-12 h-12 text-primary-500" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                        {subject.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {subject.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <span>{formatEstimatedHours(subject.estimated_hours)}</span>
                      <span>{subject.video_count || 0} videos</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
