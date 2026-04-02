'use client';
import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function ContactAddresses() {
  const t = useTranslations('contact.addresses');
  return (
    <section className=" mx-auto py-5 lg:py-16 max-w-[1212px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Email Support Card */}
        <Card className="border bg-[#F6F8FA] space-y-3 py-5 px-8 shadow-none hover:shadow-md">
          <div className=" inline-flex rounded-lg mb-4 bg-white border drop-shadow-sm p-3">
            <Mail className="h-6 w-6" />
          </div>
          <h3 className=" text-lg font-semibold ">{t('emailSupport')}</h3>
          <p className="text-base text-description">{t('emailDescription')}</p>
          <Link
            href="mailto:info@addisliferealestate.com"
            className="text-lg font-medium mt-2"
          >
            <span className="text-blue-600">info@addisliferealestate.com</span>
          </Link>
        </Card>

        {/* Visit Our Office Card */}
        <Card className="border bg-[#F6F8FA] space-y-3 py-5 px-8 shadow-none hover:shadow-md">
          <div className=" inline-flex rounded-lg mb-4 bg-white border drop-shadow-sm p-3">
            <MapPin className="h-6 w-6" />
          </div>
          <h3 className=" text-lg font-semibold ">{t('visitOffice')}</h3>
          <p className=" text-base text-description">{t('visitDescription')}</p>
          <Link href="#" className="text-lg font-medium mt-2">
            <span className="text-blue-600">{t('officeAddress')}</span>
          </Link>
        </Card>

        {/* Call Us Directly Card */}
        <Card className="border bg-[#F6F8FA] space-y-3 py-5 px-8 shadow-none hover:shadow-md">
          <div className=" inline-flex rounded-lg mb-4 bg-white border drop-shadow-sm p-3">
            <Phone className="h-6 w-6" />
          </div>
          <h3 className=" text-lg font-semibold ">{t('callUs')}</h3>
          <p className=" text-base text-description">{t('callDescription')}</p>
          <Link href="tel:+251911201096" className="text-lg font-medium mt-2">
            <span className="text-blue-600">0930696969/0930656565</span>
          </Link>
        </Card>
      </div>
    </section>
  );
}
