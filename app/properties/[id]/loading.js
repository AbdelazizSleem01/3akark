export default function Loading() {
  return (
    <div className="p-8 text-center">
      <div className="flex justify-center items-center">
        <span className="loading loading-spinner text-blue-500 w-12 h-12"></span>
      </div>
      <p className="mt-4 text-gray-500">جارٍ تحميل تفاصيل العقار...</p>
    </div>
  );
}
