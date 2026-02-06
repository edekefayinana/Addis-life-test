'use client';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { heroSlides } from '@/data/heroSlides';
import { HeroSearch } from './HeroSearch';

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);
  const pointerStartX = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressFrameRef = useRef<number | null>(null);
  const slides = heroSlides;
  const autoPlayMs = 10000;

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const pauseAutoPlay = useCallback(() => {
    setIsAutoPlay(false);
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoPlay(true);
    }, 10000);
  }, []);

  useEffect(() => {
    if (!isAutoPlay || slides.length <= 1) {
      return;
    }
    const intervalId = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, autoPlayMs);
    return () => clearInterval(intervalId);
  }, [autoPlayMs, isAutoPlay, slides.length]);

  useEffect(() => {
    if (progressFrameRef.current) {
      cancelAnimationFrame(progressFrameRef.current);
    }
    if (!isAutoPlay) {
      // setProgress(0);
      return;
    }

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const nextProgress = Math.min(elapsed / autoPlayMs, 1);
      setProgress(nextProgress);
      if (nextProgress < 1) {
        progressFrameRef.current = requestAnimationFrame(tick);
      }
    };

    progressFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (progressFrameRef.current) {
        cancelAnimationFrame(progressFrameRef.current);
      }
    };
  }, [activeIndex, autoPlayMs, isAutoPlay]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-hero-interactive="true"]')) {
      return;
    }
    pointerStartX.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (pointerStartX.current === null) {
      return;
    }
    const deltaX = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(deltaX) < 50) {
      return;
    }
    pauseAutoPlay();
    if (deltaX < 0) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  const handlePointerCancel = () => {
    pointerStartX.current = null;
  };

  const activeSlide = slides[activeIndex];

  return (
    <section
      className="relative isolate flex min-h-[98vh] w-full flex-col justify-center overflow-hidden rounded-2xl p-4 text-white"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <div className="absolute inset-0 -z-20">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={index !== activeIndex}
          >
            {slide.type === 'video' ? (
              <video
                className="h-full w-full object-cover"
                src={slide.src}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
              />
            ) : (
              <Image
                src={slide.src}
                alt=""
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
              />
            )}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 -z-10 bg-black/45" />
      <div className="absolute inset-0 -z-10" />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-6 pb-32 text-center">
        <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl font-instrument">
          {activeSlide?.headline}
        </h1>
        <p className="max-w-2xl text-lg font-normal text-slate-200/90 sm:text-xl font-instrument">
          {activeSlide?.subhead}
        </p>
      </div>

      <div
        className="absolute inset-x-0 bottom-40 z-10 flex justify-center gap-2 px-6"
        data-hero-interactive="true"
      >
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => {
              pauseAutoPlay();
              setActiveIndex(index);
            }}
            className="relative h-1 w-8 overflow-hidden rounded-full bg-white/40 transition hover:bg-white/60"
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === activeIndex && (
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-white"
                style={{ width: `${progress * 100}%` }}
              />
            )}
          </button>
        ))}
      </div>

      <div
        className="absolute inset-x-0 bottom-12 z-10 flex justify-center px-6"
        data-hero-interactive="true"
      >
        <HeroSearch />
      </div>
    </section>
  );
}
