import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative text-center max-w-md">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-editorial text-cyan-400 mb-6 px-4 py-1.5 glass rounded-full">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
          Page Not Found
        </div>
        <h1 className="font-serif text-7xl md:text-8xl mb-6">
          <span className="bg-gradient-to-r from-purple-300 via-white to-cyan-300 bg-clip-text text-transparent">
            404
          </span>
        </h1>
        <p className="text-slate-400 leading-relaxed mb-8">
          The page you are seeking seems to have moved or never existed in this dimension.
        </p>
        <Link 
          href="/" 
          className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white text-sm uppercase tracking-editorial font-medium rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/40"
        >
          <Home className="w-4 h-4 mr-2" />
          Return Home
          <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}