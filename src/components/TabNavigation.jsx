'use client';

import styles from './TabNavigation.module.css';

const tabs = [
  { id: 'summary', label: 'Summary' },
  { id: 'keypoints', label: 'Key Points' },
  { id: 'timestamps', label: 'Timestamps' },
  { id: 'analysis', label: 'Analysis' },
];

export default function TabNavigation({ activeTab, onTabChange, counts = {} }) {
  return (
    <div className={styles.wrapper}>
      <nav className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            {counts[tab.id] !== undefined && (
              <span className={styles.badge}>{counts[tab.id]}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
