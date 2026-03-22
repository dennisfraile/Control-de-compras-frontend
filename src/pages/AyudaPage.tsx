import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Lightbulb,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Search,
  HelpCircle,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { sectionHelp, glossaryTerms, workflows } from '../utils/helpContent';

type Tab = 'workflows' | 'sections' | 'glossary';

export default function AyudaPage() {
  const [activeTab, setActiveTab] = useState<Tab>('workflows');
  const [expandedWorkflow, setExpandedWorkflow] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'workflows', label: 'Flujos guiados', icon: <ArrowRight size={16} /> },
    { id: 'sections', label: 'Secciones', icon: <BookOpen size={16} /> },
    { id: 'glossary', label: 'Glosario', icon: <HelpCircle size={16} /> },
  ];

  const filteredGlossary = glossaryTerms.filter(
    (t) =>
      t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.definition.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredSections = Object.entries(sectionHelp).filter(
    ([, v]) =>
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader title="Centro de ayuda" subtitle="Aprende a usar todas las funciones de Mis compras" />

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchTerm('');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search (sections & glossary) */}
      {activeTab !== 'workflows' && (
        <div className="relative mb-6">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={activeTab === 'glossary' ? 'Buscar termino...' : 'Buscar seccion...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
        </div>
      )}

      {/* Tab 1: Workflows */}
      {activeTab === 'workflows' && (
        <div className="space-y-3">
          {workflows.map((wf, idx) => {
            const isOpen = expandedWorkflow === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <button
                  onClick={() => setExpandedWorkflow(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{wf.icon}</span>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
                        {wf.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {wf.steps.length} pasos
                      </p>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700">
                    <div className="mt-4 space-y-4">
                      {wf.steps.map((step, si) => (
                        <div key={si} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {si + 1}
                            </div>
                            {si < wf.steps.length - 1 && (
                              <div className="w-0.5 flex-1 bg-blue-100 dark:bg-blue-900/30 mt-1" />
                            )}
                          </div>
                          <div className="pb-4 flex-1">
                            <h4 className="font-medium text-gray-800 dark:text-white text-sm">
                              {step.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {step.description}
                            </p>
                            {step.link && (
                              <Link
                                to={step.link}
                                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium mt-1.5 hover:underline"
                              >
                                Ir a la seccion <ArrowRight size={12} />
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Sections */}
      {activeTab === 'sections' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSections.map(([key, section]) => (
            <div
              key={key}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700 animate-fade-in"
            >
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle size={18} className="text-blue-500" />
                <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
                  {section.title}
                </h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {section.description}
              </p>
              <div className="space-y-2">
                {section.tips.map((tip, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <Lightbulb size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {filteredSections.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              No se encontraron secciones con "{searchTerm}"
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Glossary */}
      {activeTab === 'glossary' && (
        <div className="space-y-3">
          {filteredGlossary.map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md px-5 py-4 border border-gray-100 dark:border-gray-700 animate-fade-in"
            >
              <h4 className="font-semibold text-gray-800 dark:text-white text-sm flex items-center gap-2">
                <BookOpen size={14} className="text-blue-500" />
                {item.term}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
                {item.definition}
              </p>
            </div>
          ))}
          {filteredGlossary.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No se encontraron terminos con "{searchTerm}"
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
