import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'Application Submitted',
  description:
    'Your account is under review. You will be notified once approved.',
};

export default function ApplicationSubmittedPage() {
  return (
    <div className="flex w-full flex-col items-center text-center h-screen justify-center">
      <div className="mt-10 flex flex-col items-center gap-6">
        {/* Success icon with concentric circles */}
        <div className="grid place-items-center">
          <div className="grid h-32 w-32 place-items-center rounded-full bg-green-100">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-green-200">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-7 w-7 text-white"
                >
                  <path
                    d="M20 7L9 18l-5-5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">
          Application Submitted!
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Your account is under review. You&apos;ll be notified once approved.
          This usually takes 1–2 business days.
        </p>

        <Button
          type="submit"
          className="h-14 w-full rounded-full bg-primary text-base font-medium text-white hover:bg-primary/90"
        >
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
}
