'use client';

import { useEffect, useState } from 'react';
import styles from './SentimentAnalysis.module.css';
import { Heart, Smile, Frown, Meh, HelpCircle } from 'lucide-react';

const iconMap = {
  positive: Smile,
  negative: Frown,
  neutral: Meh,
  mixed: HelpCircle,
};

const sentimentColors = {
  positive: 'var(--color-accent-emerald)',
  negative: 'var(--color-accent-rose)',
  neutral: 'var(--color-accent-blue)',
  mixed: 'var(--color-accent-purple)',
};

function AnimatedNumber({ target, duration = 1000 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const step = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return <span>{value}%</span>;
}

export default function SentimentAnalysis({ sentiment }) {
  const [animated, setAnimated] = useState(false);
  const { overall, score, breakdown, explanation } = sentiment;
  const IconComponent = iconMap[overall] || HelpCircle;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const pos = breakdown.positive || 0;
  const neg = breakdown.negative || 0;
  const neu = breakdown.neutral || 0;

  const conicGradient = `conic-gradient(
    var(--color-accent-emerald) 0deg ${pos * 3.6}deg,
    var(--color-accent-rose) ${pos * 3.6}deg ${(pos + neg) * 3.6}deg,
    var(--color-accent-blue) ${(pos + neg) * 3.6}deg 360deg
  )`;

  const gaugePosition = ((score + 1) / 2) * 100;

  return (
    <div className={`${styles.wrapper} glass-card animate-in`}>
      <h3 className="section-title">
        <Heart size={20} />
        Sentiment
      </h3>

      <div className={styles.content}>
        {/* Donut Chart */}
        <div className={styles.donutContainer}>
          <div
            className={styles.donut}
            style={{
              background: animated ? conicGradient : 'var(--color-surface)',
            }}
          >
            <div className={styles.donutCenter}>
              <div className={styles.iconContainer} style={{ color: sentimentColors[overall] || 'var(--color-text-primary)' }}>
                <IconComponent size={36} strokeWidth={1.5} />
              </div>
              <span className={styles.overallLabel}>{overall}</span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className={styles.breakdown}>
          <div className={styles.breakdownItem}>
            <div className={styles.breakdownHeader}>
              <span className={styles.breakdownDot} style={{ background: 'var(--color-accent-emerald)' }} />
              <span>Positive</span>
            </div>
            <span className={styles.breakdownValue} style={{ color: 'var(--color-accent-emerald)' }}>
              <AnimatedNumber target={pos} />
            </span>
          </div>
          <div className={styles.breakdownItem}>
            <div className={styles.breakdownHeader}>
              <span className={styles.breakdownDot} style={{ background: 'var(--color-accent-rose)' }} />
              <span>Negative</span>
            </div>
            <span className={styles.breakdownValue} style={{ color: 'var(--color-accent-rose)' }}>
              <AnimatedNumber target={neg} />
            </span>
          </div>
          <div className={styles.breakdownItem}>
            <div className={styles.breakdownHeader}>
              <span className={styles.breakdownDot} style={{ background: 'var(--color-accent-blue)' }} />
              <span>Neutral</span>
            </div>
            <span className={styles.breakdownValue} style={{ color: 'var(--color-accent-blue)' }}>
              <AnimatedNumber target={neu} />
            </span>
          </div>
        </div>
      </div>

      {/* Score Gauge */}
      <div className={styles.gauge}>
        <div className={styles.gaugeLabel}>
          <span>Negative</span>
          <span>Score: {score > 0 ? '+' : ''}{score.toFixed(2)}</span>
          <span>Positive</span>
        </div>
        <div className={styles.gaugeTrack}>
          <div
            className={styles.gaugeIndicator}
            style={{ left: animated ? `${gaugePosition}%` : '50%' }}
          />
        </div>
      </div>

      {explanation && (
        <p className={styles.explanation}>{explanation}</p>
      )}
    </div>
  );
}
