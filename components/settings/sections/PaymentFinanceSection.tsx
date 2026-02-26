export function PaymentFinanceSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          Payment & Finance
        </h1>
        <p className="text-sm text-gray-600">
          Manage your payment methods and financial information
        </p>
      </div>

      <div className="max-w-2xl pt-2">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 text-2xl">
            💳
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Payment Methods
          </h3>
          <p className="text-sm text-gray-600">No payment methods added yet</p>
          <button className="mt-6 rounded-full bg-teal-800 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-900 transition-colors">
            Add Payment Method
          </button>
        </div>
      </div>
    </div>
  );
}
