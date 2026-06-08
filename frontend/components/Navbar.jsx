'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null) // tracks which dropdown is open on mobile
  const navRef = useRef(null)
  const pathname = usePathname()

  const isHome = pathname === '/'
  const isNavSolid = !isHome || scrolled || mobileMenuOpen

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)

    // Initial nav animation
    gsap.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const aboutMenu = [
    { name: 'History', href: '/about/history' },
    { name: 'What We Believe', href: '/about/what-we-believe' },
    { name: 'Leadership Team', href: '/about/leadership' },
    { name: 'Secretary’s Corner', href: '#' },
    { name: 'Pastor’s Note', href: '#' },
    { name: 'Celebrations', href: '#' },
    { name: 'Service Timing', href: '/about/service-times' },
    { name: 'Contact Us', href: '#' },
  ]

  const activitiesMenu = [
    { name: 'Satellite Churches', href: '/activities/satellite-churches' },
    { name: 'Sunday Worship', href: '/activities/sunday-worship' },
    { name: 'Sunday School', href: '/activities/sunday-school' },
    { name: 'C.E Union', href: '/activities/ce-union' },
    { name: 'Baptism Classes', href: '/activities/baptism-classes' },
    { name: 'Counselling', href: '/activities/counselling' },
    { name: 'Women’s Fellowship', href: '/activities/womens-fellowship' },
    { name: 'Youth Fellowship', href: '/activities/youth-fellowship' },
  ]

  const prayerMenu = [
    { name: 'Morning Prayer', href: '/prayer/morning-prayer' },
    { name: 'Monday Prayer', href: '/prayer/monday-prayer' },
    { name: 'Thursday Cottage Prayer', href: '/prayer/thursday-cottage-prayer' },
    { name: 'Second Saturday Prayer', href: '/prayer/second-saturday-prayer' },
    { name: 'United Chain Prayer', href: '#' },
  ]

  const eventsMenu = [
    { name: 'Monthly Programme', href: '#' },
    { name: 'Special Announcements', href: '#' },
    { name: 'Speaking Engagements', href: '#' },
    { name: 'Holy Week', href: '#' },
    { name: 'Baptism', href: '#' },
  ]

  const faithMenu = [
    { name: 'Photos', href: '#' },
    { name: 'Inspirational', href: '#' },
    { name: 'Encouraging Quotes', href: '#' },
    { name: 'Promises', href: '#' },
    { name: 'Testimonials', href: '#' },
    { name: 'Amazing Grace', href: '#' },
  ]

  return (
    <nav ref={navRef} className={`${styles.nav} ${isNavSolid ? styles.navScrolled : styles.navTransparent}`}>
      <div className={`container ${styles.container}`}>
        <Link
          href="/"
          className={`${styles.logo} ${isNavSolid ? styles.logoScrolled : styles.logoTransparent}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className={styles.logoWrapper}>
            <Image
              src="/church-logo.png"
              alt="Church of Christ Union Church Bhubaneswar Logo"
              width={48}
              height={48}
              className={styles.logoImage}
              priority
            />
            <div className={styles.logoText}>
              <span className={styles.logoLine1}>Church of Christ</span>
              <span className={styles.logoLine2}>Union Church, Bhubaneswar</span>
            </div>
          </div>
        </Link>

        <button
          className={`${styles.hamburger} ${isNavSolid ? styles.hamburgerScrolled : styles.hamburgerTransparent}`}
          onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setOpenDropdown(null) }}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`${styles.menu} ${mobileMenuOpen ? styles.menuOpen : ''}`}>
          {/* ── Nav links — equally spaced ── */}
          <div className={styles.navLinks}>
            <NavDropdown title="About" items={aboutMenu} scrolled={isNavSolid} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} setMobileMenuOpen={setMobileMenuOpen} />
            <NavLink href="/gallery" scrolled={isNavSolid} onClick={() => setMobileMenuOpen(false)}>Gallery</NavLink>
            <NavDropdown title="Activities" items={activitiesMenu} scrolled={isNavSolid} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} setMobileMenuOpen={setMobileMenuOpen} />
            <NavDropdown title="Prayer Time" items={prayerMenu} scrolled={isNavSolid} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} setMobileMenuOpen={setMobileMenuOpen} />
            <NavDropdown title="Events" items={eventsMenu} scrolled={isNavSolid} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} setMobileMenuOpen={setMobileMenuOpen} />
            <NavDropdown title="Faith & Hope" items={faithMenu} scrolled={isNavSolid} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} setMobileMenuOpen={setMobileMenuOpen} />
            <NavLink href="/blog" scrolled={isNavSolid} onClick={() => setMobileMenuOpen(false)}>Blog</NavLink>
          </div>

          {/* ── Socials + Admin ── */}
          <div className={styles.navActions}>
            <div className={`${styles.socials} ${isNavSolid ? styles.socialsScrolled : styles.socialsTransparent}`}>
              <SocialIcon href="https://www.facebook.com/cocbhubaneswar/" scrolled={isNavSolid} title="Facebook">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.81l.39-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </SocialIcon>
              <SocialIcon href="https://www.instagram.com/cocbbsr/" scrolled={isNavSolid} title="Instagram">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </SocialIcon>
              <SocialIcon href="https://www.youtube.com/channel/UCq_qjpp_LAIrSOS2b69Ka3w" scrolled={isNavSolid} title="YouTube">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </SocialIcon>
            </div>
            <Link href="/admin" className={`btn-primary ${styles.adminBtn} ${isNavSolid ? styles.adminBtnScrolled : styles.adminBtnTransparent}`} onClick={() => setMobileMenuOpen(false)}>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function SocialIcon({ href, children, scrolled, title }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      className={`${styles.socialIcon} ${scrolled ? styles.socialIconScrolled : styles.socialIconTransparent}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </a>
  )
}

function NavLink({ href, children, scrolled, onClick }) {
  return (
    <Link href={href} className={`${styles.navLink} ${scrolled ? styles.navLinkScrolled : styles.navLinkTransparent}`} onClick={onClick}>
      {children}
    </Link>
  )
}

function NavDropdown({ title, items, scrolled, openDropdown, setOpenDropdown, setMobileMenuOpen }) {
  const isMobileOpen = openDropdown === title

  const handleToggle = () => {
    // Toggle: if already open close it, else open this one (closes others)
    setOpenDropdown(isMobileOpen ? null : title)
  }

  return (
    <div className={styles.dropdownContainer}>
      <div
        className={`${styles.dropdownToggle} ${scrolled ? styles.navLinkScrolled : styles.navLinkTransparent}`}
        onClick={handleToggle} /* Mobile: JS accordion toggle */
      >
        {title}
        <span
          className={styles.dropdownChevron}
          style={{ transform: isMobileOpen ? 'rotate(180deg)' : undefined }}
        >▼</span>
      </div>

      <div className={`${styles.dropdownMenu} ${isMobileOpen ? styles.dropdownMenuOpen : ''}`}>
        {items.map((item, i) => (
          <Link key={i} href={item.href} className={styles.dropdownItem}
            onClick={() => { setOpenDropdown(null); if (setMobileMenuOpen) setMobileMenuOpen(false); }} /* Close on link click */
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
