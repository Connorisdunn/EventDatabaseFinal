import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  autoRotateInterval?: number; // Time in ms between auto rotations
}

export function ImageCarousel({ 
  images, 
  alt,
  autoRotateInterval = 3000 // Default to 3 seconds
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Preload all images
  useEffect(() => {
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  // If there are no images or only one image, just display it
  if (!images.length) return null;
  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt={alt}
        className="w-full h-96 object-cover rounded-lg shadow-lg"
      />
    );
  }

  const goToNextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    const nextIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000); // This should match the CSS transition duration
  }, [activeIndex, images.length, isTransitioning]);

  const goToPrevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    const prevIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    setActiveIndex(prevIndex);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000); // This should match the CSS transition duration
  }, [activeIndex, images.length, isTransitioning]);

  const goToSlide = (index: number) => {
    if (isTransitioning || index === activeIndex) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  // Handle click events explicitly to prevent propagation issues
  const handlePrevClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    if (!isTransitioning) {
      goToPrevSlide();
    }
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    if (!isTransitioning) {
      goToNextSlide();
    }
  };

  const handlePauseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    togglePause();
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Prevent event bubbling
    if (!isTransitioning && index !== activeIndex) {
      goToSlide(index);
    }
  };

  // Set up auto-rotation
  useEffect(() => {
    if (isPaused || images.length <= 1 || isTransitioning) return;
    
    const intervalId = setInterval(() => {
      goToNextSlide();
    }, autoRotateInterval);
    
    return () => clearInterval(intervalId);
  }, [isPaused, goToNextSlide, images.length, autoRotateInterval, isTransitioning]);

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg group">
      {/* Image container */}
      <div className="relative w-full h-full">
        {images.map((src, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            aria-hidden={index !== activeIndex}
          >
            <img
              src={src}
              alt={`${alt} - image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      {/* Control buttons - now with higher z-index and explicit click handlers */}
      <button
        onClick={handlePrevClick}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors z-30 opacity-0 group-hover:opacity-100"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={handleNextClick}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors z-30 opacity-0 group-hover:opacity-100"
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      {/* Pause/Play button */}
      <button
        onClick={handlePauseClick}
        className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors z-30 opacity-0 group-hover:opacity-100"
        aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
      >
        {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
      </button>
      
      {/* Indicator dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-30">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => handleDotClick(e, index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === activeIndex 
                ? 'bg-white scale-110' 
                : 'bg-white/60 hover:bg-white/80'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}