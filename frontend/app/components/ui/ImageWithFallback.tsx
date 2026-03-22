'use client';

import { useState, useCallback, useEffect } from 'react';
import { BookOpen } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  fallbackUrls?: string[];
  showPlaceholder?: boolean;
  onAllFailed?: () => void;
}

/**
 * Image component with automatic fallback support
 * Tries multiple URLs in sequence until one succeeds
 */
export default function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackClassName = '',
  fallbackUrls = [],
  showPlaceholder = true,
  onAllFailed,
}: ImageWithFallbackProps) {
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Build the list of URLs to try
  const allUrls = [src, ...fallbackUrls].filter(Boolean) as string[];
  const currentSrc = allUrls[currentSrcIndex] || null;

  // Reset state when src changes
  useEffect(() => {
    setCurrentSrcIndex(0);
    setHasError(false);
    setIsLoading(true);
  }, [src, fallbackUrls?.length]);

  const handleError = useCallback(() => {
    // Try next URL in the fallback list
    if (currentSrcIndex < allUrls.length - 1) {
      setCurrentSrcIndex(prev => prev + 1);
    } else {
      // All URLs failed
      setHasError(true);
      setIsLoading(false);
      onAllFailed?.();
      
      if (process.env.NODE_ENV === 'development') {
        console.warn('[ImageWithFallback] All image URLs failed:', { src, fallbackUrls });
      }
    }
  }, [currentSrcIndex, allUrls.length, src, fallbackUrls, onAllFailed]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  // Show placeholder if no valid source or all failed
  if (!currentSrc || hasError) {
    if (!showPlaceholder) return null;
    
    return (
      <div className={`${fallbackClassName} flex items-center justify-center bg-gradient-to-br from-primary-100 to-success-100 dark:from-primary-900/30 dark:to-success-900/30`}>
        <BookOpen className="w-16 h-16 text-primary-500 dark:text-primary-400" />
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`${className} absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-700`}>
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </>
  );
}
