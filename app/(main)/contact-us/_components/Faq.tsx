'use client';

import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

interface FaqItem {
  questionKey: string;
  answerKey: string;
}

const faqKeys: FaqItem[] = [
  {
    questionKey: 'services.question',
    answerKey: 'services.answer',
  },
  {
    questionKey: 'location.question',
    answerKey: 'location.answer',
  },
  {
    questionKey: 'updates.question',
    answerKey: 'updates.answer',
  },
  {
    questionKey: 'purchase.question',
    answerKey: 'purchase.answer',
  },
  {
    questionKey: 'payment.question',
    answerKey: 'payment.answer',
  },
];

export default function Faq() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-10 md:py-14 lg:py-24 mx-4 px-4 lg:px-0 bg-[#F6F8FA] my-4 rounded-3xl">
      <div className="max-w-[1212px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-16">
          {/* Left Column - Title and Description */}
          <div className="w-full max-w-[457px] space-y-4 md:space-y-6">
            <h2 className="text-3xl md:text-5xl font-semibold font-instrument leading-tight">
              {t('title')}
            </h2>
            <p className="text-description text-base lg:text-lg leading-[150%] font-normal tracking-normal">
              {t('subtitle')}
            </p>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="space-y-5 w-full max-w-[693px]">
            {faqKeys.map((faq, index) => (
              <div
                key={index}
                className="bg-white hover:bg-primary/5 rounded-xl md:rounded-3xl px-3 min-h-20 overflow-hidden transition-all duration-300"
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-3 md:p-6 text-left cursor-pointer transition-colors duration-200"
                  aria-expanded={openIndex === index}
                >
                  <span className="font-medium text-lg md:text-xl">
                    {t(`questions.${faq.questionKey}`)}
                  </span>
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
                      {t(`questions.${faq.answerKey}`)}
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
