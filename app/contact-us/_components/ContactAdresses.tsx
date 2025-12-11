import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function ContactAddresses() {
  return (
    <section className=" mx-auto py-16 max-w-[1212px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Email Support Card */}
        <Card className="border bg-[#F6F8FA] space-y-3 py-5 px-8 shadow-none hover:shadow-md">
          <div className=" inline-flex rounded-lg mb-4 bg-white border drop-shadow-sm p-3">
            <Mail className="h-6 w-6" />
          </div>
          <h3 className=" text-lg font-semibold ">Email Support</h3>
          <p className="text-base text-description">
            For quick questions and assistance, email our support team anytime.
          </p>
          <Link
            href="mailto:support@addisliferealestate.com"
            className="text-lg font-medium mt-2"
          >
            <span className="text-blue-600">
              support@addisliferealestate.com
            </span>
          </Link>
        </Card>

        {/* Visit Our Office Card */}
        <Card className="border bg-[#F6F8FA] space-y-3 py-5 px-8 shadow-none hover:shadow-md">
          <div className=" inline-flex rounded-lg mb-4 bg-white border drop-shadow-sm p-3">
            <MapPin className="h-6 w-6" />
          </div>
          <h3 className=" text-lg font-semibold ">Visit Our Office</h3>
          <p className=" text-base text-description">
            Get in-person guidance and learn more about available properties.
          </p>
          <Link href="#" className="text-lg font-medium mt-2">
            <span className="text-blue-600">
              Kirkos, In front of Africa union, AA
            </span>
          </Link>
        </Card>

        {/* Call Us Directly Card */}
        <Card className="border bg-[#F6F8FA] space-y-3 py-5 px-8 shadow-none hover:shadow-md">
          <div className=" inline-flex rounded-lg mb-4 bg-white border drop-shadow-sm p-3">
            <Phone className="h-6 w-6" />
          </div>
          <h3 className=" text-lg font-semibold ">Call Us Directly</h3>
          <p className=" text-base text-description">
            Speak with our team during working hours for immediate support.
          </p>
          <Link href="tel:+251911201096" className="text-lg font-medium mt-2">
            <span className="text-blue-600">(+251)-911-201096</span>
          </Link>
        </Card>
      </div>
    </section>
  );
}
