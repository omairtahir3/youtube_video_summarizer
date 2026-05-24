import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenAI } from '@google/genai';
import { extractVideoId, getVideoMetadata, formatTimestamp } from '@/utils/youtube';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'Please provide a YouTube URL' }, { status: 400 });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL. Please check the link and try again.' }, { status: 400 });
    }

    // Fetch video metadata
    const metadata = await getVideoMetadata(videoId);

    // Fetch transcript
    let transcriptItems;
    try {
      transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    } catch (err) {
      return NextResponse.json({
        error: 'Could not fetch transcript. This video may not have captions available, or it may be private/age-restricted.',
      }, { status: 422 });
    }

    if (!transcriptItems || transcriptItems.length === 0) {
      return NextResponse.json({ error: 'No transcript found for this video.' }, { status: 422 });
    }

    // Build transcript text with timestamps
    const transcriptText = transcriptItems
      .map((item) => `[${formatTimestamp(item.offset / 1000)}] ${item.text}`)
      .join('\n');

    // Estimate video duration from last transcript item
    const lastItem = transcriptItems[transcriptItems.length - 1];
    const durationSeconds = Math.ceil((lastItem.offset + lastItem.duration) / 1000);
    const duration = formatTimestamp(durationSeconds);

    // Call Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json({ error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in .env.local' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert video content analyst. Analyze the following YouTube video transcript and produce a comprehensive analysis.

Video Title: "${metadata.title}"
Channel: "${metadata.channelName}"
Duration: ${duration}

TRANSCRIPT:
${transcriptText}

Return a JSON object with EXACTLY these fields:

{
  "summary": "A detailed 2-3 paragraph narrative summary of the video content",
  "bulletSummary": ["5-8 concise bullet point summaries of the main content"],
  "keyPoints": [
    {
      "title": "Short title",
      "description": "Detailed description of this key takeaway",
      "importance": "high|medium|low"
    }
  ],
  "timestamps": [
    {
      "time": "MM:SS format",
      "seconds": 123,
      "label": "Short label for this moment",
      "summary": "Brief description of what happens"
    }
  ],
  "keywords": [
    {
      "word": "keyword",
      "relevance": 0.95,
      "category": "Technical|Person|Concept|Tool|Place|Event|Organization"
    }
  ],
  "topics": [
    {
      "name": "Topic Name",
      "confidence": 0.9,
      "description": "Brief description of this topic"
    }
  ],
  "sentiment": {
    "overall": "positive|negative|neutral|mixed",
    "score": 0.7,
    "breakdown": {
      "positive": 60,
      "negative": 10,
      "neutral": 30
    },
    "explanation": "Brief explanation of the sentiment"
  }
}

Rules:
- Include 3-6 key points with varying importance levels
- Include 5-10 timestamp highlights at meaningful moments in the video
- Include 10-15 keywords with relevance scores between 0 and 1
- Include 3-5 topics with confidence scores between 0 and 1
- Sentiment score should be between -1 (very negative) and 1 (very positive)
- Sentiment breakdown percentages should sum to 100
- All timestamps must reference actual moments from the transcript
- Be specific and insightful, not generic`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let analysisResult;
    try {
      const text = response.text;
      analysisResult = JSON.parse(text);
    } catch (parseError) {
      return NextResponse.json({ error: 'Failed to parse AI response. Please try again.' }, { status: 500 });
    }

    // Build final response
    const result = {
      videoTitle: metadata.title,
      channelName: metadata.channelName,
      thumbnailUrl: metadata.thumbnailUrl,
      videoId: videoId,
      duration: duration,
      ...analysisResult,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Summarization error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
