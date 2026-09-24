import React, { useState, useEffect, useCallback } from 'react';
import PrefixManager from './components/PrefixManager';
import SuffixConfig from './components/SuffixConfig';
import CodeInputSection from './components/CodeInputSection';
import QRCodeCard from './components/QRCodeCard';
import RecentHistory from './components/RecentHistory';
import Toast from './components/Toast';
import {
  INITIAL_PREFIXES,
  generateRandomDigits,
  formatPrefix,
  STORAGE_PREFIXES_KEY
} from './utils/qrUtils';


export default function App() {
  // 1. Prefixes list: ONLY this is saved in localStorage, hyphens strictly enforced
  const [prefixes, setPrefixes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIXES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Migrate any existing underscore prefixes to hyphens
          return parsed.map((p) => formatPrefix(p));
        }
      }
    } catch (e) {
      console.error('Error loading prefixes from localStorage:', e);
    }
    return INITIAL_PREFIXES;
  });

  // 2. Active prefix (in-memory, defaults to first prefix or 'PBHM')
  const [activePrefix, setActivePrefix] = useState(() => {
    return prefixes.length > 0 ? prefixes[0] : 'PBHM';
  });

  // 3. Suffix digits count: STRICTLY 10 by default (in-memory)
  const [digitCount, setDigitCount] = useState(10);

  // 4. Combined full text (in-memory)
  const [fullText, setFullText] = useState('');

  // 5. Recent history: STRICTLY in-memory, cleared on reload
  const [history, setHistory] = useState([]);

  // UI state
  const [hasCopied, setHasCopied] = useState(false);
  const [toast, setToast] = useState(null);

  // Clean up legacy localStorage keys from previous iterations
  useEffect(() => {
    try {
      localStorage.removeItem('bb_qr_digit_count_v1');
      localStorage.removeItem('bb_qr_active_prefix_v1');
      localStorage.removeItem('bb_qr_saved_prefixes_v1');
    } catch (e) { }
  }, []);

  // ONLY save prefixes list in localStorage (Requirement 1)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIXES_KEY, JSON.stringify(prefixes));
    } catch (e) {
      console.error('Failed to save prefixes to localStorage:', e);
    }
  }, [prefixes]);

  // Helper to add code to session history (in-memory only, cleared on reload)
  const addToHistory = useCallback((code) => {
    if (!code || !code.trim()) return;
    const clean = code.trim().toUpperCase();
    setHistory((prev) => {
      const filtered = prev.filter((item) => item !== clean);
      return [clean, ...filtered].slice(0, 20);
    });
  }, []);

  // Helper to generate a new suffix and full text
  const generateNewCode = useCallback(
    (prefixToUse = activePrefix, digitsToUse = digitCount, notify = true) => {
      const prefix = formatPrefix(prefixToUse || 'CODE').trim();
      const randomSuffix = generateRandomDigits(digitsToUse);
      const combined = `${prefix}-${randomSuffix}`;

      setFullText(combined);
      addToHistory(combined);

      if (notify) {
        setToast({
          type: 'success',
          message: `Generated: ${combined}`
        });
      }
      return combined;
    },
    [activePrefix, digitCount, addToHistory]
  );

  // No auto-generation on first load — history and fullText start empty

  // Handler: Select a prefix from the preset list
  const handleSelectPrefix = (prefix) => {
    const cleanPrefix = formatPrefix(prefix);
    setActivePrefix(cleanPrefix);
    generateNewCode(cleanPrefix, digitCount, true);
  };

  // Handler: Add custom prefix (hyphens enforced)
  const handleAddPrefix = (newPrefix) => {
    const cleanPrefix = formatPrefix(newPrefix.trim());
    if (!prefixes.includes(cleanPrefix)) {
      const updated = [...prefixes, cleanPrefix];
      setPrefixes(updated);
      setActivePrefix(cleanPrefix);
      generateNewCode(cleanPrefix, digitCount, true);
      setToast({
        type: 'success',
        message: `Prefix "${cleanPrefix}" added and selected!`
      });
    }
  };

  // Handler: Delete ANY prefix
  const handleDeletePrefix = (prefixToDelete) => {
    const updated = prefixes.filter((p) => p !== prefixToDelete);
    setPrefixes(updated);
    if (activePrefix === prefixToDelete) {
      const nextActive = updated[0] || '';
      setActivePrefix(nextActive);
      if (nextActive) {
        generateNewCode(nextActive, digitCount, false);
      } else {
        setFullText('');
      }
    }
    setToast({
      type: 'info',
      message: `Prefix "${prefixToDelete}" deleted`
    });
  };

  // Handler: Digit count change (defaults to 10)
  const handleDigitCountChange = (newCount) => {
    setDigitCount(newCount);
    generateNewCode(activePrefix, newCount, true);
  };

  // Handler: Copy full text to clipboard
  const handleCopyText = async () => {
    if (!fullText) return;
    try {
      await navigator.clipboard.writeText(fullText);
      setHasCopied(true);
      setToast({
        type: 'success',
        message: `Copied "${fullText}" to clipboard!`
      });
      setTimeout(() => setHasCopied(false), 2000);
    } catch (err) {
      console.error(err);
      setToast({
        type: 'error',
        message: 'Could not copy to clipboard'
      });
    }
  };

  // Handler: Select item from recent history
  const handleSelectRecent = (code) => {
    const upper = code.toUpperCase();
    setFullText(upper);

    // Extract prefix if hyphen exists
    if (upper.includes('-')) {
      const extractedPrefix = upper.split('-')[0];
      if (extractedPrefix) {
        setActivePrefix(extractedPrefix);
      }
    }

    setToast({
      type: 'info',
      message: `Loaded from history: ${upper}`
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Toast notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Main Content Area */}
      <main className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Configuration Controls (Steps 1, 2, 3) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Prefix Selector & Manager (Hyphens used, no underscore, delete any, no numbering) */}
            <PrefixManager
              prefixes={prefixes}
              activePrefix={activePrefix}
              onSelectPrefix={handleSelectPrefix}
              onAddPrefix={handleAddPrefix}
              onDeletePrefix={handleDeletePrefix}
              onPrefixInputChange={(newVal) => setActivePrefix(formatPrefix(newVal))}
            />

            {/* Step 2: Suffix Digits Selector (Default 10) */}
            <SuffixConfig
              digitCount={digitCount}
              onDigitCountChange={handleDigitCountChange}
            />

            {/* Step 3: Editable Full Text & Generator Button */}
            <CodeInputSection
              fullText={fullText}
              onFullTextChange={(val) => {
                setFullText(val);
                addToHistory(val);
              }}
              onGenerateNew={() => generateNewCode(activePrefix, digitCount, true)}
              onCopyText={handleCopyText}
              hasCopied={hasCopied}
              activePrefix={activePrefix}
              digitCount={digitCount}
            />
          </div>

          {/* Right Column: QR Code Display Card & Recent History */}
          <div className="lg:col-span-5 space-y-6">
            {/* High-Resolution QR Card with Download & Print */}
            <QRCodeCard
              value={fullText}
              onNotify={(notification) => setToast(notification)}
            />

            {/* Recent History: Cleared on page reload */}
            <RecentHistory
              history={history}
              onSelectCode={handleSelectRecent}
              onCopyCode={(code) => {
                navigator.clipboard.writeText(code);
                setToast({
                  type: 'success',
                  message: `Copied "${code}" to clipboard!`
                });
              }}
              onClearHistory={() => {
                setHistory([]);
                setToast({ type: 'info', message: 'Session history cleared' });
              }}
            />
          </div>
        </div>
      </main>

      {/* Styled Footer matching original aesthetic */}
      <footer className="mt-12 pt-6 pb-2 border-t border-zinc-800/80 text-center">
        <div className="text-zinc-500 text-xs sm:text-sm font-semibold tracking-widest uppercase">
          CREATED BY <span className="text-[#00e676] drop-shadow-[0_0_8px_rgba(0,230,118,0.5)] font-bold">PUKU</span>
        </div>
      </footer>
    </div>
  );
}
