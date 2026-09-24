import { useState, useEffect, useCallback } from 'react';
import PrefixManager from './components/PrefixManager';
import SuffixConfig from './components/SuffixConfig';
import CodeInputSection from './components/CodeInputSection';
import QRCodeCard from './components/QRCodeCard';
import RecentHistory from './components/RecentHistory';
import Toast from './components/Toast';
import {
  generateRandomDigits,
  formatPrefix,
} from './utils/qrUtils';

export default function App() {
  const [prefixes, setPrefixes] = useState([]);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const fetchPrefixes = async () => {
    try {
      const response = await fetch(SERVER_URL);

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.success) {
        setPrefixes(data.prefixes || []);
      } else {
        console.error("API error:", data.message);
      }
    } catch (error) {
      console.error("Fetch prefixes error:", error);
    }
  };

  useEffect(() => {
    fetchPrefixes();
  }, []);

  const [activePrefix, setActivePrefix] = useState();
  const [digitCount, setDigitCount] = useState(10);
  const [fullText, setFullText] = useState('');
  const [history, setHistory] = useState([]);
  const [hasCopied, setHasCopied] = useState(false);
  const [toast, setToast] = useState(null);

  const handleAddPrefix = async (newPrefix) => {
    const cleanPrefix = formatPrefix(newPrefix.trim());

    try {
      const response = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prefix: cleanPrefix,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPrefixes((prev) => [...prev, data.prefix]);

        setActivePrefix(cleanPrefix);

        generateNewCode(cleanPrefix, digitCount, true);

        setToast({
          type: "success",
          message: `Prefix "${cleanPrefix}" added and selected!`,
        });
      } else {
        setToast({
          type: "error",
          message: data.message || "Failed to add prefix",
        });
      }
    } catch (error) {
      console.error("Add prefix error:", error);

      setToast({
        type: "error",
        message: "Could not connect to server",
      });
    }
  };

  const addToHistory = useCallback((code) => {
    if (!code || !code.trim()) return;
    const clean = code.trim().toUpperCase();
    setHistory((prev) => {
      const filtered = prev.filter((item) => item !== clean);
      return [clean, ...filtered].slice(0, 20);
    });
  }, []);

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

  const handleSelectPrefix = (prefix) => {
    const cleanPrefix = formatPrefix(prefix);
    setActivePrefix(cleanPrefix);
    generateNewCode(cleanPrefix, digitCount, true);
  };

  const handleDeletePrefix = async (prefixToDelete) => {
    const deleteId = prefixToDelete._id;

    try {
      const response = await fetch(`${SERVER_URL}/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleteId }),
      });

      const data = await response.json();

      if (data.success) {
        const nextPrefixes = prefixes.filter(
          (item) => item._id !== deleteId
        );

        setPrefixes(nextPrefixes);

        // prefixToDelete is an object
        if (activePrefix === prefixToDelete.prefix) {
          const nextActive = nextPrefixes[0]?.prefix || "";

          setActivePrefix(nextActive);

          if (nextActive) {
            generateNewCode(nextActive, digitCount, false);
          } else {
            setFullText("");
          }
        }

        setToast({
          type: "info",
          message: `Prefix "${prefixToDelete.prefix}" deleted`,
        });
      } else {
        setToast({
          type: "error",
          message: data.message || "Failed to delete prefix",
        });
      }
    } catch (error) {
      console.error("Delete prefix error:", error);

      setToast({
        type: "error",
        message: "Could not connect to server",
      });
    }
  };

  const handleDigitCountChange = (newCount) => {
    setDigitCount(newCount);
    generateNewCode(activePrefix, newCount, true);
  };

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

  const handleSelectRecent = (code) => {
    const upper = code.toUpperCase();
    setFullText(upper);

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
      <Toast toast={toast} onClose={() => setToast(null)} />
      <main className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-6">
            <PrefixManager
              prefixes={prefixes}
              activePrefix={activePrefix}
              onSelectPrefix={handleSelectPrefix}
              onAddPrefix={handleAddPrefix}
              onDeletePrefix={handleDeletePrefix}
              onPrefixInputChange={(newVal) => setActivePrefix(formatPrefix(newVal))}
            />
            <SuffixConfig
              digitCount={digitCount}
              onDigitCountChange={handleDigitCountChange}
            />
            <CodeInputSection
              fullText={fullText}
              onFullTextChange={(val) => {
                setFullText(val);
                addToHistory(val);
              }}
              onGenerateNew={() => generateNewCode(activePrefix, digitCount, true)}
              onCopyText={handleCopyText}
              hasCopied={hasCopied}
            />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <QRCodeCard
              value={fullText}
              onNotify={(notification) => setToast(notification)}
            />
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
              onClearHistory={() => setHistory([])}
            />
          </div>
        </div>
      </main>
    </div>
  );
}