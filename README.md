# 🎥 YouTube Video Summarizer

An AI-powered web application built with Next.js and React that delivers instant video summaries, key takeaways, clickable timestamp highlights, topic classification, and sentiment analysis. Fully styled with a premium glassmorphic dark mode UI.

![Aesthetics Showcase](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop)

---

## ✨ Features

- **📝 High-Quality Summaries:** Detailed narrative breakdown and checkable key bullet points.
- **💡 Key Takeaways Grid:** Grouped takeaways categorized by importance level (High, Medium, Low).
- **⏱️ Clickable Timestamps:** Staggered chronological timelines linking directly to the precise seconds on YouTube.
- **📊 Sentiment & Topic Classification:**
  - Interactive conic-gradient donut charts representing positive, negative, and neutral sentiments.
  - Animated horizontal bar charts representing classified topics.
  - Interactive keyword clouds colored by categories.
- **📄 Premium PDF Exporter:** Generate and download a beautifully formatted multi-page PDF of your summaries with a single click.
- **🎨 Glassmorphic Interface:** Smooth CSS micro-animations, loading skeletons, responsive tabs, custom scrollbars, and toast notifications.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Library:** React 19
- **AI Integration:** `@google/genai` (direct Google Gemini SDK integration)
- **YouTube Services:** `youtube-transcript` (for captions parsing) and oEmbed metadata.
- **PDF Generation:** `jspdf` & `html2canvas` (with dynamic client-side loading)
- **Styling:** Vanilla CSS with Custom Properties (variables) and CSS Modules
- **Icons:** `lucide-react`

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or later)
- npm or yarn
- A Google Gemini API Key (Get one for free at [Google AI Studio](https://aistudio.google.com/))

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/omairtahir3/youtube_video_summarizer.git
   cd youtube_video_summarizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root directory:
   ```bash
   # .env.local
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Replace `your_gemini_api_key_here` with your actual Google Gemini API key.*

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   [http://localhost:3000](http://localhost:3000)

---

## 📸 Project Screenshots

### Desktop Dashboard
A clean workspace displaying tabbed results for summary, takeaways, timelines, and visual analysis.

### PDF Notes Export
Generate structured offline notes immediately with a clicking of the PDF Exporter button on the video header.

---

## 🔒 License

Distributed under the MIT License. See `LICENSE` for more information.
