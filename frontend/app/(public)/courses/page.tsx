'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, BookOpen, ArrowRight, Search, Filter, X, Star, User } from 'lucide-react';
import { useCourseStore } from '@store/courseStore';
import CourseCard from '@components/ui/CourseCard';

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function CoursesPage() {
  const { 
    subjects, 
    categories, 
    isLoading, 
    filters,
    fetchSubjects, 
    fetchCategories,
    setFilters 
  } = useCourseStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch data on mount only
  useEffect(() => {
    fetchSubjects();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchQuery });
  };

  const handleCategoryChange = (category: string) => {
    setFilters({ 
      ...filters, 
      category: filters.category === category ? undefined : category 
    });
  };

  const handleDifficultyChange = (difficulty: string) => {
    setFilters({ 
      ...filters, 
      difficulty: filters.difficulty === difficulty ? undefined : difficulty 
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({});
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

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Software Engineering Learning Platform
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Master programming, web development, and computer science with comprehensive courses 
            from industry-leading educators like freeCodeCamp and Neso Academy.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses by title, description, or instructor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </form>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
                showFilters 
                  ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              {(filters.category || filters.difficulty) && (
                <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {(filters.category ? 1 : 0) + (filters.difficulty ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">Filter Courses</h3>
                {(filters.category || filters.difficulty || filters.search) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear all
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filters.category === category
                          ? 'bg-primary-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Difficulty Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleDifficultyChange(level)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                        filters.difficulty === level
                          ? 'bg-primary-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Active Filters */}
          {(filters.category || filters.difficulty || filters.search) && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-slate-500 dark:text-slate-400">Active filters:</span>
              {filters.search && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm">
                  Search: {filters.search}
                  <button onClick={() => setFilters({ ...filters, search: undefined })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm">
                  {filters.category}
                  <button onClick={() => setFilters({ ...filters, category: undefined })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.difficulty && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm capitalize">
                  {filters.difficulty}
                  <button onClick={() => setFilters({ ...filters, difficulty: undefined })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-900 dark:text-white">{subjects.length}</span> courses
          </p>
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl bg-slate-100 dark:bg-slate-800 h-96 animate-pulse" />
            ))}
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No courses found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject, index) => (
              <CourseCard key={subject.id} course={subject} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

