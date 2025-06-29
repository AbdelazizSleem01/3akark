// app/loading.js
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-base-100">
      <progress className="progress progress-primary w-56"></progress>
      <p className="text-lg font-medium text-primary animate-pulse">
        جاري التحميل، الرجاء الانتظار...
      </p>
    </div>
  );
}
