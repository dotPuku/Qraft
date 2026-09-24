import React from 'react';
import { RefreshCw, Copy, Check, Edit3, Trash, Sparkles } from 'lucide-react';

export default function CodeInputSection({
  fullText,
  onFullTextChange,
  onGenerateNew,
  onCopyText,
  hasCopied,
  activePrefix,
  digitCount
}) {
  return (
    <div className="bg-[#1b1d24] border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-xl relative">
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-300 font-semibold text-base sm:text-lg">
          <Edit3 className="w-4 h-4 text-[#00e676]" />
          <span>Total Code (Editable) &amp; Generator</span>
        </div>
        <div className="text-xs text-zinc-400 hidden sm:block">
          Format: <span className="font-mono text-zinc-300">{activePrefix || 'PREFIX'}-{"#".repeat(digitCount)}</span>
        </div>
      </div>


      {/* Main editable text box */}
      <div className="relative mb-4">
        <input
          type="text"
          value={fullText}
          onChange={(e) => onFullTextChange(e.target.value.toUpperCase())}
          placeholder="e.g. PBHM-6405034417"
          className="w-full bg-zinc-950/90 border-2 border-zinc-700/80 hover:border-zinc-600 focus:border-[#00e676] rounded-xl px-4 py-3.5 pr-28 text-white font-mono text-lg sm:text-xl font-bold tracking-wider uppercase focus:outline-none focus:ring-4 focus:ring-[#00e676]/15 transition-all text-center sm:text-left"
        />

        {/* Quick action icons inside input */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {fullText && (
            <button
              type="button"
              onClick={() => onFullTextChange('')}
              title="Clear input"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Trash className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onCopyText}
            disabled={!fullText}
            title="Copy text to clipboard"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-700 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {hasCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#00e676]" />
                <span className="text-[#00e676]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Action Button: Generate New Suffix / QR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          type="button"
          onClick={onGenerateNew}
          className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-bold text-base bg-[#00e676] hover:bg-[#00c864] text-zinc-950 transition-all duration-200 transform active:scale-[0.98] shadow-[0_4px_20px_rgba(0,230,118,0.35)] hover:shadow-[0_6px_25px_rgba(0,230,118,0.5)] cursor-pointer"
        >
          <RefreshCw className="w-5 h-5 transition-transform hover:rotate-180 duration-500" />
          <span>Generate New QR Code</span>
          <Sparkles className="w-4 h-4 text-zinc-900" />
        </button>
      </div>

    </div>
  );
}
