export function ProductSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-gray-50 overflow-hidden animate-pulse">
      {/* Image Box */}
      <div className="aspect-[4/5] bg-gray-200" />

      {/* Content Box */}
      <div className="p-4 space-y-3">
        <div className="h-2 w-1/3 bg-gray-200 rounded-full" />
        <div className="h-4 w-3/4 bg-gray-200 rounded-md" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 w-1/4 bg-gray-200 rounded-md" />
          <div className="h-3 w-10 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
