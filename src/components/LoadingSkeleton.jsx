'use client';

import styles from './LoadingSkeleton.module.css';
import { Radio, FileText, Brain } from 'lucide-react';

const steps = [
  { icon: Radio, label: 'Extracting transcript...' },
  { icon: Brain, label: 'Analyzing content with AI...' },
  { icon: FileText, label: 'Generating summary...' },
];

export default function LoadingSkeleton({ phase = 0 }) {
  return (
    <div className={styles.wrapper}>
      {/* Progress Steps */}
      <div className={styles.steps}>
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === phase;
          const isDone = i < phase;
          return (
            <div
              key={i}
              className={`${styles.step} ${isActive ? styles.active : ''} ${isDone ? styles.done : ''}`}
            >
              <div className={styles.stepIcon}>
                <Icon size={20} />
                {isActive && <div className={styles.pulse} />}
              </div>
              <span className={styles.stepLabel}>{step.label}</span>
              {i < steps.length - 1 && <div className={`${styles.connector} ${isDone ? styles.connectorDone : ''}`} />}
            </div>
          );
        })}
      </div>

      {/* Skeleton Cards */}
      <div className={styles.skeletonGrid}>
        <div className={`${styles.skeletonCard} ${styles.large}`}>
          <div className={`${styles.skeletonLine} ${styles.w80} shimmer-bg`} />
          <div className={`${styles.skeletonLine} ${styles.w100} shimmer-bg`} />
          <div className={`${styles.skeletonLine} ${styles.w100} shimmer-bg`} />
          <div className={`${styles.skeletonLine} ${styles.w60} shimmer-bg`} />
        </div>
        <div className={styles.skeletonRow}>
          <div className={styles.skeletonCard}>
            <div className={`${styles.skeletonLine} ${styles.w60} shimmer-bg`} />
            <div className={`${styles.skeletonLine} ${styles.w100} shimmer-bg`} />
            <div className={`${styles.skeletonLine} ${styles.w80} shimmer-bg`} />
          </div>
          <div className={styles.skeletonCard}>
            <div className={`${styles.skeletonLine} ${styles.w40} shimmer-bg`} />
            <div className={`${styles.skeletonLine} ${styles.w100} shimmer-bg`} />
            <div className={`${styles.skeletonLine} ${styles.w70} shimmer-bg`} />
          </div>
          <div className={styles.skeletonCard}>
            <div className={`${styles.skeletonLine} ${styles.w50} shimmer-bg`} />
            <div className={`${styles.skeletonLine} ${styles.w100} shimmer-bg`} />
            <div className={`${styles.skeletonLine} ${styles.w90} shimmer-bg`} />
          </div>
        </div>
      </div>
    </div>
  );
}
