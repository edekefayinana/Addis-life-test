'use client';
import { ArrowRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import React, { useRef, useState } from 'react';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <section className="mb-10 lg:mb-20 mt-20">
      <div className="max-w-[1212px] mx-auto">
        <div className="flex flex-wrap space-y-7 justify-between items-start">
          {/* Left Column - Main Heading and CTA */}
          <div className="flex flex-col gap-3 md:gap-5 w-full max-w-[575px]">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold font-instrument leading-[120%]">
              Your Partner in Quality Real Estate
            </h2>
            <p className="text-lg leading-[150%] font-instrument text-description">
              We craft quality properties that fit your lifestyle and investment
              goals, with prime locations and lasting value.
            </p>
            <div className="flex gap-3 md:gap-5 mt-3">
              <button className="bg-primary w-fit text-white px-5 py-2 lg:px-9 lg:py-4 rounded-full font-medium transition-colors duration-200">
                <Link href="/contact-us" className="flex items-center gap-2">
                  Contact Us
                </Link>
              </button>
              <button className="bg-white flex items-center gap-2 w-fit text-primary border-2 px-5 py-2 lg:px-9 lg:py-4 rounded-full font-medium transition-colors duration-200">
                <Link href="/signup" className="flex items-center gap-2">
                  Register
                  <ArrowRight />
                </Link>
              </button>
            </div>
          </div>
          <div className="group relative flex w-full lg:max-w-[530px] bg-[#D9D9D9] h-full aspect-video rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src="/video/video.mp4"
              poster="/AU2 site Building Renders/1_9 - Photo.jpg"
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={handleEnded}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
            <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full bg-black/60 px-3 py-2 text-white opacity-0 transition-all group-hover:opacity-100 focus-within:opacity-100">
              <button
                type="button"
                onClick={togglePlayback}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="ml-0.5 h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
