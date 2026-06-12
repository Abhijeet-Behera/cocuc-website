'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2 } from 'lucide-react'
import styles from './MemoryVerses.module.css'

function TiltCard({ children, className }) {
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    // Increased degrees for a significant tilt
    const rotateX = ((y - centerY) / centerY) * -15 
    const rotateY = ((x - centerX) / centerX) * 15
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`)
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
    setIsHovered(false)
  }

  return (
    <div 
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        transform, 
        transition: isHovered ? 'transform 0.1s ease-out, background 0.3s ease, border-color 0.3s ease' : 'transform 0.5s ease-out, background 0.3s ease, border-color 0.3s ease',
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  )
}

export default function MemoryVerses() {
  const [verses, setVerses] = useState(null)
  const [loading, setLoading] = useState(true)
  const [playingId, setPlayingId] = useState(null)
  const audioRef = useRef(null)

  const handlePlayTTS = (id, type, reference, scripture) => {
    // Check if the browser supports Speech Synthesis
    if (!('speechSynthesis' in window)) {
      alert("Sorry, your browser doesn't support text to speech!");
      return;
    }

    if (playingId === id) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any currently playing audio

    setPlayingId(id);
    
    // Replace colon and prepend 'Book of' (e.g., Matthew 5:9 -> Book of Matthew chapter 5 verse 9)
    const readableReference = reference.trim().replace(/^(.+?)\s+(\d+):(\d+.*)$/, 'Book of $1 chapter $2 verse $3');
    const text = `${type}. ${readableReference}. ${scripture}`;
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a male English voice
    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('david') || voice.name.toLowerCase().includes('mark') || voice.name.toLowerCase().includes('guy'))
    );
    
    if (maleVoice) {
      utterance.voice = maleVoice;
    }

    utterance.onend = () => {
      setPlayingId(null);
    };

    utterance.onerror = (e) => {
      console.error("Speech synthesis error", e);
      setPlayingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    async function fetchVerses() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
        const spreadsheetId = process.env.NEXT_PUBLIC_MEMORY_VERSE_SPREADSHEET_ID;

        if (!apiKey || !spreadsheetId) {
          throw new Error("Missing Google Sheets API keys");
        }

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Verses!A2:E?key=${apiKey}`;
        const res = await fetch(url);
        
        if (!res.ok) throw new Error("Failed to fetch from Google");

        const data = await res.json();
        const rows = data.values || [];

        // Today's date in IST for comparison (format: YYYY-MM-DD)
        const now = new Date();
        const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
        const istDate = new Date(utcMs + 330 * 60000);
        const todayStr = istDate.toISOString().split('T')[0];

        let daily = null;
        let weekly = null;
        let monthly = null;

        // Filter rows before or equal to today, sort newest first
        const pastOrTodayRows = rows
          .filter(row => row[1] && row[1] <= todayStr)
          .sort((a, b) => new Date(b[1]) - new Date(a[1])); 

        for (const row of pastOrTodayRows) {
          const type = (row[2] || "").toLowerCase();
          const verseObj = {
            date: row[1],
            type: row[2],
            reference: row[3],
            scripture: row[4]
          };

          if (type === 'daily' && !daily) daily = verseObj;
          if (type === 'weekly' && !weekly) weekly = verseObj;
          if (type === 'monthly' && !monthly) monthly = verseObj;

          if (daily && weekly && monthly) break;
        }

        setVerses({
          daily: daily || { type: "Daily", reference: "Psalm 118:24", scripture: "This is the day that the LORD has made; let us rejoice and be glad in it." },
          weekly: weekly || { type: "Weekly", reference: "Proverbs 3:5-6", scripture: "Trust in the LORD with all your heart, and do not lean on your own understanding." },
          monthly: monthly || { type: "Monthly", reference: "Joshua 1:9", scripture: "Be strong and courageous. Do not be frightened, and do not be dismayed, for the LORD your God is with you wherever you go." }
        });

      } catch (error) {
        console.error('Failed to fetch memory verses:', error);
      } finally {
        setLoading(false)
      }
    }

    fetchVerses()
  }, [])

  if (loading) {
    return (
      <div className={styles.memoryVersesWrapper}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    )
  }

  // Fallback gracefully if no verses found or an error occurred
  if (!verses || verses.error) {
    return null; // Return nothing rather than breaking the UI
  }

  return (
    <div className={styles.memoryVersesWrapper}>
      <div className={styles.versesGrid}>
        
        {/* Daily Verse */}
        {verses.daily && (
          <TiltCard className={styles.verseCard}>
            <div className={styles.verseHeader}>
              <div className={styles.verseTypeContainer}>
                <span className={styles.verseType}>Verse of the Day</span>
                <span title="Click it to read aloud the verse" style={{ display: 'inline-flex' }}>
                  <Volume2 
                    className={playingId === 'daily' ? styles.ttsIconActive : styles.ttsIcon} 
                    onClick={() => handlePlayTTS('daily', 'Verse of the Day', verses.daily.reference, verses.daily.scripture)}
                  />
                </span>
              </div>
              <span className={styles.verseReference}>{verses.daily.reference}</span>
            </div>
            <p className={styles.verseScripture}>"{verses.daily.scripture}"</p>
          </TiltCard>
        )}

        {/* Weekly Verse */}
        {verses.weekly && (
          <TiltCard className={styles.verseCard}>
            <div className={styles.verseHeader}>
              <div className={styles.verseTypeContainer}>
                <span className={styles.verseType}>Verse of the Week</span>
                <span title="Click it to read aloud the verse" style={{ display: 'inline-flex' }}>
                  <Volume2 
                    className={playingId === 'weekly' ? styles.ttsIconActive : styles.ttsIcon} 
                    onClick={() => handlePlayTTS('weekly', 'Verse of the Week', verses.weekly.reference, verses.weekly.scripture)}
                  />
                </span>
              </div>
              <span className={styles.verseReference}>{verses.weekly.reference}</span>
            </div>
            <p className={styles.verseScripture}>"{verses.weekly.scripture}"</p>
          </TiltCard>
        )}

        {/* Monthly Verse */}
        {verses.monthly && (
          <TiltCard className={styles.verseCard}>
            <div className={styles.verseHeader}>
              <div className={styles.verseTypeContainer}>
                <span className={styles.verseType}>Verse of the Month</span>
                <span title="Click it to read aloud the verse" style={{ display: 'inline-flex' }}>
                  <Volume2 
                    className={playingId === 'monthly' ? styles.ttsIconActive : styles.ttsIcon} 
                    onClick={() => handlePlayTTS('monthly', 'Verse of the Month', verses.monthly.reference, verses.monthly.scripture)}
                  />
                </span>
              </div>
              <span className={styles.verseReference}>{verses.monthly.reference}</span>
            </div>
            <p className={styles.verseScripture}>"{verses.monthly.scripture}"</p>
          </TiltCard>
        )}

      </div>
    </div>
  )
}
