import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="relative">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg transform rotate-45"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-lg transform -rotate-45">FF</span>
        </div>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        FreeFall
      </span>
    </Link>
  );
} 