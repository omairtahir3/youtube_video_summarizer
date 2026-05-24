'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';
import { Sparkles, Link2, ArrowRight, AlertTriangle, RotateCcw } from 'lucide-react';
import { isValidYouTubeUrl } from '@/utils/youtube';
import ToastContainer, { useToast } from '@/components/Toast';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import VideoHeader from '@/components/VideoHeader';
import SummaryCard from '@/components/SummaryCard';
import BulletSummary from '@/components/BulletSummary';
import KeyPointsGrid from '@/components/KeyPointsGrid';
import TimestampList from '@/components/TimestampList';
import KeywordCloud from '@/components/KeywordCloud';
import TopicClassification from '@/components/TopicClassification';
import SentimentAnalysis from '@/components/SentimentAnalysis';
import TabNavigation from '@/components/TabNavigation';


export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('summary');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isValidUrl, setIsValidUrl] = useState(null);

  const { toasts, addToast, removeToast } = useToast();
  const resultRef = useRef(null);

  // URL validation on change
  useEffect(() => {
    if (url.trim() === '') {
      setIsValidUrl(null);
      return;
    }
    setIsValidUrl(isValidYouTubeUrl(url));
  }, [url]);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress((scrollTop / docHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Loading phase simulation
  useEffect(() => {
    if (!loading) return;
    setLoadingPhase(0);
    const t1 = setTimeout(() => setLoadingPhase(1), 2000);
    const t2 = setTimeout(() => setLoadingPhase(2), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim() || loading) return;

    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      addToast('Invalid YouTube URL', 'error');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setActiveTab('summary');

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to summarize video');
      }

      setResult(data);
      addToast('Video analyzed successfully!', 'success');

      // Scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && isValidYouTubeUrl(text)) {
        setUrl(text);
        addToast('YouTube URL pasted!', 'info');
      }
    } catch (e) {
      // Clipboard permission denied
    }
  };

  const tabCounts = result ? {
    summary: result.bulletSummary?.length || 0,
    keypoints: result.keyPoints?.length || 0,
    timestamps: result.timestamps?.length || 0,
    analysis: (result.keywords?.length || 0) + (result.topics?.length || 0),
  } : {};

  return (
    <>
      {/* Scroll Progress */}
      {result && <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />}

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroGlow} />
          <div className="container">
            <div className={styles.heroContent}>
              <div className={styles.badge}>
                <Sparkles size={14} />
                AI-Powered Video Analysis
              </div>
              <h1 className={styles.title}>
                YouTube Video
                <span className={styles.titleGradient}> Summarizer</span>
              </h1>
              <p className={styles.subtitle}>
                Paste any YouTube link and get instant AI-powered summaries, key points,
                timestamp highlights, sentiment analysis, and more.
              </p>

              {/* URL Input */}
              <form onSubmit={handleSubmit} className={styles.inputWrapper}>
                <div className={`${styles.inputContainer} ${isValidUrl === true ? styles.inputValid : ''} ${isValidUrl === false ? styles.inputInvalid : ''}`}>
                  <Link2 size={20} className={styles.inputIcon} />
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Paste a YouTube URL here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onPaste={handlePaste}
                    disabled={loading}
                    id="youtube-url-input"
                  />
                  {isValidUrl === true && <span className={styles.validCheck}>✓</span>}
                  {isValidUrl === false && <span className={styles.invalidX}>✕</span>}
                </div>
                <button
                  type="submit"
                  className={`btn-primary ${styles.submitBtn}`}
                  disabled={loading || !isValidUrl}
                  id="analyze-button"
                >
                  {loading ? (
                    <span className={styles.loadingDots}>Analyzing</span>
                  ) : (
                    <>
                      Analyze
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <div className="container">
            <div className={styles.error}>
              <AlertTriangle size={20} />
              <div>
                <strong>Error</strong>
                <p>{error}</p>
              </div>
              <button className="btn-ghost" onClick={() => { setError(''); }}>
                <RotateCcw size={14} />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="container">
            <LoadingSkeleton phase={loadingPhase} />
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="container" ref={resultRef}>
            <div className={styles.results}>
              {/* Video Header */}
              <VideoHeader
                data={result}
                contentRef={resultRef}
                onSuccess={() => addToast('PDF downloaded successfully!', 'success')}
              />

              {/* Tab Navigation */}
              <TabNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                counts={tabCounts}
              />

              {/* Tab Content */}
              <div className={styles.tabContent}>
                {activeTab === 'summary' && (
                  <div className={styles.tabPanel}>
                    {result.summary && (
                      <SummaryCard
                        summary={result.summary}
                        onCopy={() => addToast('Summary copied!', 'success')}
                      />
                    )}
                    {result.bulletSummary && result.bulletSummary.length > 0 && (
                      <BulletSummary
                        bullets={result.bulletSummary}
                        onCopy={() => addToast('Bullets copied!', 'success')}
                      />
                    )}
                  </div>
                )}

                {activeTab === 'keypoints' && (
                  <div className={styles.tabPanel}>
                    {result.keyPoints && result.keyPoints.length > 0 && (
                      <KeyPointsGrid keyPoints={result.keyPoints} />
                    )}
                  </div>
                )}

                {activeTab === 'timestamps' && (
                  <div className={styles.tabPanel}>
                    {result.timestamps && result.timestamps.length > 0 && (
                      <TimestampList timestamps={result.timestamps} videoId={result.videoId} />
                    )}
                  </div>
                )}

                {activeTab === 'analysis' && (
                  <div className={styles.tabPanel}>
                    <div className={styles.analysisGrid}>
                      {result.keywords && result.keywords.length > 0 && (
                        <KeywordCloud keywords={result.keywords} />
                      )}
                      <div className={styles.analysisRow}>
                        {result.topics && result.topics.length > 0 && (
                          <TopicClassification topics={result.topics} />
                        )}
                        {result.sentiment && (
                          <SentimentAnalysis sentiment={result.sentiment} />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
