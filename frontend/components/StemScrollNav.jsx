'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

const SECTIONS = [
  { id: 'church-updates',  label: 'Church Updates' },
  { id: 'activities',      label: 'Activity Sections' },
  { id: 'prayer-zones',    label: 'Prayer Zones' },
  { id: 'churches',        label: 'Satellite Churches & Mission Fields', mobileLabel: 'Map' },
  { id: 'sermons',         label: 'Latest Videos' },
  { id: 'upcoming-events', label: 'Upcoming Events' },
  { id: 'blog',            label: 'Blog & Inspiration' },
  { id: 'testimonies',     label: 'Share Your Testimony' },
  { id: 'donate',          label: 'Tithes/Offerings' },
];

const STEM_X  = 22;
const PAD_TOP = 140; // clears navbar and some extra space
const PAD_BOT = 70; // clears footer area

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

function solveBezierT(Y0, Y2, cy, yTarget) {
  const A = Y0 - 2 * cy + Y2;
  const B = 2 * (cy - Y0);
  const C = Y0 - yTarget;
  
  if (Math.abs(A) < 1e-5) return -C / B;
  
  const delta = B * B - 4 * A * C;
  if (delta < 0) return (yTarget - Y0) / (Y2 - Y0);
  
  const sqrtDelta = Math.sqrt(delta);
  const t1 = (-B + sqrtDelta) / (2 * A);
  const t2 = (-B - sqrtDelta) / (2 * A);
  
  if (t1 >= 0 && t1 <= 1) return t1;
  if (t2 >= 0 && t2 <= 1) return t2;
  
  return (yTarget - Y0) / (Y2 - Y0);
}

