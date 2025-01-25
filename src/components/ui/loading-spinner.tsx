export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}