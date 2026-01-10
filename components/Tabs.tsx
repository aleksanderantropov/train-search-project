'use client';

import { useState, ReactNode } from 'react';
import styles from './Tabs.module.css';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  className?: string;
}

export default function Tabs({ tabs, defaultActiveTab, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id);
  
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.tabList}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${
              activeTab === tab.id ? styles.active : ''
            } ${tab.disabled ? styles.disabled : ''}`}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className={styles.tabContent}>
        {activeTabContent}
      </div>
    </div>
  );
}