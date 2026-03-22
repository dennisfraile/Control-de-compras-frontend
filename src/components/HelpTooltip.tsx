import { useState, useEffect, useRef } from 'react';
import { HelpCircle, X, Lightbulb } from 'lucide-react';
import type { SectionHelp } from '../utils/helpContent';

interface HelpTooltipProps {
  content: SectionHelp;
}

export default function HelpTooltip({ content }: HelpTooltipProps) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close on click outside (desktop)
  useEffect(() => {
    if (!open || isMobile) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, isMobile]);

  // Prevent body scroll on mobile when open
  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isMobile, open]);

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded-full text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
        aria-label="Ayuda"
      >
        <HelpCircle size={20} />
      </button>

      {/* Mobile: Bottom Sheet */}
      {open && isMobile && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl max-h-[70vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white dark:bg-gray-800 px-5 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle size={20} className="text-blue-500" />
                <h3 className="font-bold text-gray-800 dark:text-white">{content.title}</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{content.description}</p>
              <div className="space-y-3">
                {content.tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <Lightbulb size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Desktop: Dropdown */}
      {open && !isMobile && (
        <div className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 animate-fade-in">
          <div className="px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle size={18} className="text-blue-500" />
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{content.title}</h3>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={14} className="text-gray-400" />
            </button>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">{content.description}</p>
            <div className="space-y-2.5">
              {content.tips.map((tip, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <Lightbulb size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
