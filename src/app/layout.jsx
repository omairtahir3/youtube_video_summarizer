import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata = {
  title: 'YouTube Video Summarizer — AI-Powered Video Analysis',
  description: 'Paste a YouTube link and get an AI-powered summary with key points, timestamps, sentiment analysis, topic classification, and keyword extraction. Export as PDF.',
  openGraph: {
    title: 'YouTube Video Summarizer',
    description: 'AI-powered YouTube video analysis and summarization tool.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
