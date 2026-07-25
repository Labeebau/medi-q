import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
        <div className="flex items-center justify-center gap-1 mb-2 text-slate-300 font-semibold">
          <span>Medi-Q Healthcare System</span>
        </div>
        <p className="text-slate-500 text-xs">
          College Mini Project • Built with React, Vite, Tailwind CSS v3, Node.js, Express & MongoDB
        </p>
        <div className="mt-4 flex items-center justify-center gap-1 text-xs text-slate-400">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for Healthcare Management</span>
        </div>
      </div>
    </footer>
  );
}
