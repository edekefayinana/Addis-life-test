'use client';

import { Logo } from '@/components/Logo';
import FileUpload from './_component/FileUpload';
import FormActions from './_component/FormActions';

export default function ApplyAsAgentPage() {
  return (
    <div className="py-4">
      <div className="mb-6 flex justify-center">
        <Logo />
      </div>

      <h1 className="mb-2 text-center text-3xl font-semibold tracking-tight">
        Apply as an Agent
      </h1>
      <p className="mx-auto mb-8 max-w-md text-center text-sm text-muted-foreground">
        Submit your details to apply for access to the agent portal. All
        applications are reviewed before approval.
      </p>
      <form className="space-y-6">
        <FileUpload label="ID Document (Passport/ID)" required />
        <FileUpload label="Real Estate License (Optional)" />

        <label className="flex items-start gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-300"
          />
          <span>
            I agree to the commission terms and conditions, including the
            standard 3% rate and payment terms.
          </span>
        </label>

        <FormActions />
      </form>
    </div>
  );
}
