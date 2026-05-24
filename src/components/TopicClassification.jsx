'use client';

import { useEffect, useState } from 'react';
import styles from './TopicClassification.module.css';
import { FolderOpen } from 'lucide-react';

const barColors = [
  'var(--color-accent-purple)',
  'var(--color-accent-cyan)',
  'var(--color-accent-emerald)',
  'var(--color-accent-amber)',
  'var(--color-accent-rose)',
];

export default function TopicClassification({ topics }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const sorted = [...topics].sort((a, b) => b.confidence - a.confidence);

  return (
    <div className={`${styles.wrapper} glass-card animate-in`}>
      <h3 className="section-title">
        <FolderOpen size={20} />
        Topics
        <span className={styles.count}>{topics.length}</span>
      </h3>
      <div className={styles.bars}>
        {sorted.map((topic, index) => {
          const color = barColors[index % barColors.length];
          const pct = Math.round(topic.confidence * 100);
          return (
            <div key={index} className={styles.barRow} title={topic.description || topic.name}>
              <div className={styles.barLabel}>
                <span className={styles.topicName}>{topic.name}</span>
                <span className={styles.pct} style={{ color }}>{pct}%</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{
                    width: animated ? `${pct}%` : '0%',
                    background: color,
                    transitionDelay: `${index * 150}ms`,
                  }}
                />
              </div>
              {topic.description && (
                <p className={styles.description}>{topic.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
