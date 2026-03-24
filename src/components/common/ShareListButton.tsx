import { useState } from 'react';
import { Share2, Copy, MessageCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { shoppingListApi } from '../../api/shopping-list.api';

export default function ShareListButton() {
  const [open, setOpen] = useState(false);
  const [shareText, setShareText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    try {
      const text = await shoppingListApi.getShareText();
      setShareText(typeof text === 'string' ? text : text?.text || '');
      setOpen(true);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = shareText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Lista de compras',
          text: shareText,
        });
      } catch {
        // user cancelled
      }
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        disabled={loading}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
      >
        <Share2 size={16} />
        Compartir
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 mx-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Compartir lista de compras
                </h3>

                {/* Preview */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4 max-h-48 overflow-y-auto">
                  <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                    {shareText}
                  </pre>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                  >
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors text-sm font-medium"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </button>
                  {typeof navigator.share === 'function' && (
                    <button
                      onClick={handleNativeShare}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm font-medium"
                    >
                      <Share2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
