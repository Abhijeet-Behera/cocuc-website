'use client';

import { Play, Info, Lock } from 'lucide-react';
import styles from './AazadiQuizAd.module.css';

export default function AazadiQuizAd() {
  // Toggle this to true when the quiz goes live
  const isLive = true;

  return (
    <section className={`section ${styles.quizSection}`}>
      <div className={`container ${styles.quizContainer}`}>

        {/* Animated Background Wrapper */}
        <div className={styles.bgWrapper}>
          <div className={styles.bgGlow1}></div>
          <div className={styles.bgGlow2}></div>
          <div className={styles.bgPattern}></div>
        </div>
        
        <div className={styles.textContent}>
          <span className={styles.tagline}>Game Time</span>
          <h2 className={styles.title}>
            Aazadi <span className={styles.titleAccent}>Quiz Game</span>
          </h2>
          <p className={styles.description}>
            Ready for some fun? Play our interactive Aazadi quiz game to refresh your mind and compete on the live leaderboard!
          </p>
          
          <div className={styles.actions}>
            <a 
              href="https://churchquiz-join.onrender.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.playButton}
            >
              <Play size={18} fill="currentColor" />
              <span>Play Now</span>
            </a>
{/*             
            <a 
              href="#" 
              className={styles.aboutButton}
              onClick={(e) => e.preventDefault()}
            >
              <Info size={18} />
              <span>About</span>
            </a> */}
          </div>
        </div>
        
        <div className={styles.visualContent}>
          <div className={styles.decorativeBox}>
            <div className={styles.floatingElement}>?</div>
            <div className={styles.floatingElement2}>!</div>
          </div>
        </div>

        {/* Coming Soon Overlay */}
        {!isLive && (
          <div className={styles.comingSoonOverlayWrapper}>
            <div className={styles.comingSoonBlurBox}>
              <div className={styles.lockIconWrapper}>
                <Lock size={40} />
              </div>
              <h3 className={styles.comingSoonText}>Will be LIVE soon</h3>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
