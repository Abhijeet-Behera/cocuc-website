import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

    if (!API_KEY || !CHANNEL_ID || API_KEY === 'your_youtube_api_key_here') {
      // Return empty array if not configured to prevent crashes during dev without keys
      return NextResponse.json([], { status: 200 })
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&type=video&order=date&maxResults=5&key=${API_KEY}`
    
    const response = await fetch(url)
    const data = await response.json()

    if (data.error) {
      console.error('YouTube API Error:', data.error)
      return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
    }

    const videos = data.items.map(item => ({
      video_id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail_url: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      published_at: item.snippet.publishedAt,
      watch_url: `https://youtube.com/watch?v=${item.id.videoId}`
    }))

    return NextResponse.json(videos, { status: 200 })
  } catch (error) {
    console.error('Error in YouTube feed:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
