'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    quote:
      'I appreciated their transparency and consistent communication. Each step was clearly explained, and the quality of their service made the entire experience smooth and reassuring.',
    name: 'Solomon Mulugeta',
    role: 'Client',
  },
  {
    quote:
      'From the first walkthrough to the final handover, the Addis Life team was attentive, honest, and on schedule. They made buying my home effortless.',
    name: 'Liya Tesfaye',
    role: 'Homeowner',
  },
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const fadeTimeout = useRef<NodeJS.Timeout | null>(null);
  const activeTestimonial = useMemo(
    () => testimonials[activeIndex],
    [activeIndex]
  );

  const changeTestimonial = (direction: 'prev' | 'next') => {
    if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    setIsFading(true);

    fadeTimeout.current = setTimeout(() => {
      setActiveIndex((prev) => {
        if (direction === 'prev') {
          return prev === 0 ? testimonials.length - 1 : prev - 1;
        }
        return prev === testimonials.length - 1 ? 0 : prev + 1;
      });
      setIsFading(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    };
  }, []);

  return (
    <section className="w-full bg-[var(--testimonial-bg)] py-14 md:py-20 rounded-lg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-4xl font-semibold text-black font-instrument">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto font-instrument">
            Addis Life Real Estate takes pride in delivering dependable homes
            and a smooth buying experience. Here&apos;s what our customers are
            saying.
          </p>
        </div>

        <div className="mx-auto py-8 flex flex-col gap-8 md:flex-row md:items-stretch md:gap-15">
          {/* Video Thumbnail */}
          <div className="relative w-full md:w-[48%] aspect-video rounded-lg overflow-hidden">
            <Image
              src="/teste-image.png"
              alt="Client Video Testimonial"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--testimonial-overlay)] transition-colors hover:bg-[var(--testimonial-overlay-hover)]">
              <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white transition-transform hover:scale-105 shadow-lg">
                <Play className="ml-0.5 h-8 w-8 text-[var(--testimonial-play-fill)] fill-[var(--testimonial-play-fill)]" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-8 flex flex-col">
            <Quote className="h-12 w-12 text-[var(--testimonial-icon)]" />

            <div className="flex-1 flex">
              <blockquote
                className={`text-xl md:text-2xl leading-relaxed text-[var(--testimonial-text)] transition-opacity duration-300 ${
                  isFading ? 'opacity-0' : 'opacity-100'
                }`}
                style={{ minHeight: '150px' }}
              >
                &ldquo;{activeTestimonial.quote}&rdquo;
              </blockquote>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src="/testem-profile.png"
                    alt={activeTestimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-[var(--testimonial-text)]">
                    {activeTestimonial.name}
                  </p>
                  <p className="text-sm text-[var(--testimonial-muted)]">
                    {activeTestimonial.role}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => changeTestimonial('prev')}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--testimonial-border)] bg-white transition-colors hover:bg-[var(--testimonial-bg-hover)] hover:border-[var(--testimonial-border-hover)]"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5 text-[var(--testimonial-play-fill)]" />
                </button>
                <button
                  onClick={() => changeTestimonial('next')}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--testimonial-border)] bg-white transition-colors hover:bg-[var(--testimonial-bg-hover)] hover:border-[var(--testimonial-border-hover)]"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5 text-[var(--testimonial-play-fill)]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
