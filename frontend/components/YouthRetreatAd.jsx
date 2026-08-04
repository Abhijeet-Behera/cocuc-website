'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  X, 
  Calendar, 
  Clock, 
  Ticket, 
  PhoneCall, 
  CheckCircle2, 
  BookOpen,
  HelpCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import styles from './YouthRetreatAd.module.css';

export default function YouthRetreatAd() {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0); // 0: Overview, 1: Invitation & Contact
  const [mounted, setMounted] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:8000'
      : '/backend');

  // Always attach developer helper to window on render so it is globally available in console anytime
  if (typeof window !== 'undefined') {
    window.resetRetreatAd = () => {
      localStorage.removeItem('youth_retreat_2026_registered');
      fetch(`${API_URL}/retreat_registration.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      }).catch(() => {});
      setIsOpen(true);
      setShowThankYou(false);
      setShowQuestion(false);
      console.log('Youth Retreat Ad reset and un-registered from server for testing!');
    };
  }

  useEffect(() => {
    setMounted(true);

    const checkRegistrationStatus = async () => {
      try {
        // 1. Quick client-side check
        const clientRegistered = localStorage.getItem('youth_retreat_2026_registered');
        if (clientRegistered === 'true') {
          return;
        }

        // 2. Server-side IP address check via PHP backend with 2s timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(`${API_URL}/retreat_registration.php`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data.registered || !data.showAd) {
            // IP address is already registered; do not show ad
            return;
          }
        }

        // Neither local storage nor IP is registered -> Show the announcement!
        setIsOpen(true);
      } catch (err) {
        // If API fails or times out, fallback: show ad if client storage not set
        const clientRegistered = localStorage.getItem('youth_retreat_2026_registered');
        if (clientRegistered !== 'true') {
          setIsOpen(true);
        }
      }
    };

    checkRegistrationStatus();
  }, [API_URL]);

  // Lock scrolling on both body and documentElement while the popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  // Trigger celebratory green poppers confetti burst
  const triggerGreenPoppers = () => {
    try {
      // Main center emerald/gold burst
      confetti({
        particleCount: 95,
        spread: 85,
        origin: { y: 0.58 },
        colors: ['#10b981', '#059669', '#34d399', '#800000', '#fbbf24', '#ffffff']
      });
      // Left side burst
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0.12, y: 0.65 },
          colors: ['#10b981', '#059669', '#fbbf24']
        });
      }, 100);
      // Right side burst
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 0.88, y: 0.65 },
          colors: ['#10b981', '#059669', '#fbbf24']
        });
      }, 200);
    } catch {
      // Silently ignore if confetti fails
    }
  };

  // When user clicks 'Yes, I have registered' -> Trigger Green Poppers instantly (0ms latency) & save IP asynchronously
  const handleRegistered = () => {
    // 1. Immediately switch to Thank You screen & trigger Green Poppers without any network wait!
    setShowQuestion(false);
    setShowThankYou(true);
    triggerGreenPoppers();

    // 2. Save registration in localStorage & on server in the background
    localStorage.setItem('youth_retreat_2026_registered', 'true');
    fetch(`${API_URL}/retreat_registration.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'register' }),
    }).catch(() => {});

    // 3. Snappily auto-close after 2.2 seconds
    setTimeout(() => {
      setIsOpen(false);
      setShowThankYou(false);
    }, 2200);
  };

  // When user clicks 'No, remind me later' -> Close modal without saving IP (shows again on next visit/refresh)
  const handleRemindLater = () => {
    setIsOpen(false);
    setShowQuestion(false);
  };

  // When clicking Cross button (X) or backdrop -> Show the 2-Option Twist Confirmation
  const handleRequestClose = () => {
    if (showThankYou) {
      setIsOpen(false);
      setShowThankYou(false);
    } else {
      setShowQuestion(true);
    }
  };

  if (!mounted || typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="retreat-ad-backdrop"
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleRequestClose();
            }
          }}
        >
          <motion.div
            key="retreat-ad-modal"
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.9, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 290 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Union Church Youth Retreat 2026 Announcement"
          >
            {/* Left Column: Larger Aazadi Poster Visible on PC (object-fit: contain) */}
            <div className={styles.posterColumn}>
              <img
                src="/images/Aazadi_Poster.jpeg"
                alt="Aazadi - Union Church Youth Retreat 2026 Poster"
                className={styles.posterImage}
              />
            </div>

            {/* Right Column: Dynamic Carousel Content, 2-Option Twist & Thank You Screen */}
            <div className={styles.contentColumn}>
              {/* Top-Right Cross Close Icon */}
              <button
                type="button"
                className={styles.closeBtn}
                onClick={handleRequestClose}
                aria-label="Close Announcement"
                title="Close Announcement"
              >
                <X size={20} />
              </button>

              {showThankYou ? (
                // ====================================================================
                // FORMAL THANK YOU SCREEN (WITH GREEN POPPERS BURST)
                // ====================================================================
                <div className={styles.thankYouContainer}>
                  <div className={styles.thankYouIconBox}>
                    <CheckCircle2 size={36} />
                  </div>
                  <span className={styles.tagline}>
                    REGISTRATION CONFIRMED
                  </span>
                  <h3 className={styles.thankYouHeading}>
                    Thank You for Registering
                  </h3>
                  <p className={styles.thankYouMessage}>
                    Thank you for registering for Youth Retreat 2026 &apos;Aazadi&apos;. We look forward to a blessed time of spiritual freedom and fellowship with you.
                  </p>

                  <button
                    type="button"
                    className={styles.closeThankYouBtn}
                    onClick={() => {
                      setIsOpen(false);
                      setShowThankYou(false);
                    }}
                  >
                    Close Announcement
                  </button>
                </div>
              ) : !showQuestion ? (
                // ====================================================================
                // MANUAL CAROUSEL PAGES (NO "Yes/Remind" options visible here!)
                // ====================================================================
                <div className={styles.slideContent}>
                  {currentSlide === 0 ? (
                    // -------------------------------------------------------------
                    // SLIDE 0: OVERVIEW & ESSENTIAL HIGHLIGHTS
                    // -------------------------------------------------------------
                    <motion.div
                      key="slide-0"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <div>
                          <span className={styles.tagline}>
                            Union Church Youth Retreat • 2026
                          </span>
                          <h2 className={styles.title}>
                            AAZADI <span className={styles.titleAccent}>(Freedom)</span>
                          </h2>
                        </div>

                        <div className={styles.verseBadge}>
                          <BookOpen size={16} />
                          <span>
                            Theme Verse: <strong>Galatians 5:1</strong>
                          </span>
                        </div>

                        <div className={styles.infoGrid}>
                          <div className={styles.infoCard}>
                            <span className={styles.infoLabel}>Retreat Date</span>
                            <div className={styles.infoValue}>
                              <Calendar size={17} style={{ color: '#800000' }} />
                              <span>15th August 2026</span>
                            </div>
                            <span className={styles.infoSub}>Mark your calendar</span>
                          </div>

                          <div className={`${styles.infoCard} ${styles.infoCardAlert}`}>
                            <span className={styles.infoLabel}>Last Date to Register</span>
                            <div className={styles.infoValue}>
                              <Clock size={17} style={{ color: '#b91c1c' }} />
                              <span>10th August 2026</span>
                            </div>
                            <span className={styles.infoSub}>
                              After 10th Aug: <strong>₹200</strong>
                            </span>
                          </div>
                        </div>

                        <div className={styles.infoCard}>
                          <span className={styles.infoLabel}>Registration Fee</span>
                          <div className={styles.infoValue}>
                            <Ticket size={17} style={{ color: '#800000' }} />
                            <span>₹100 per person</span>
                          </div>
                          <span className={styles.infoSub}>
                            Includes breakfast, lunch &amp; evening snacks
                          </span>
                        </div>

                        <div className={styles.contactCard}>
                          <div className={styles.contactText}>
                            <span className={styles.contactTitle}>Registrations &amp; Queries</span>
                            <span className={styles.contactSubtitle}>Tap number to call directly</span>
                          </div>
                          <a
                            href="tel:7656852269"
                            className={styles.phoneLink}
                            title="Call 7656852269"
                          >
                            <PhoneCall size={16} />
                            <span>7656852269</span>
                          </a>
                        </div>
                      </div>

                      {/* Arrow Carousel Footer Controls (No confusing red dots) */}
                      <div className={styles.carouselFooter}>
                        <span className={styles.pageIndicator}>
                          Page 1 of 2
                        </span>

                        <button
                          type="button"
                          className={styles.navButton}
                          onClick={() => setCurrentSlide(1)}
                        >
                          <span>Next: Invitation &amp; Contact</span>
                          <ArrowRight size={17} />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    // -------------------------------------------------------------
                    // SLIDE 1: INVITATION TEXT, FEE DETAILS & DIRECT CALL CTA
                    // -------------------------------------------------------------
                    <motion.div
                      key="slide-1"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                        <div>
                          <span className={styles.tagline}>
                            Invitation &amp; Contact Details
                          </span>
                          <h2 className={styles.title} style={{ fontSize: '1.65rem' }}>
                            Be a Part of This Special Retreat
                          </h2>
                        </div>

                        <p className={styles.invitationParagraph}>
                          We warmly encourage every one of you to join us to grow spiritually, strengthen your relationship with God, and enjoy meaningful fellowship with fellow believers. <strong>Please invite your friends</strong>{' '}so that they too may experience God&apos;s blessings!
                        </p>

                        <div className={styles.feeBox}>
                          <div className={styles.feeRow}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                              <Ticket size={16} style={{ color: '#800000' }} />
                              Registration Fee:
                            </span>
                            <strong>₹100 / person</strong>
                          </div>
                          <div className={styles.feeRowAlert}>
                            After 10th August fee will be ₹200 per person
                          </div>
                        </div>

                        <div className={styles.contactCard}>
                          <div className={styles.contactText}>
                            <span className={styles.contactTitle}>Registrations &amp; Queries</span>
                            <span className={styles.contactSubtitle}>Tap number to call directly</span>
                          </div>
                          <a
                            href="tel:7656852269"
                            className={styles.phoneLink}
                            title="Call 7656852269"
                          >
                            <PhoneCall size={16} />
                            <span>7656852269</span>
                          </a>
                        </div>
                      </div>

                      {/* Arrow Carousel Footer Controls (No confusing red dots) */}
                      <div className={styles.carouselFooter}>
                        <button
                          type="button"
                          className={`${styles.navButton} ${styles.navButtonSecondary}`}
                          onClick={() => setCurrentSlide(0)}
                        >
                          <ArrowLeft size={17} />
                          <span>Back to Overview</span>
                        </button>

                        <span className={styles.pageIndicator}>
                          Page 2 of 2
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                // ====================================================================
                // VIEW 2: THE TWIST (APPEARS ONLY AFTER CLICKING CROSS ICON)
                // ====================================================================
                <div className={styles.questionContainer}>
                  <div className={styles.questionIconBox}>
                    <HelpCircle size={32} />
                  </div>
                  <h3 className={styles.questionHeading}>
                    Before You Close...
                  </h3>
                  <p className={styles.questionSubtext}>
                    Have you already registered for the <strong>Union Church Youth Retreat 2026</strong>?
                  </p>

                  <div className={styles.questionButtons}>
                    <button
                      type="button"
                      className={styles.btnYes}
                      onClick={handleRegistered}
                      disabled={isRegistering}
                    >
                      <CheckCircle2 size={19} />
                      <span>Yes, I have registered</span>
                    </button>

                    <button
                      type="button"
                      className={styles.btnNo}
                      onClick={handleRemindLater}
                    >
                      <Clock size={17} />
                      <span>Remind me later</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
