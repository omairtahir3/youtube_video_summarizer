'use client';

import styles from './KeywordCloud.module.css';
import { Tag } from 'lucide-react';

const categoryColors = {
  Technical: '#8b5cf6',
  Person: '#06b6d4',
  Concept: '#10b981',
  Tool: '#f59e0b',
  Place: '#3b82f6',
  Event: '#f43f5e',
  Organization: '#ec4899',
};

export default function KeywordCloud({ keywords }) {
  const maxRelevance = Math.max(...keywords.map((k) => k.relevance));

  return (
    <div className={`${styles.wrapper} glass-card animate-in`}>
      <h3 className="section-title">
        <Tag size={20} />
        Keywords
        <span className={styles.count}>{keywords.length}</span>
      </h3>
      <div className={styles.cloud}>
        {keywords.map((keyword, index) => {
          const size = 0.75 + (keyword.relevance / maxRelevance) * 0.5;
          const color = categoryColors[keyword.category] || '#8b5cf6';

          return (
            <div
              key={index}
              className={styles.tag}
              style={{
                fontSize: `${size}rem`,
                borderColor: `${color}33`,
                background: `${color}11`,
                animationDelay: `${Math.random() * 400}ms`,
              }}
              title={`${keyword.category} • Relevance: ${Math.round(keyword.relevance * 100)}%`}
            >
              <span className={styles.dot} style={{ background: color }} />
              {keyword.word}
              <span className={styles.relevance} style={{ color }}>
                {Math.round(keyword.relevance * 100)}%
              </span>
            </div>
          );
        })}
      </div>
      <div className={styles.legend}>
        {Object.entries(categoryColors).map(([cat, color]) => {
          const hasCategory = keywords.some((k) => k.category === cat);
          if (!hasCategory) return null;
          return (
            <span key={cat} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: color }} />
              {cat}
            </span>
          );
        })}
      </div>
    </div>
  );
}
