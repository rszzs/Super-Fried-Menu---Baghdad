import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center text-3xl font-bold mb-4">
        404
      </div>
      <h1 className="text-2xl font-bold mb-2">الصفحة غير موجودة | Page Not Found</h1>
      <p className="text-zinc-400 mb-6 max-w-md">
        عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors"
      >
        العودة للقائمة الرئيسية | Back to Menu
      </Link>
    </div>
  );
}
