'use client';

import styles from './VideoHeader.module.css';
import { ExternalLink, Clock, User } from 'lucide-react';
import PdfExport from './PdfExport';

export default function VideoHeader({ data, contentRef, onSuccess }) {
  const videoUrl = `https://www.youtube.com/watch?v=${data.videoId}`;

  return (
    <div className={`${styles.header} glass-card animate-in`}>
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.thumbnailLink}
      >
        <div className={styles.thumbnailWrapper}>
          <img
            src={data.thumbnailUrl}
            alt={data.videoTitle}
            className={styles.thumbnail}
            onError={(e) => {
              e.target.src = `https://img.youtube.com/vi/${data.videoId}/hqdefault.jpg`;
            }}
          />
          <div className={styles.playOverlay}>
            <svg viewBox="0 0 68 48" className={styles.playIcon}>
              <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="rgba(255,0,0,0.85)"/>
              <path d="M45 24L27 14v20" fill="white"/>
            </svg>
          </div>
        </div>
      </a>
      <div className={styles.info}>
        <h2 className={styles.title}>{data.videoTitle}</h2>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <User size={14} />
            {data.channelName}
          </span>
          <span className={styles.metaItem}>
            <Clock size={14} />
            {data.duration}
          </span>
        </div>
        <div className={styles.actions}>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <ExternalLink size={14} />
            Open in YouTube
          </a>
          <PdfExport
            contentRef={contentRef}
            videoTitle={data.videoTitle}
            onSuccess={onSuccess}
          />
        </div>
      </div>
    </div>
  );
}
