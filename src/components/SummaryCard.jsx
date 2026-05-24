'use client';

import { useState } from 'react';
import styles from './SummaryCard.module.css';
import { FileText, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export default function SummaryCard({ summary, onCopy }) {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    if (onCopy) onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = summary.split(/\s+/).length;

  return (
    <div className={`${styles.card} glass-card animate-in`}>
      <div className={styles.header}>
        <h3 className="section-title">
          <FileText size={20} />
          Summary
        </h3>
        <div className={styles.actions}>
          <span className={styles.wordCount}>{wordCount} words</span>
          <button className="btn-ghost" onClick={handleCopy} title="Copy summary">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            className="btn-ghost"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>
      <div className={`${styles.content} ${expanded ? styles.expanded : styles.collapsed}`}>
        <p className={styles.text}>{summary}</p>
      </div>
    </div>
  );
}
