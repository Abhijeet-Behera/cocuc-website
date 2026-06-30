"use client";

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import styles from './Footer.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    // Refresh ScrollTrigger after a slight delay to allow page transitions to finish
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Animate columns fading in sequentially
      gsap.fromTo(
        '.gsap-footer-col',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
          },
        }
      );

      // Animate the bottom footer bar
      gsap.fromTo(
        '.gsap-footer-bottom',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          delay: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, { scope: footerRef });

  return (
    <footer className={styles.footer} ref={footerRef}>
      <div className={styles.footerContainer}>

        {/* Column 1: Brand & About */}
        <div className={`${styles.footerCol} gsap-footer-col`}>
          <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <Image
              src="/church-logo.png"
              alt="Church Logo"
              width={42}
              height={42}
              style={{ borderRadius: '50%', objectFit: 'contain', backgroundColor: 'white', padding: '2px' }}
            />
            <h2 className={styles.footerBrand} style={{ marginBottom: 0 }}>Church of Christ</h2>
          </Link>
          <p className={styles.footerText}>
            Welcome to Church of Christ (Union Church), Bhubaneswar. Join us for worship, inspiring sermons, and a loving community dedicated to Christ.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className={`${styles.footerCol} gsap-footer-col`}>
          <h3 className={styles.colTitle}>Quick Links</h3>
          <ul className={styles.footerList}>
            <li><Link href="/" className={styles.footerLink} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</Link></li>
            <li><Link href="/about" className={styles.footerLink}>About Us</Link></li>

            <li><Link href="/about/service-times" className={styles.footerLink}>Timings</Link></li>

            <li><Link href="/contact-us" className={styles.footerLink}>Contact Us</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div className={`${styles.footerCol} gsap-footer-col`}>
          <h3 className={styles.colTitle}>Contact Us</h3>
          <ul className={styles.footerList}>
            <li className={styles.contactItem}>
              <Phone size={18} className={styles.contactIcon} />
              <div>
                <span>General:<br/><a href="tel:+919437400283" style={{color: 'inherit', textDecoration: 'none'}}>(+91) 9437400283</a></span><br/>
                <span style={{ display: 'block', marginTop: '0.3rem' }}>
                  Prayer:<br/><a href="tel:+919437418423" style={{color: 'inherit', textDecoration: 'none'}}>(+91) 9437418423</a><br/><a href="tel:+919437284415" style={{color: 'inherit', textDecoration: 'none'}}>(+91) 9437284415</a>
                </span>
              </div>
            </li>
            <li className={styles.contactItem} style={{ marginTop: '0.5rem' }}>
              <Mail size={18} className={styles.contactIcon} />
              <div>
                <span><a href="mailto:pastor@unionchurch.in" style={{color: 'inherit', textDecoration: 'none'}}>pastor@unionchurch.in</a></span><br/>
                <span style={{ display: 'block', marginTop: '0.3rem', wordBreak: 'break-word' }}>
                  <a href="mailto:secretary@unionchurch.org.in" style={{color: 'inherit', textDecoration: 'none'}}>secretary@unionchurch.org.in</a>
                </span>
              </div>
            </li>
          </ul>
        </div>

        {/* Column 4: Address */}
        <div className={`${styles.footerCol} gsap-footer-col`}>
          <h3 className={styles.colTitle}>Visit Us</h3>
          <ul className={styles.footerList}>
            <li className={styles.contactItem}>
              <MapPin size={18} className={styles.contactIcon} />
              <div>
                <span>Lokseva Marg, Unit-4</span><br />
                <span>PO Box 751001</span><br />
                <span>Bhubaneswar, Odisha, India</span>
                <div>
                  <a
                    href="https://www.google.com/maps/place/Union+Church,+Unit+4+Main+St,+Unit+4,+Bhouma+Nagar,+Bhubaneswar,+Odisha+751001/@20.2761087,85.8342424,18z/data=!4m6!3m5!1s0x3a19a7594579150b:0x23298f0ac9cae304!8m2!3d20.2764338!4d85.833986!16s%2Fg%2F11b8tb49mb?entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mapLink}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <span>Locate on map</span>
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar: Copyright & Legal */}
      <div className="container">
        <div className={`${styles.footerBottom} gsap-footer-bottom`}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} Church of Christ (Union Church), Bhubaneswar. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <Link href="/privacy-policy" className={styles.legalLink}>Privacy Policy</Link>
            <Link href="/terms-of-service" className={styles.legalLink}>Terms of Service</Link>
            <Link href="/disclaimer" className={styles.legalLink}>Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
