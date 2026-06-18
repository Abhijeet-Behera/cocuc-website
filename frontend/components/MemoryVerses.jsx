'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2 } from 'lucide-react'
import styles from './MemoryVerses.module.css'

function TiltCard({ children, className, isActive }) {
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

  // Calculate the final transform to apply
  let appliedTransform = transform;
  if (!isHovered && isActive) {
    // Keep it zoomed in when active but not hovered
    appliedTransform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1.02, 1.02, 1.02)';
  }

  return (
    <div 
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        transform: appliedTransform, 
        transition: (isHovered || isActive) ? 'transform 0.1s ease-out, background 0.3s ease, border-color 0.3s ease' : 'transform 0.5s ease-out, background 0.3s ease, border-color 0.3s ease',
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
    
    // Format reference for clear and professional reading
    let processedReference = reference.trim();
    // Replace dashes with ' to ' for verse ranges
    processedReference = processedReference.replace(/-|–/g, ' to ');
    
    let finalReference = processedReference;
    const refMatch = processedReference.match(/^(.+?)\s+(\d+):(\d+.*)$/);
    
    if (refMatch) {
      let book = refMatch[1];
      const chapter = refMatch[2];
      const verses = refMatch[3];
      
      const verseWord = verses.includes(' to ') ? 'verses' : 'verse';
      
      // Fix numbered books
      if (book.startsWith('1 ')) book = book.replace('1 ', 'First ');
      else if (book.startsWith('2 ')) book = book.replace('2 ', 'Second ');
      else if (book.startsWith('3 ')) book = book.replace('3 ', 'Third ');
      
      if (book.toLowerCase() === 'psalm' || book.toLowerCase() === 'psalms') {
        finalReference = `Psalm ${chapter}, ${verseWord} ${verses}`;
      } else {
        finalReference = `the Book of ${book}, chapter ${chapter}, ${verseWord} ${verses}`;
      }
    } else {
      if (finalReference.startsWith('1 ')) finalReference = finalReference.replace('1 ', 'First ');
      else if (finalReference.startsWith('2 ')) finalReference = finalReference.replace('2 ', 'Second ');
      else if (finalReference.startsWith('3 ')) finalReference = finalReference.replace('3 ', 'Third ');
    }

    // Create a complete, professional, and smooth sentence
    const text = `${type}. It is taken from ${finalReference}. ${scripture} Amen.`;
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice properties for professional reading
    utterance.rate = 0.85; // Slightly slower for better comprehension and professional tone
    utterance.pitch = 1.0;
    
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
      setPlayingId(currentId => currentId === id ? null : currentId);
    };

    utterance.onerror = (e) => {
      // 'canceled' or 'interrupted' is expected when another verse is clicked
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.error("Speech synthesis error:", e.error, e);
      }
      setPlayingId(currentId => currentId === id ? null : currentId);
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
          <TiltCard 
            className={`${styles.verseCard} ${playingId === 'daily' ? styles.verseCardActive : ''}`}
            isActive={playingId === 'daily'}
          >
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
          <TiltCard 
            className={`${styles.verseCard} ${playingId === 'weekly' ? styles.verseCardActive : ''}`}
            isActive={playingId === 'weekly'}
          >
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
          <TiltCard 
            className={`${styles.verseCard} ${playingId === 'monthly' ? styles.verseCardActive : ''}`}
            isActive={playingId === 'monthly'}
          >
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
