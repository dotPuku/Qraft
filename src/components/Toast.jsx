import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2800);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#00e676]" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-sky-400" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
      <div className="flex items-center gap-3 bg-[#1e2029] border border-zinc-700/80 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium text-white backdrop-blur-md">
        {icons[toast.type || 'success']}
        <span>{toast.message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-zinc-400 hover:text-white transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
