import React from 'react';
import { Hash, Sliders } from 'lucide-react';

const PRESET_DIGITS = [4, 6, 8, 10, 12];

export default function SuffixConfig({ digitCount, onDigitCountChange }) {
  return (
    <div className="bg-[#1b1d24] border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-300 font-semibold text-base sm:text-lg">
          <Hash className="w-4 h-4 text-[#00e676]" />
          <span>Choose Suffix Digits</span>
        </div>
        <div className="text-xs text-zinc-400 hidden sm:block">
          <span className="font-mono text-zinc-300">PREFIX-######</span>
        </div>
      </div>

      <p className="text-xs text-zinc-400 mb-4">
        Suffix will be appended to your prefix with a hyphen ("-"). Pick a standard length or specify custom:
      </p>

      {/* Quick Digit Selector Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {PRESET_DIGITS.map((count) => {
          const isSelected = digitCount === count;
          return (
            <button
              key={count}
              type="button"
              onClick={() => onDigitCountChange(count)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${isSelected
                ? 'bg-[#00e676] text-zinc-950 font-bold shadow-[0_0_12px_rgba(0,230,118,0.3)]'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700/60'
                }`}
            >
              {count} Digits
            </button>
          );
        })}

        {/* Custom Input */}
        <div className="flex items-center gap-2 ml-auto bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-1.5">
          <Sliders className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs text-zinc-400 font-medium">Custom:</span>
          <input
            type="number"
            min="1"
            max="24"
            value={digitCount}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) {
                onDigitCountChange(Math.max(1, Math.min(24, val)));
              }
            }}
            className="w-12 bg-transparent text-center font-mono font-bold text-sm text-[#00e676] focus:outline-none"
          />
          <span className="text-[11px] text-zinc-500">digits</span>
        </div>
      </div>

      {/* Visual length indicator */}
      <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
        <span>Min: 1 digit</span>
        <span className="text-zinc-400 font-mono">Current: {digitCount} random digits</span>
        <span>Max: 24 digits</span>
      </div>
    </div>
  );
}
