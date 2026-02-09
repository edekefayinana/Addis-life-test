'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { HeroSlide } from '@/data/heroSlides';
import { HeroSearch } from './HeroSearch';

const announcementConfigs = {
  discount: {
    badge: 'Limited offer',
    badgeClass: 'border-amber-200/60 bg-amber-200/15 text-amber-100',
    ctaClass: 'bg-emerald-400 text-slate-950 hover:bg-emerald-300',
    textAlignClass: 'items-start text-left',
  },
  launch: {
    badge: 'New launch',
    badgeClass: 'border-cyan-200/60 bg-cyan-200/15 text-cyan-100',
    ctaClass: 'bg-emerald-400 text-slate-950 hover:bg-emerald-300',
    textAlignClass: 'items-center text-center',
  },
  event: {
    badge: 'Open house',
    badgeClass: 'border-rose-200/60 bg-rose-200/15 text-rose-100',
    ctaClass: 'bg-emerald-400 text-slate-950 hover:bg-emerald-300',
    textAlignClass: 'items-end text-right',
  },
  news: {
    badge: 'Verified update',
    badgeClass: 'border-emerald-200/60 bg-emerald-200/15 text-emerald-100',
    ctaClass: 'bg-emerald-400 text-slate-950 hover:bg-emerald-300',
    textAlignClass: 'items-center text-center',
  },
} as const;

type HeroProps = {
  slides: HeroSlide[];
};

export function Hero({ slides }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);
  const pointerStartX = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressFrameRef = useRef<number | null>(null);
  const totalSlides = slides.length;
  const autoPlayMs = 10000;

  const handleNext = useCallback(() => {
    if (totalSlides === 0) {
      return;
    }
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    if (totalSlides === 0) {
      return;
    }
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

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
    if (!isAutoPlay || totalSlides <= 1) {
      return;
    }
    const intervalId = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, autoPlayMs);
    return () => clearInterval(intervalId);
  }, [autoPlayMs, isAutoPlay, totalSlides]);

  useEffect(() => {
    if (progressFrameRef.current) {
      cancelAnimationFrame(progressFrameRef.current);
    }
    if (!isAutoPlay) {
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
  const isVideoSlide = activeSlide?.type === 'video';
  const announcementType =
    activeSlide?.type === 'image' ? activeSlide.announcementType : undefined;
  const announcementConfig = announcementType
    ? announcementConfigs[announcementType]
    : undefined;
  const textAlignClass =
    announcementConfig?.textAlignClass ?? 'items-center text-center';
  const isLeftAligned = textAlignClass.includes('items-start');
  const isRightAligned = textAlignClass.includes('items-end');
  const justifyClass = isLeftAligned
    ? 'justify-start'
    : isRightAligned
      ? 'justify-end'
      : 'justify-center';
  const cta = activeSlide?.type === 'image' ? activeSlide.cta : undefined;
  const highlights = activeSlide?.highlights ?? [];

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
                unoptimized={slide.src.startsWith('https://images.prismic.io')}
              />
            )}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-900/20 via-slate-950/60 to-slate-950/85" />
      <div className="absolute -left-24 top-16 -z-10 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
      <div className="absolute -right-10 bottom-6 -z-10 h-96 w-96 rounded-full bg-emerald-400/15 blur-3xl" />

      {isVideoSlide ? (
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-32 pt-24 text-center">
          {activeSlide?.eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
              {activeSlide.eyebrow}
            </span>
          )}
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl md:text-7xl font-instrument">
            {activeSlide?.headline}
          </h1>
          <p className="mt-4 text-base font-normal text-slate-200/90 sm:text-lg font-instrument">
            {activeSlide?.subhead}
          </p>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-7xl flex-col px-6 pb-32 pt-24">
          <div className={`flex w-full ${justifyClass}`}>
            <div
              className={`relative w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-10 ${textAlignClass}`}
            >
              <div
                className={`flex flex-wrap items-center gap-3 ${justifyClass}`}
              >
                {activeSlide?.eyebrow && (
                  <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                    {activeSlide.eyebrow}
                  </span>
                )}
                {announcementConfig && (
                  <span
                    className={`inline-flex items-center rounded-full border px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${announcementConfig.badgeClass}`}
                  >
                    {announcementConfig.badge}
                  </span>
                )}
              </div>
              <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl md:text-7xl font-instrument">
                {activeSlide?.headline}
              </h1>
              <p className="mt-5 text-lg font-normal text-slate-200/90 sm:text-xl font-instrument">
                {activeSlide?.subhead}
              </p>
              {highlights.length > 0 && (
                <div
                  className={`mt-6 flex flex-wrap gap-4 ${justifyClass}`}
                  data-hero-interactive="true"
                >
                  {highlights.map((item) => (
                    <div
                      key={`${item.label}-${item.value}`}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left"
                    >
                      <div className="text-lg font-semibold text-white">
                        {item.value}
                      </div>
                      <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {cta && (
                <div className={`mt-8 flex ${justifyClass}`}>
                  <Link
                    href={cta.href}
                    className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${
                      announcementConfig?.ctaClass ??
                      'bg-white text-slate-900 hover:bg-white/90'
                    }`}
                    data-hero-interactive="true"
                  >
                    {cta.label}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div
        className="absolute inset-x-0 bottom-35 z-10 flex justify-center gap-2 px-6"
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
