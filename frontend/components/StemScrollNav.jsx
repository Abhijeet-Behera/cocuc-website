'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SECTIONS = [
  { id: 'church-updates',  label: 'Church Updates' },
  { id: 'activities',      label: 'Activity Sections' },
  { id: 'prayer-zones',    label: 'Prayer Zones' },
  { id: 'churches',        label: 'Satellite Churches & Mission Fields' },
  { id: 'sermons',         label: 'Latest Videos' },
  { id: 'upcoming-events', label: 'Upcoming Events' },
  { id: 'blog',            label: 'Blog & Inspiration' },
  { id: 'testimonies',     label: 'Share Your Testimony' },
];

const STEM_X  = 22;
const PAD_TOP = 140; // clears navbar and some extra space
const PAD_BOT = 120; // clears footer area

function qBez(p0, p1, p2, t) {
  const m = 1 - t;
  return {
    x: m * m * p0.x + 2 * m * t * p1.x + t * t * p2.x,
    y: m * m * p0.y + 2 * m * t * p1.y + t * t * p2.y,
  };
}

function getDotY(index, vh) {
  return PAD_TOP + (index / (SECTIONS.length - 1)) * (vh - PAD_TOP - PAD_BOT);
}

export default function StemScrollNav() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [inBounds,    setInBounds]    = useState(false);
  const [isIdle,      setIsIdle]      = useState(false);
  const [mounted,     setMounted]     = useState(false);

  useEffect(() => { setMounted(true); }, []); // mouse-idle for 3s

  // DOM refs for direct RAF mutation
  const pathRef      = useRef(null);
  const fillPathRef  = useRef(null);
  const glowRef      = useRef(null);
  const circleRefs   = useRef([]);
  const glowRingRefs = useRef([]);
  const labelRefs    = useRef([]);

  // Physics refs
  const ctrlX      = useRef(STEM_X);
  const ctrlY      = useRef(400);
  const mouseXRef  = useRef(900);
  const mouseYRef  = useRef(400);
  const velRef     = useRef(0);
  const prevSY     = useRef(0);
  const prevST     = useRef(Date.now());
  const rafId      = useRef(null);
  const idleTmo    = useRef(null);
  const activeIdxR = useRef(0);

  useEffect(() => { activeIdxR.current = activeIndex; }, [activeIndex]);

  // ── Boundary detection: show nav only when content area is on screen ─────────
  useEffect(() => {
    const check = () => {
      const hero   = document.getElementById('hero');
      const last   = document.getElementById('testimonies');
      const footer = document.querySelector('footer');
      if (!hero || !last) return;

      const heroBot   = hero.getBoundingClientRect().bottom;
      const lastBot   = last.getBoundingClientRect().bottom;
      const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;

      // Show when: hero scrolled past navbar AND footer not yet fully visible
      const show = heroBot < 150 && lastBot > 0 && footerTop > window.innerHeight - 50;
      setInBounds(show);
    };

    window.addEventListener('scroll', check, { passive: true });
    check();
    return () => window.removeEventListener('scroll', check);
  }, []);

  // ── Active section observer ──────────────────────────────────────────────────
  useEffect(() => {
    const visible = new Map();
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
        else visible.delete(e.target.id);
      });
      let best = null, bestR = 0;
      visible.forEach((r, id) => { if (r > bestR) { bestR = r; best = id; } });
      if (best) {
        const idx = SECTIONS.findIndex(s => s.id === best);
        if (idx >= 0) setActiveIndex(idx);
      }
    }, { rootMargin: '-15% 0px -35% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // ── Mouse / scroll → idle detection ─────────────────────────────────────────
  useEffect(() => {
    const resetIdle = () => {
      setIsIdle(false);
      clearTimeout(idleTmo.current);
      idleTmo.current = setTimeout(() => setIsIdle(true), 3000);
    };

    const onMove = (e) => {
      mouseXRef.current = e.clientX;
      mouseYRef.current = e.clientY;
      resetIdle();
    };

    const onScroll = () => {
      const now = Date.now();
      const dy  = window.scrollY - prevSY.current;
      const dt  = Math.max(now - prevST.current, 1);
      velRef.current   = (dy / dt) * 1000;
      prevSY.current   = window.scrollY;
      prevST.current   = now;
      resetIdle();
    };

    window.addEventListener('mousemove', onMove,   { passive: true });
    window.addEventListener('scroll',    onScroll,  { passive: true });
    idleTmo.current = setTimeout(() => setIsIdle(true), 3000);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll',    onScroll);
      clearTimeout(idleTmo.current);
    };
  }, []);

  // ── RAF: physics + direct DOM mutation (60fps, zero React re-renders) ────────
  useEffect(() => {
    let alive = true;

    const tick = () => {
      if (!alive) return;
      rafId.current = requestAnimationFrame(tick);

      const vh  = window.innerHeight;
      const top = PAD_TOP;
      const bot = vh - PAD_BOT;
      const mid = (top + bot) / 2;

      // Physics: control point target
      let tCx = STEM_X;
      let tCy = mid;

      if (mouseXRef.current < 380) {
        const f = Math.pow(1 - mouseXRef.current / 380, 1.5);
        tCx = STEM_X + f * 85;
        tCy = mouseYRef.current * 0.75 + mid * 0.25;
      }

      const vf = Math.min(Math.max(velRef.current / 1400, -1), 1);
      tCy += vf * (bot - top) * 0.18;
      tCy  = Math.min(Math.max(tCy, top + 55), bot - 55);

      ctrlX.current += (tCx - ctrlX.current) * 0.09;
      ctrlY.current += (tCy - ctrlY.current) * 0.09;

      const cx = ctrlX.current;
      const cy = ctrlY.current;
      const P0 = { x: STEM_X, y: top };
      const P1 = { x: cx,     y: cy  };
      const P2 = { x: STEM_X, y: bot };

      // Full stem (faint track)
      const fullD = `M ${STEM_X} ${top} Q ${cx} ${cy} ${STEM_X} ${bot}`;
      pathRef.current?.setAttribute('d', fullD);
      glowRef.current?.setAttribute('d', fullD);

      // Progress fill up to active dot
      const ai      = activeIdxR.current;
      const aDotY   = getDotY(ai, vh);
      const tActive = (aDotY - top) / (bot - top);
      const aMid    = cy * tActive + top * (1 - tActive);
      const activePt = qBez(P0, P1, P2, tActive);
      const fillD = `M ${STEM_X} ${top} Q ${cx} ${aMid} ${activePt.x} ${activePt.y}`;
      fillPathRef.current?.setAttribute('d', fillD);

      // Dots + labels
      SECTIONS.forEach((_, i) => {
        const dotY = getDotY(i, vh);
        const t    = (dotY - top) / (bot - top);
        const pt   = qBez(P0, P1, P2, t);

        circleRefs.current[i]?.setAttribute('cx',   String(pt.x));
        circleRefs.current[i]?.setAttribute('cy',   String(pt.y));
        glowRingRefs.current[i]?.setAttribute('cx', String(pt.x));
        glowRingRefs.current[i]?.setAttribute('cy', String(pt.y));

        const lbl = labelRefs.current[i];
        if (lbl) {
          lbl.style.top  = `${pt.y}px`;
          lbl.style.left = `${pt.x + 18}px`;
        }
      });
    };

    rafId.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(rafId.current); };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100; // 100px offset for navbar
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const initVh = typeof window !== 'undefined' ? window.innerHeight : 700;
  const visible = inBounds && !isIdle;

  if (!mounted) return null;

  return createPortal(
    <>
      {/* position: fixed — always in viewport, clipped by inBounds check */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="stem-nav"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              top: 0, left: 0,
              height: '100vh',
              width: '270px',
              zIndex: 9000,
              pointerEvents: 'none',
            }}
          >
            {/* SVG: glow + track + fill + dots */}
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '270px',
                height: '100%',
                overflow: 'visible',
              }}
            >
              {/* Soft glow */}
              <path
                ref={glowRef}
                fill="none"
                stroke="rgba(128,0,0,0.07)"
                strokeWidth="18"
                strokeLinecap="round"
              />
              {/* Full track (faint grey) */}
              <path
                ref={pathRef}
                fill="none"
                stroke="rgba(128,0,0,0.18)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Progress fill (vivid red up to active) */}
              <path
                ref={fillPathRef}
                fill="none"
                stroke="rgba(128,0,0,0.90)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {SECTIONS.map((section, i) => {
                const isActive = activeIndex === i;
                const initY    = getDotY(i, initVh);
                return (
                  <g key={section.id}>
                    {/* Active glow ring */}
                    <circle
                      ref={el => (glowRingRefs.current[i] = el)}
                      cx={STEM_X} cy={initY}
                      r={isActive ? 14 : 0}
                      fill="rgba(128,0,0,0.11)"
                      style={{ transition: 'r 0.35s ease' }}
                    />
                    {/* Dot */}
                    <circle
                      ref={el => (circleRefs.current[i] = el)}
                      cx={STEM_X} cy={initY}
                      r={isActive ? 6 : 4}
                      fill={isActive ? 'rgba(128,0,0,1)' : 'rgba(128,0,0,0.30)'}
                      style={{
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                        transition: 'r 0.3s ease, fill 0.3s ease',
                        filter: isActive ? 'drop-shadow(0 0 6px rgba(128,0,0,0.65))' : 'none',
                      }}
                      onClick={() => scrollTo(section.id)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Labels — ALL always visible */}
            {SECTIONS.map((section, i) => {
              const isActive = activeIndex === i;
              const initY    = getDotY(i, initVh);
              return (
                <div
                  key={section.id}
                  ref={el => (labelRefs.current[i] = el)}
                  onClick={() => scrollTo(section.id)}
                  style={{
                    position: 'absolute',
                    top:       initY,
                    left:      STEM_X + 18,
                    transform: 'translateY(-50%)',
                    cursor:    'pointer',
                    pointerEvents: 'auto',
                    userSelect:    'none',
                    zIndex: 10,
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <motion.span
                        key="pill"
                        initial={{ opacity: 0, scale: 0.85, x: -8 }}
                        animate={{ opacity: 1, scale: 1,    x: 0  }}
                        exit={{    opacity: 0, scale: 0.85, x: -8 }}
                        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '7px',
                          padding: '5px 14px',
                          background: 'rgba(255,255,255,0.96)',
                          backdropFilter: 'blur(16px)',
                          WebkitBackdropFilter: 'blur(16px)',
                          border: '1.5px solid rgba(128,0,0,0.22)',
                          borderRadius: '30px',
                          boxShadow: '0 4px 20px rgba(128,0,0,0.15)',
                          color: 'rgba(128,0,0,1)',
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.80rem',
                          fontWeight: 700,
                          letterSpacing: '0.025em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: 'rgba(128,0,0,1)', flexShrink: 0,
                        }} />
                        {section.label}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="inactive"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{    opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="stem-inactive"
                        style={{
                          color: 'rgba(128,0,0,0.58)',
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.73rem',
                          fontWeight: 400,
                          letterSpacing: '0.018em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {section.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .stem-inactive {
          transition: color 0.2s, font-weight 0.2s;
        }
        .stem-inactive:hover {
          color: rgba(128,0,0,0.85) !important;
          font-weight: 600 !important;
        }
        @media (max-width: 900px) {
          .stem-inactive { display: none !important; }
        }
      `}</style>
    </>,
    document.body
  );
}
