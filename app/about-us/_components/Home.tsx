import { ArrowRight, Play } from 'lucide-react';
import React from 'react';

export default function Home() {
  return (
    <section className="mb-20 mt-40">
      <div className="max-w-[1212px] mx-auto">
        <div className="flex justify-between items-start">
          {/* Left Column - Main Heading and CTA */}
          <div className="flex flex-col gap-5 w-full max-w-[575px]">
            <h2 className="text-6xl font-semibold font-instrument leading-[120%]">
              Your Partner in Quality Real Estate
            </h2>
            <p className="text-lg leading-[150%] font-instrument text-description">
              We craft quality properties that fit your lifestyle and investment
              goals, with prime locations and lasting value.
            </p>
            <div className="flex gap-5 mt-3">
              <button className="bg-primary w-fit text-white px-9 py-4 rounded-full font-medium transition-colors duration-200">
                Contact Us
              </button>
              <button className="bg-white flex items-center gap-2 w-fit text-primary border-2 px-9 py-4 rounded-full font-medium transition-colors duration-200">
                Register
                <ArrowRight />
              </button>
            </div>
          </div>
          <div className="flex w-full max-w-[530px] bg-[#D9D9D9] h-full aspect-video rounded-lg">
            <div className="flex w-full items-center justify-center">
              <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white transition-transform hover:scale-105 shadow-lg">
                <Play className="ml-0.5 h-8 w-8 fill-[#D9D9D9]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