// ── Desktop Implementation (Original Physics Stem) ───────────────────────────
function DesktopStemNav({ activeIndex, inBounds, isIdle, mouseXRef, mouseYRef, velRef, setIsHovered }) {
  const pathRef      = useRef(null);
  const fillPathRef  = useRef(null);
  const glowRef      = useRef(null);
  const circleRefs   = useRef([]);
  const glowRingRefs = useRef([]);
  const labelRefs    = useRef([]);

  const ctrlX      = useRef(STEM_X);
  const ctrlY      = useRef(400);
  const rafId      = useRef(null);
  const activeIdxR = useRef(0);

  useEffect(() => { activeIdxR.current = activeIndex; }, [activeIndex]);

  useEffect(() => {
    let alive = true;

    const tick = () => {
      if (!alive) return;
      rafId.current = requestAnimationFrame(tick);

      const vh  = window.innerHeight;
      const top = PAD_TOP;
      const bot = vh - PAD_BOT;
      const mid = (top + bot) / 2;

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

      const fullD = `M ${STEM_X} ${top} Q ${cx} ${cy} ${STEM_X} ${bot}`;
      pathRef.current?.setAttribute('d', fullD);
      glowRef.current?.setAttribute('d', fullD);

      const ai      = activeIdxR.current;
      const aDotY   = getDotY(ai, vh);
      const tActive = solveBezierT(top, bot, cy, aDotY);
      const aMidY   = cy * tActive + top * (1 - tActive);
      const aMidX   = cx * tActive + STEM_X * (1 - tActive);
      const activePt = qBez(P0, P1, P2, tActive);
      const fillD = `M ${STEM_X} ${top} Q ${aMidX} ${aMidY} ${activePt.x} ${activePt.y}`;
      fillPathRef.current?.setAttribute('d', fillD);

      SECTIONS.forEach((_, i) => {
        const dotY = getDotY(i, vh);
        const t    = solveBezierT(top, bot, cy, dotY);
        const pt   = qBez(P0, P1, P2, t);

        circleRefs.current[i]?.setAttribute('cx',   String(pt.x));
        circleRefs.current[i]?.setAttribute('cy',   String(dotY));
        glowRingRefs.current[i]?.setAttribute('cx', String(pt.x));
        glowRingRefs.current[i]?.setAttribute('cy', String(dotY));

        const lbl = labelRefs.current[i];
        if (lbl) {
          lbl.style.top  = `${dotY}px`;
          lbl.style.left = `${pt.x + 18}px`;
        }
      });
    };

    rafId.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(rafId.current); };
  }, [mouseXRef, mouseYRef, velRef]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const initVh = typeof window !== 'undefined' ? window.innerHeight : 700;
  const visible = inBounds && !isIdle;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="stem-nav"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
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
          <svg style={{ position: 'absolute', inset: 0, width: '270px', height: '100%', overflow: 'visible' }}>
            <path ref={glowRef} fill="none" stroke="rgba(128,0,0,0.07)" strokeWidth="18" strokeLinecap="round" />
            <path ref={pathRef} fill="none" stroke="rgba(128,0,0,0.18)" strokeWidth="2.5" strokeLinecap="round" />
            <path ref={fillPathRef} fill="none" stroke="rgba(128,0,0,0.90)" strokeWidth="2.5" strokeLinecap="round" />
            {SECTIONS.map((section, i) => {
              const isActive = activeIndex === i;
              const initY    = getDotY(i, initVh);
              return (
                <g key={section.id}>
                  <circle
                    ref={el => (glowRingRefs.current[i] = el)}
                    cx={STEM_X} cy={initY}
                    r={isActive ? 14 : 0}
                    fill="rgba(128,0,0,0.11)"
                    style={{ transition: 'r 0.35s ease' }}
                  />
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
                  top: initY,
                  left: STEM_X + 18,
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  userSelect: 'none',
                  zIndex: 10,
                  display: 'grid',
                  alignItems: 'center',
                  justifyItems: 'start',
                }}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      key="pill"
                      initial={{ opacity: 0, scale: 0.85, x: -8 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.85, x: -8 }}
                      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                      style={{
                        gridArea: '1 / 1',
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
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(128,0,0,1)', flexShrink: 0 }} />
                      {section.label}
                    </motion.span>
                  )}
                  {!isActive && (
                    <motion.span
                      key="inactive"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="stem-inactive"
                      style={{
                        gridArea: '1 / 1',
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
  );
}

// ── Mobile Implementation (OnePlus Style Sidebar) ─────────────────────────────
function MobileSidebarNav({ activeIndex, inBounds, isIdle, setIsIdle, isHovered, setIsHovered }) {
  const [pendingIndex, setPendingIndex] = useState(null);
  const isOpen = !isIdle && inBounds;

  useEffect(() => {
    if (!isOpen) setPendingIndex(null);
  }, [isOpen]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleItemClick = (index) => {
    setPendingIndex(index);
    scrollToSection(SECTIONS[index].id);
    setTimeout(() => setIsIdle(true), 100); // Very small delay for instant feedback but faster closing
  };

  const openSidebar = () => setIsIdle(false);

  return (
    <>
      <AnimatePresence>
        {inBounds && isIdle && (
          <motion.div
            key="mobile-sidebar-handle"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: '30%',
              left: 0,
              width: 12,
              height: 80,
              background: 'rgba(128, 0, 0, 0.45)',
              borderTopRightRadius: 15,
              borderBottomRightRadius: 15,
              zIndex: 9000,
              cursor: 'grab',
              touchAction: 'none',
              boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
            }}
            onClick={openSidebar}
            onPanEnd={(e, info) => {
              if (info.offset.x > 10) openSidebar();
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9000,
              background: 'transparent',
              touchAction: 'none'
            }}
            onClick={() => setIsIdle(true)}
            onTouchStart={() => setIsIdle(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-sidebar-expanded"
            initial={{ x: '-100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: 210,
              height: '100dvh',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 100%)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 9001,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingLeft: 4
            }}
            onPanEnd={(e, info) => {
              if (info.offset.x < -20) setIsIdle(true);
            }}
          >
            {/* The vertical stem line */}
            <div style={{
              position: 'absolute',
              left: 12,
              top: '15%',
              bottom: '15%',
              width: 2,
              background: 'rgba(128,0,0,0.12)',
              borderRadius: 2
            }} />
            
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '4.5vh' }}>
              {SECTIONS.map((sec, i) => {
                const isActive = (pendingIndex !== null) ? (pendingIndex === i) : (activeIndex === i);
                return (
                  <motion.div 
                    key={sec.id} 
                    style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer', zIndex: 10 }}
                    whileTap={{ scale: 0.9, opacity: 0.7 }}
                    onClick={(e) => { e.stopPropagation(); handleItemClick(i); }}
                    onPointerDown={(e) => { e.stopPropagation(); handleItemClick(i); }}
                  >
                    {/* The node on the stem */}
                    <div style={{
                      position: 'absolute',
                      left: 8 - (isActive ? 4 : 3),
                      width: isActive ? 10 : 8,
                      height: isActive ? 10 : 8,
                      borderRadius: '50%',
                      background: isActive ? 'var(--color-primary)' : 'rgba(128,0,0,0.3)',
                      transition: 'all 0.3s ease',
                      zIndex: 2,
                      boxShadow: isActive ? '0 0 8px rgba(128,0,0,0.4)' : 'none'
                    }} />

                    {/* The branch (stair) */}
                    <div style={{
                      position: 'absolute',
                      left: 8,
                      width: 16,
                      height: isActive ? 2 : 1,
                      background: isActive ? 'var(--color-primary)' : 'rgba(128,0,0,0.15)',
                      transition: 'all 0.3s ease',
                      zIndex: 1
                    }} />

                    {/* The label */}
                    <div style={{
                      marginLeft: 32,
                      padding: '8px 14px',
                      background: isActive ? 'rgba(255,255,255,0.95)' : 'transparent',
                      border: isActive ? '1.5px solid rgba(128,0,0,0.2)' : '1px solid transparent',
                      borderRadius: 20,
                      color: isActive ? 'var(--color-primary)' : 'rgba(128,0,0,0.5)',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-heading)',
                      boxShadow: isActive ? '0 4px 12px rgba(128,0,0,0.08)' : 'none',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'normal',
                      lineHeight: 1.2,
                      maxWidth: '180px'
                    }}>
                      {sec.mobileLabel || sec.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Main Component (Switches based on screen width) ────────────────────────
export default function StemScrollNav() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [inBounds,    setInBounds]    = useState(false);
  const [isIdle,      setIsIdle]      = useState(false);
  const [isHovered,   setIsHovered]   = useState(false);
  const [isMobile,    setIsMobile]    = useState(false);
  const [mounted,     setMounted]     = useState(false);

  const mouseXRef = useRef(900);
  const mouseYRef = useRef(400);
  const velRef    = useRef(0);
  const prevSY    = useRef(0);
  const prevST    = useRef(Date.now());
  const idleTmo   = useRef(null);

  useEffect(() => {
    setMounted(true);
    const mql = window.matchMedia('(max-width: 900px)');
    setIsMobile(mql.matches);
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const check = () => {
      const hero   = document.getElementById('hero');
      const last   = document.getElementById('donate');
      const footer = document.querySelector('footer');
      if (!hero || !last) return;

      const heroBot   = hero.getBoundingClientRect().bottom;
      const lastBot   = last.getBoundingClientRect().bottom;
      const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;

      const show = heroBot < 150 && lastBot > 0 && footerTop > window.innerHeight - 50;
      setInBounds(show);
    };

    window.addEventListener('scroll', check, { passive: true });
    check();
    return () => window.removeEventListener('scroll', check);
  }, []);

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

  useEffect(() => {
    const resetIdle = () => {
      setIsIdle(false);
      clearTimeout(idleTmo.current);
      if (!isHovered) {
        idleTmo.current = setTimeout(() => setIsIdle(true), 1000);
      }
    };

    if (isHovered) {
      resetIdle();
    }

    const onMove = (e) => {
      mouseXRef.current = e.clientX;
      mouseYRef.current = e.clientY;
    };

    const onScroll = () => {
      const now = Date.now();
      const dy  = window.scrollY - prevSY.current;
      const dt  = Math.max(now - prevST.current, 1);
      velRef.current   = (dy / dt) * 1000;
      prevSY.current   = window.scrollY;
      prevST.current   = now;
      
      // On mobile, scrolling the page should NOT open the sidebar
      if (!isMobile) {
        resetIdle();
      }
    };

    window.addEventListener('mousemove',  onMove,   { passive: true });
    window.addEventListener('scroll',     onScroll, { passive: true });
    
    // Initial start
    if (!isMobile) {
      resetIdle();
    } else {
      setIsIdle(true); // Ensure it starts collapsed on mobile
    }

    return () => {
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('scroll',     onScroll);
      clearTimeout(idleTmo.current);
    };
  }, [isHovered, isMobile]);

  if (!mounted) return null;

  return createPortal(
    <>
      {isMobile ? (
        <MobileSidebarNav 
          activeIndex={activeIndex} 
          inBounds={inBounds} 
          isIdle={isIdle} 
          setIsIdle={setIsIdle}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
        />
      ) : (
        <DesktopStemNav 
          activeIndex={activeIndex} 
          inBounds={inBounds} 
          isIdle={isIdle} 
          mouseXRef={mouseXRef}
          mouseYRef={mouseYRef}
          velRef={velRef}
          setIsHovered={setIsHovered}
        />
      )}
      <style>{`
        .stem-inactive { transition: color 0.2s, font-weight 0.2s; }
        .stem-inactive:hover { color: rgba(128,0,0,0.85) !important; font-weight: 600 !important; }
        @media (max-width: 900px) { .stem-inactive { display: none !important; } }
      `}</style>
    </>,
    document.body
  );
}
