'use client';

import styles from './TimestampList.module.css';
import { Clock, ExternalLink } from 'lucide-react';
import { getTimestampLink } from '@/utils/youtube';

export default function TimestampList({ timestamps, videoId }) {
  return (
    <div className={`${styles.wrapper} animate-in`}>
      <h3 className="section-title">
        <Clock size={20} />
        Timestamp Highlights
        <span className={styles.count}>{timestamps.length}</span>
      </h3>
      <div className={styles.timeline}>
        <div className={styles.line} />
        {timestamps.map((ts, index) => (
          <a
            key={index}
            href={getTimestampLink(videoId, ts.seconds)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.item}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className={styles.timeBadge}>
              {ts.time}
            </div>
            <div className={styles.content}>
              <h4 className={styles.label}>{ts.label}</h4>
              <p className={styles.summary}>{ts.summary}</p>
            </div>
            <ExternalLink size={14} className={styles.linkIcon} />
          </a>
        ))}
      </div>
    </div>
  );
}
