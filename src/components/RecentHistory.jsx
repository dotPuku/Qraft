import React from 'react';
import { History, Copy, ArrowUpRight, Trash2 } from 'lucide-react';

export default function RecentHistory({
  history,
  onSelectCode,
  onCopyCode,
  onClearHistory
}) {
  return (
    <div className="bg-[#1b1d24] border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-300 font-semibold text-base sm:text-lg">
          <History className="w-4 h-4 text-[#00e676]" />
          <span>Recently Generated Codes ({history.length})</span>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              title="Clear session history"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-zinc-400 mb-3">
        Click any code below to instantly recreate its QR code in the viewer:
      </p>

      {history.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/40">
          <p className="text-xs text-zinc-500">
            No codes generated in this session yet. Pick a prefix or click Generate!
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
          {history.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="group inline-flex items-center gap-1.5 bg-zinc-800/80 hover:bg-zinc-700/90 border border-zinc-700/70 hover:border-[#00e676]/40 rounded-xl px-3 py-1.5 transition-all text-xs font-mono text-zinc-200"
            >
              <button
                type="button"
                onClick={() => onSelectCode(item)}
                className="flex items-center gap-1.5 text-zinc-200 hover:text-[#00e676] cursor-pointer"
                title="Click to load into QR generator"
              >
                <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-[#00e676] transition-colors" />
                <span className="font-semibold">{item}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyCode(item);
                }}
                title="Copy code"
                className="ml-1 p-1 text-zinc-400 hover:text-white rounded transition-colors cursor-pointer"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
