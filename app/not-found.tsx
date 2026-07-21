import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-xs uppercase tracking-editorial text-stone-500 font-sans mb-4">
          Page Not Found
        </p>
        <h1 className="font-serif text-7xl md:text-8xl mb-6">
          404
        </h1>
        <p className="font-sans text-stone-700 leading-relaxed mb-8">
          The page you are seeking seems to have moved or never existed.
        </p>
        <Link href="/" className="pill-button">
          Return Home
        </Link>
      </div>
    </div>
  );
}