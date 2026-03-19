'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Tabs({
  tabs,
  defaultTab,
  onChange,
  variant = 'underline',
  className = '',
}) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const variants = {
    underline: {
      container: 'border-b border-gray-200',
      tab: (isActive) => `
        px-4 py-3 text-sm font-medium transition-colors relative
        ${isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}
      `,
      indicator: 'absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600',
    },
    pills: {
      container: 'flex space-x-2 p-1 bg-gray-100 rounded-xl',
      tab: (isActive) => `
        px-4 py-2 text-sm font-medium rounded-lg transition-all
        ${isActive ? 'bg-white text-primary-600 shadow' : 'text-gray-600 hover:text-gray-900'}
      `,
      indicator: null,
    },
    buttons: {
      container: 'flex space-x-2',
      tab: (isActive) => `
        px-6 py-3 text-sm font-medium rounded-xl transition-all
        ${isActive 
          ? 'bg-primary-600 text-white shadow-lg' 
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
        }
      `,
      indicator: null,
    },
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className={className}>
      <div className={variants[variant].container}>
        <div className="flex">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={variants[variant].tab(isActive)}
              >
                <div className="flex items-center space-x-2">
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      isActive ? 'bg-white/20' : 'bg-gray-200'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </div>
                {variants[variant].indicator && isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className={variants[variant].indicator}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-6"
        >
          {tabs.find(t => t.id === activeTab)?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}