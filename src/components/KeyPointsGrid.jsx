'use client';

import { useState } from 'react';
import styles from './KeyPointsGrid.module.css';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

const importanceConfig = {
  high: { label: '🔴 High', className: 'badge-high' },
  medium: { label: '🟡 Medium', className: 'badge-medium' },
  low: { label: '🟢 Low', className: 'badge-low' },
};

export default function KeyPointsGrid({ keyPoints }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className={`${styles.wrapper} animate-in`}>
      <h3 className="section-title">
        <Lightbulb size={20} />
        Key Points
        <span className={styles.count}>{keyPoints.length}</span>
      </h3>
      <div className={styles.grid}>
        {keyPoints.map((point, index) => {
          const config = importanceConfig[point.importance] || importanceConfig.medium;
          const isExpanded = expandedIndex === index;
          return (
            <div
              key={index}
              className={`${styles.card} glass-card`}
              style={{ animationDelay: `${index * 120}ms` }}
              onClick={() => toggleExpand(index)}
            >
              <div className={styles.cardHeader}>
                <span className={`badge ${config.className}`}>{config.label}</span>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              <h4 className={styles.cardTitle}>{point.title}</h4>
              <div className={`${styles.description} ${isExpanded ? styles.descExpanded : ''}`}>
                <p>{point.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
