import { NextResponse } from 'next/server'
import { VIDEO_SECTIONS } from '@/lib/youtubeConfig'

/**
 * Given a raw playlistItems API response, return the first valid public video.
 * Ignores deleted/private/unavailable items.
 */
function extractLatestVideo(data) {
  if (!data.items) return null
  for (const item of data.items) {
    const snippet = item.snippet
    // Skip items that YouTube marks as private/deleted
    if (!snippet || snippet.title === 'Private video' || snippet.title === 'Deleted video') continue
    const videoId = snippet.resourceId?.videoId
    if (!videoId) continue
    const thumbs = snippet.thumbnails || {}
    const thumbnail =
      thumbs.maxres?.url ||
      thumbs.high?.url ||
      thumbs.medium?.url ||
      thumbs.default?.url ||
      null
    return {
      videoId,
      title: snippet.title,
      thumbnail,
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    }
  }
  return null
}

export async function GET() {
  const API_KEY = process.env.YOUTUBE_API_KEY

  if (!API_KEY || API_KEY === 'your_youtube_api_key_here') {
    console.warn('[latest-videos] YOUTUBE_API_KEY is not configured.')
    // Return empty result objects so UI can show fallback gracefully
    const empty = VIDEO_SECTIONS.map((s) => ({
      key: s.key,
      playlistId: s.playlistId,
      video: null,
      error: 'API key not configured',
    }))
    return NextResponse.json(empty, { status: 200 })
  }

  const results = await Promise.allSettled(
    VIDEO_SECTIONS.map(async (section) => {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${section.playlistId}&maxResults=10&key=${API_KEY}`
      const res = await fetch(url, { next: { revalidate: 3600 } }) // Cache 1 hr
      const data = await res.json()

      if (data.error) {
        console.error(`[latest-videos] YouTube API error for ${section.key}:`, data.error.message)
        return { key: section.key, playlistId: section.playlistId, video: null, error: data.error.message }
      }

      const video = extractLatestVideo(data)
      return { key: section.key, playlistId: section.playlistId, video, error: null }
    })
  )

  const payload = results.map((r, i) => {
    if (r.status === 'fulfilled') return r.value
    return {
      key: VIDEO_SECTIONS[i].key,
      playlistId: VIDEO_SECTIONS[i].playlistId,
      video: null,
      error: r.reason?.message || 'Unknown error',
    }
  })

  return NextResponse.json(payload, { status: 200 })
}
