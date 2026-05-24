'use client';

import { useState } from 'react';
import styles from './BulletSummary.module.css';
import { List, Copy, Check } from 'lucide-react';

export default function BulletSummary({ bullets, onCopy }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [copied, setCopied] = useState(false);

  const toggleCheck = (index) => {
    setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleCopyAll = () => {
    const text = bullets.map((b, i) => `• ${b}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${styles.card} glass-card animate-in`}>
      <div className={styles.header}>
        <h3 className="section-title">
          <List size={20} />
          Bullet Summary
        </h3>
        <button className="btn-ghost" onClick={handleCopyAll}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy All'}
        </button>
      </div>
      <ul className={styles.list}>
        {bullets.map((bullet, index) => (
          <li
            key={index}
            className={`${styles.item} ${checkedItems[index] ? styles.checked : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => toggleCheck(index)}
          >
            <span className={styles.checkbox}>
              {checkedItems[index] ? (
                <Check size={12} />
              ) : (
                <span className={styles.dot} />
              )}
            </span>
            <span className={styles.text}>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
