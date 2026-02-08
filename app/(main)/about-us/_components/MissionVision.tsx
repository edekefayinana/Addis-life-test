import Link from 'next/link';
import React from 'react';

export default function MissionVision() {
  return (
    <section className="py-10 lg:py-20">
      <div className="max-w-[1212px] mx-auto">
        <div className="flex flex-wrap space-y-9 justify-between items-start">
          {/* Left Column - Main Heading and CTA */}
          <div className="flex flex-col gap-3 lg:gap-5 w-full max-w-[537px]">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-instrument font-semibold leading-[120%]">
              Designing Spaces with Purpose
            </h2>
            <p className="text-base lg:text-lg leading-[150%] font-instrument text-description">
              Guiding every project with purpose, we aim to create exceptional
              spaces that enrich lives, deliver lasting value, and shape the
              future of real estate.
            </p>
            <button className="bg-primary mt-3 lg:mt-5 w-fit text-white px-5 py-3 lg:px-9 lg:py-4 rounded-full font-medium transition-colors duration-200">
              <Link href="/contact-us" className="flex items-center gap-2">
                Work With Us
              </Link>
            </button>
          </div>

          {/* Right Column - Mission and Vision */}
          <div className="relative flex flex-col gap-12 w-full max-w-[574px]">
            {/* Our Mission */}
            <span className="absolute w-0.5 top-7 left-3 lg:left-1.5 bg-amber-100 h-1/2" />
            <div className="flex gap-4">
              <div className="flex flex-col gap-3 lg:gap-6">
                <div className="flex items-center gap-9 lg:gap-10">
                  <span className="size-4 ml-1.5 lg:ml-0 rounded-full bg-[#FEAE01]"></span>
                  <h3 className="text-2xl font-semibold font-instrument">
                    Our Mission
                  </h3>
                </div>
                <p className="text-base lg:text-lg ml-[58.5px] leading-[165%] font-instrument text-description">
                  Our mission is to provide trusted real estate services through
                  transparent processes and expert guidance, ensuring every
                  client feels confident and informed. We strive to exceed
                  expectations with reliable property options and dedicated
                  support that help people invest with clarity and peace of
                  mind.
                </p>
              </div>
            </div>

            {/* Our Vision */}
            <div className="flex gap-4">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-9 lg:gap-10">
                  <span className="size-4 ml-1.5 lg:ml-0 rounded-full bg-[#FEAE01]"></span>
                  <h3 className="text-2xl font-semibold font-instrument">
                    Our Vision
                  </h3>
                </div>
                <p className="text-base lg:text-lg ml-[58.5px] leading-[165%] font-instrument text-description">
                  Our goals are to build trusted client relationships through
                  responsible service and clear communication. We continually
                  improve by developing our team and using modern technology.
                  Our long-term aim is to be the top choice in Addis Ababa with
                  a unique, personalized property experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
