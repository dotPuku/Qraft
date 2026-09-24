import React, { useState } from 'react';
import { Tag, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { formatPrefix } from '../utils/qrUtils';

export default function PrefixManager({
  prefixes,
  activePrefix,
  onSelectPrefix,
  onAddPrefix,
  onDeletePrefix,
  onPrefixInputChange,
}) {
  const [newPrefixInput, setNewPrefixInput] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddNew = (e) => {
    e.preventDefault();
    const cleanPrefix = formatPrefix(newPrefixInput.trim());

    if (!cleanPrefix) {
      setErrorMsg('Please enter a prefix (e.g. PCM, PBHM)');
      return;
    }

    if (prefixes.includes(cleanPrefix)) {
      setErrorMsg(`"${cleanPrefix}" already exists`);
      return;
    }

    onAddPrefix(cleanPrefix);
    setNewPrefixInput('');
    setErrorMsg('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-[#1b1d24] border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Top bar with active input & actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-zinc-300 font-semibold text-base sm:text-lg">
            <Tag className="w-4 h-4 text-[#00e676]" />
            <span>Choose or Add Prefix</span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Click any prefix to load it into the input box
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setErrorMsg('');
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/30 hover:bg-[#00e676]/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus
            className="w-3.5 h-3.5 transition-transform duration-300"
            style={{ transform: showAddForm ? 'rotate(45deg)' : 'rotate(0deg)' }}
          />
          <span>{showAddForm ? 'Cancel' : 'Add Custom Prefix'}</span>
        </button>
      </div>

      {/* Add New Prefix Drawer / Form */}
      {showAddForm && (
        <form onSubmit={handleAddNew} className="mb-5 p-4 rounded-xl bg-zinc-900/90 border border-zinc-700/60 transition-all">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newPrefixInput}
              onChange={(e) => {
                setNewPrefixInput(formatPrefix(e.target.value));
                setErrorMsg('');
              }}
              placeholder="e.g. PCM, PBHM, BB-NOW, SB-IFC"
              className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 uppercase focus:outline-none focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676]"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#00e676] text-black font-semibold text-sm rounded-lg hover:bg-[#00c864] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Prefix</span>
            </button>
          </div>
          {errorMsg && <p className="text-rose-400 text-xs mt-2">{errorMsg}</p>}
        </form>
      )}

      {/* Prefix Input Box (Editable) */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
          Active Prefix (Type directly or click a button below):
        </label>
        <div className="relative">
          <input
            type="text"
            value={activePrefix}
            onChange={(e) => onPrefixInputChange(formatPrefix(e.target.value))}
            placeholder="TYPE OR SELECT A PREFIX..."
            className="w-full bg-zinc-900/90 border border-zinc-750 rounded-xl px-4 py-3 text-white text-base sm:text-lg font-mono font-bold tracking-wider uppercase focus:outline-none focus:border-[#00e676] focus:ring-2 focus:ring-[#00e676]/20 transition-all"
          />
          {activePrefix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#00e676]/15 text-[#00e676] border border-[#00e676]/30">
              ACTIVE
            </span>
          )}
        </div>
      </div>

      {/* Grid of Saved Prefixes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Available Prefixes ({prefixes.length})
          </span>
        </div>

        {prefixes.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/40">
            <p className="text-xs text-zinc-500">
              No prefixes left. Click "Add Custom Prefix" to add one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {prefixes.map((prefix) => {
              const isSelected = activePrefix === prefix;

              return (
                <div
                  key={prefix._id}
                  className="group relative flex items-center"
                >
                  <button
                    type="button"
                    onClick={() => onSelectPrefix(prefix.prefix)}
                    className={`w-full text-left sm:text-center pl-3 pr-8 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-between gap-1.5 ${isSelected
                      ? 'bg-[#00e676] text-zinc-950 shadow-[0_0_15px_rgba(0,230,118,0.35)] scale-[1.01]'
                      : 'bg-zinc-800/80 hover:bg-zinc-750 text-zinc-200 hover:text-white border border-zinc-700/60 hover:border-zinc-500'
                      }`}
                  >
                    <span className="truncate">{prefix.prefix}</span>
                    {isSelected && <Sparkles className="w-3 h-3 flex-shrink-0" />}
                  </button>

                  {/* Delete button: Available for ANY prefix */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePrefix(prefix);
                    }}
                    title={`Delete prefix ${prefix.prefix}`}
                    className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all cursor-pointer ${isSelected
                      ? 'text-zinc-900/60 hover:text-zinc-950 hover:bg-black/10'
                      : 'text-zinc-400 hover:text-rose-400 hover:bg-zinc-900/80 opacity-70 group-hover:opacity-100'
                      }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
