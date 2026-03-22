'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Brain, Trophy, Zap, ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-success-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Learning Experience
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight"
            >
              Master New Skills with{' '}
              <span className="bg-gradient-to-r from-primary-600 to-success-500 bg-clip-text text-transparent">
                AI-Powered
              </span>{' '}
              Learning
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10"
            >
              Experience a new way of learning with personalized AI assistance, 
              gamified progress tracking, and interactive courses designed for the modern learner.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-glow"
              >
                Explore Courses
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-xl font-semibold hover:border-primary-500 dark:hover:border-primary-500 transition-all"
              >
                Get Started Free
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need to Learn
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              A complete learning platform designed for your success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Structured Courses',
                description: 'Well-organized learning paths with progressive difficulty levels',
                color: 'primary',
              },
              {
                icon: Brain,
                title: 'AI Assistant',
                description: 'Get instant help, summaries, and explanations from our AI tutor',
                color: 'success',
              },
              {
                icon: Trophy,
                title: 'Gamification',
                description: 'Earn XP, unlock achievements, and track your learning streak',
                color: 'warning',
              },
              {
                icon: Zap,
                title: 'Progress Tracking',
                description: 'Visual learning journey with completion tracking and analytics',
                color: 'error',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:shadow-soft transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900/30 flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-primary-600 to-success-500 p-12 md:p-16 text-center overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of learners who are already mastering new skills with our platform.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-slate-100 transition-all hover:scale-105"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
          </div>
        </div>
      </section>
    </div>
  );
}
