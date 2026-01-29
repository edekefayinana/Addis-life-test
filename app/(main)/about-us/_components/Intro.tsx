import React from 'react';
import Image from 'next/image';

export default function Intro() {
  return (
    <section className="w-full max-w-[1212px] mt-10 mb-5 mx-auto h-[600px] bg-[#D9D9D9] rounded-3xl overflow-hidden relative">
      <Image
        src="/dev-image.png"
        alt="Addis Life team and properties overview"
        fill
        priority
        className="object-cover"
      />
    </section>
  );
}
