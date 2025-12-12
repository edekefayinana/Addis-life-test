'use client';

import { Plus } from 'lucide-react';
import React, { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: 'What services do you provide?',
    answer:
      'We offer a comprehensive range of real estate services including property sales, rentals, property management, investment consulting, and market analysis. Our team is dedicated to helping you find the perfect property that meets your needs and budget.',
  },
  {
    question: 'Where are your projects located?',
    answer:
      'Our projects are strategically located across prime areas in Addis Ababa, including Bole, Kazanchis, CMC, and other developing neighborhoods. We carefully select locations that offer excellent connectivity, amenities, and growth potential.',
  },
  {
    question: 'How can I get updates about ongoing projects?',
    answer:
      'You can stay updated about our ongoing projects by subscribing to our newsletter, following us on social media, or contacting our sales team directly. We regularly share project updates, new launches, and exclusive offers with our subscribers.',
  },
  {
    question: 'How do I purchase a property?',
    answer:
      'The property purchase process is simple: First, browse our available properties and schedule a viewing. Once you find your ideal property, our team will guide you through the documentation, payment plans, and legal procedures to ensure a smooth transaction.',
  },
  {
    question: 'Do you offer flexible payment plans?',
    answer:
      'Yes, we offer flexible payment plans tailored to your financial situation. Our options include installment plans, mortgage assistance, and customized payment schedules. Contact our sales team to discuss the best payment plan for your needs.',
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-[#F6F8FA] my-4 rounded-3xl">
      <div className="max-w-[1212px] mx-auto">
        <div className="flex justify-between gap-12 lg:gap-16">
          {/* Left Column - Title and Description */}
          <div className="w-full max-w-[457px] space-y-6">
            <h2 className="text-4xl md:text-5xl font-semibold font-instrument leading-tight">
              Frequently Asked
              <br />
              Questions
            </h2>
            <p className="text-description text-lg leading-[150%] font-normal tracking-normal">
              We provide thorough explanations to your most frequent questions,
              ensuring transparency and peace of mind throughout your property
              experience.
            </p>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="space-y-5 w-full max-w-[693px]">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="bg-white hover:bg-primary/5 rounded-3xl px-3 min-h-20 overflow-hidden transition-all duration-300"
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer transition-colors duration-200"
                  aria-expanded={openIndex === index}
                >
                  <span className="font-medium text-xl">{faq.question}</span>
                  <div
                    className={`flex-shrink-0 size-8 flex items-center justify-center transition-transform duration-300 ${
                      openIndex === index ? 'rotate-45' : 'rotate-0'
                    }`}
                  >
                    <Plus className="size-8" />
                  </div>
                </button>

                {/* Answer Content */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openIndex === index
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-description text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
