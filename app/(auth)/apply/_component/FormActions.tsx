export default function FormActions() {
  return (
    <div className="mt-6 flex gap-4">
      <button
        type="button"
        className="flex-1 rounded-full border border-gray-300 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
      >
        Back
      </button>

      <button
        type="submit"
        className="flex-1 rounded-full bg-primary py-3 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-50"
      >
        Submit Application
      </button>
    </div>
  );
}
