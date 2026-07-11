'use client'
import { useState, useEffect, Fragment } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import styles from './SpeakingArrangements.module.css'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const SUB_SECTIONS = [
  {
    key: 'sunday_worship',
    label: 'Sunday Worship',
    //icon: '☀',
    queryKeys: ['sunday_worship', 'Sunday Worships', 'Sunday Worship Schedule'],
  },
  {
    key: 'morning_prayer',
    label: 'Morning Prayer',
    //icon: '🌅',
    queryKeys: ['morning_prayer', 'Morning prayer', 'Morning Prayer'],
  },
  {
    key: 'monday_prayer',
    label: 'Monday Prayer',
    //icon: '🙏',
    queryKeys: ['monday_prayer', 'Monday Prayer'],
  },

  {
    key: 'ce_union',
    label: 'CE Union',
    //icon: '✝️',
    queryKeys: ['ce_union', 'CE Union', 'C.E Union', 'Christian Endeavour Union'],
  },
  {
    key: 'bible_study',
    label: 'Wednesday Bible Study',
    //icon: '📖',
    queryKeys: ['bible_study', 'Wednesday Prayer', 'Wednesday Bible Study', 'WEDNESDAY BIBLE STUDY'],
  },
  {
    key: 'evening_zoom_prayer',
    label: 'Evening Zoom Prayer',
    //icon: '💻',
    queryKeys: ['evening_zoom_prayer', 'Zoom Prayer', 'Evening Zoom Prayer'],
  },
  {
    key: 'quarterly_prayer',
    label: 'Quarterly Prayer',
    //icon: '🗓️',
    queryKeys: ['quarterly_prayer', 'Quarterly Prayer', 'Quarterly Prayer Week'],
  },
]

const defaultPrograms = {
  morning_prayer: [
    { item: 'Opening Prayer, Singing & Worship', duration: '15 Minutes' },
    { item: 'Sharing from God’s Word', duration: '15 Minutes' },
    { item: 'Sharing Prayer Points & Prayer', duration: '25 Minutes' },
    { item: 'Closing Prayer & Benediction', duration: '5 Minutes' },
  ],
  monday_prayer: [
    { item: 'Opening Prayer, Singing & Worship', duration: '20 Minutes' },
    { item: 'Sharing from God’s Word', duration: '15 Minutes' },
    { item: 'Sharing Prayer Points & Prayer', duration: '20 Minutes' },
    { item: 'Closing Prayer & Benediction', duration: '5 Minutes' },
  ],
  evening_zoom_prayer: [
    { item: 'Welcome & Opening Prayer', duration: '5 Minutes' },
    { item: 'Worship / Singing', duration: '10 Minutes' },
    { item: 'Devotional Talk', duration: '15 Minutes' },
    { item: 'Prayer & Intercession', duration: '25 Minutes' },
    { item: 'The Lord’s Prayer & Benediction', duration: '5 Minutes' },
  ],
  quarterly_prayer: [
    { item: 'Opening Prayer, Singing & Worship', duration: '20 Minutes' },
    { item: 'Sharing from God’s Word', duration: '20 Minutes' },
    { item: 'Sharing Thanks / Praise & Prayer Points followed by Closing Prayer & Benediction', duration: '20 Minutes' },
  ],
}

const ui = {
  tabs: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '12px',
    margin: '0 0 34px',
  },
  tab: {
    border: '1px solid #ead4d4',
    background: '#fff7f7',
    color: '#990000',
    padding: '12px 18px',
    borderRadius: '999px',
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    background: '#990000',
    color: '#ffffff',
    borderColor: '#990000',
    boxShadow: '0 10px 24px rgba(153, 0, 0, 0.18)',
  },
  scheduleBox: {
    background: '#ffffff',
    border: '1px solid #eadada',
    borderRadius: '22px',
    padding: '26px',
    boxShadow: '0 16px 45px rgba(90, 0, 0, 0.08)',
    marginBottom: '34px',
  },
  sectionTop: {
    textAlign: 'center',
    marginBottom: '22px',
  },
  sectionTitle: {
    margin: 0,
    color: '#990000',
    fontSize: '30px',
    fontWeight: 900,
  },
  sectionSubTitle: {
    margin: '8px 0 0',
    color: '#555555',
    fontSize: '15px',
    lineHeight: 1.5,
  },
  tableScroll: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    minWidth: '850px',
    borderCollapse: 'collapse',
    border: '1px solid #eadada',
    background: '#ffffff',
  },
  th: {
    background: '#990000',
    color: '#ffffff',
    padding: '14px 13px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: 800,
    border: '1px solid #b53b3b',
    verticalAlign: 'middle',
  },
  thSmall: {
    display: 'block',
    marginTop: '4px',
    fontSize: '12px',
    fontWeight: 600,
    opacity: 0.9,
  },
  td: {
    padding: '13px',
    color: '#222222',
    border: '1px solid #f0dddd',
    verticalAlign: 'top',
    lineHeight: 1.45,
  },
  monthRow: {
    background: '#fff2f2',
    color: '#990000',
    padding: '11px 13px',
    fontWeight: 900,
    border: '1px solid #eadada',
    textAlign: 'center',
  },


  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '12px',
    marginBottom: '22px',
  },
  infoCard: {
    background: '#fff7f7',
    border: '1px solid #eadada',
    borderRadius: '16px',
    padding: '14px 16px',
  },
  infoLabel: {
    display: 'block',
    color: '#990000',
    fontSize: '12px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '5px',
  },
  infoValue: {
    color: '#222222',
    fontWeight: 800,
  },
  specialBadge: {
    display: 'inline-block',
    background: '#fff0d9',
    color: '#8a4d00',
    border: '1px solid #f0c37a',
    borderRadius: '999px',
    padding: '5px 10px',
    fontSize: '13px',
    fontWeight: 900,
  },
  noteBox: {
    marginTop: '20px',
    background: '#fffaf0',
    border: '1px solid #f1d99a',
    borderRadius: '16px',
    padding: '16px',
    color: '#4d3a00',
    lineHeight: 1.6,
    fontWeight: 600,
  },
}

export default function SpeakingArrangementsPage() {
  const [activeSection, setActiveSection] = useState('sunday_worship')
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')

    function updateMobileView() {
      setIsMobile(mediaQuery.matches)
    }

    updateMobileView()
    mediaQuery.addEventListener('change', updateMobileView)

    return () => {
      mediaQuery.removeEventListener('change', updateMobileView)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadSchedules() {
      const section = SUB_SECTIONS.find((item) => item.key === activeSection)

      if (!section) return

      setLoading(true)
      setError(null)
      setItems([])
      setMeta({})

      try {
        let finalItems = []
        let finalMeta = {}

        for (const queryKey of section.queryKeys) {
          const response = await fetch(
            `${API_URL}/speaking_schedules.php?sub_section=${encodeURIComponent(queryKey)}`
          )

          if (!response.ok) continue

          const result = await response.json()
          const normalized = normalizeApiResponse(result)
          const upcomingItems = getUpcomingItems(normalized.items)

          finalItems = upcomingItems
          finalMeta = normalized.meta

          if (upcomingItems.length > 0) break
        }

        if (!cancelled) {
          setItems(finalItems)
          setMeta(finalMeta)
        }
      } catch (err) {
        console.error('Failed to load speaking schedules', err)

        if (!cancelled) {
          setError(err.message)
          setItems([])
          setMeta({})
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadSchedules()

    return () => {
      cancelled = true
    }
  }, [activeSection])

  const activeSectionData = SUB_SECTIONS.find((section) => section.key === activeSection)

  return (
    <main className={styles.page}>
      <div className={styles.heroWrapper}>
        <PageHeader
          category="Speaking Arrangements"
          title={
            <>
              <span className={styles.heroTitleMain}>Speaking </span>
              <span className={styles.heroTitleAccent}>Arrangements</span>
            </>
          }
          description="View church speaking schedules across all services and prayer meetings."
        />

        {/*<Link href="/" className={styles.heroBackLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>*/}
      </div>

      <div className={styles.container}>

        <div
          style={
            isMobile
              ? {
                width: '100%',
                overflowX: 'auto',
                overflowY: 'hidden',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-x',
                overscrollBehaviorX: 'contain',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                margin: '0 0 34px',
              }
              : undefined
          }
        >
          <motion.section
            aria-label="Speaking arrangement sections"
            style={{
              ...ui.tabs,
              ...(isMobile
                ? {
                  flexWrap: 'nowrap',
                  justifyContent: 'flex-start',
                  width: 'max-content',
                  minWidth: 'max-content',
                  margin: 0,
                  padding: '0 16px 8px',
                }
                : {}),
            }}
          >
            {SUB_SECTIONS.map((section) => (
              <motion.button
                key={section.key}
                type="button"
                onClick={() => setActiveSection(section.key)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                animate={{
                  scale: activeSection === section.key ? 1.04 : 1,
                }}
                transition={{
                  duration: 0.2,
                  ease: 'easeOut',
                }}
                style={{
                  ...ui.tab,
                  ...(activeSection === section.key ? ui.activeTab : {}),
                  ...(isMobile
                    ? {
                      flex: '0 0 auto',
                      whiteSpace: 'nowrap',
                    }
                    : {}),
                }}
              >
                <span aria-hidden="true" style={{ marginRight: 8 }}>
                  {section.icon}
                </span>
                <span>{section.label}</span>
              </motion.button>
            ))}
          </motion.section>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.98 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {loading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner} />
                <p>Loading schedule…</p>
              </div>
            ) : error ? (
              <div className={styles.errorState}>
                <p>Unable to load schedules. Please try again later.</p>
              </div>
            ) : items.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>✦</div>
                <div className={styles.emptyTitle}>No upcoming schedule available</div>
                <div className={styles.emptyText}>
                  No upcoming schedule has been published for {activeSectionData?.label || 'this section'}.
                </div>
              </div>
            ) : (
              <ScheduleRenderer section={activeSection} items={items} meta={meta} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}

function ScheduleRenderer({ section, items, meta }) {
  if (section === 'sunday_worship') {
    return <SundayWorshipTable items={items} />
  }

  if (section === 'morning_prayer') {
    return <MorningPrayerTable items={items} meta={meta} />
  }

  if (section === 'monday_prayer') {
    return <MondayPrayerTable items={items} meta={meta} />
  }

  if (section === 'prayer_wings') {
    return <PrayerWingsTable items={items} meta={meta} />
  }

  if (section === 'ce_union') {
    return <CEUnionTable items={items} meta={meta} />
  }

  if (section === 'bible_study') {
    return <BibleStudyTable items={items} meta={meta} />
  }

  if (section === 'evening_zoom_prayer') {
    return <EveningZoomPrayerTable items={items} meta={meta} />
  }

  if (section === 'quarterly_prayer') {
    return <QuarterlyPrayerTable items={items} meta={meta} />
  }

  return null
}

function SundayWorshipTable({ items }) {
  return (
    <section style={ui.scheduleBox}>
      <SectionHeader
        title="Sunday Worship Schedule"
        subtitle="Church of Christ, Union Church, Bhubaneswar"
      />

      <div style={ui.tableScroll}>
        <table style={ui.table}>
          <thead>
            <tr>
              <TableHead>Date</TableHead>
              <TableHead>
                English Worship
                <span style={ui.thSmall}>10:00 AM</span>
              </TableHead>
              <TableHead>
                Odia Worship
                <span style={ui.thSmall}>04:00 PM</span>
              </TableHead>
              <TableHead>
                C. S. Pur Worship
                <span style={ui.thSmall}>10:00 AM</span>
              </TableHead>
              <TableHead>
                Kalinga Vihar Worship
                <span style={ui.thSmall}>10:00 AM</span>
              </TableHead>
              <TableHead>
                Sundarpada Worship
                <span style={ui.thSmall}>10:00 AM</span>
              </TableHead>
            </tr>
          </thead>

          <tbody>
            {renderGroupedRows(items, 6, (item) => {
              const data = getItemData(item)

              return (
                <tr key={item.id || getDateValue(item)}>
                  <TableCell>{formatDate(getDateValue(item))}</TableCell>
                  <TableCell>{show(getValue(data, ['english', 'english_worship', 'englishWorship', 'English Worship']))}</TableCell>
                  <TableCell>{show(getValue(data, ['odia', 'odia_worship', 'odiaWorship', 'Odia Worship']))}</TableCell>
                  <TableCell>{show(getValue(data, ['cspur', 'cs_pur_worship', 'csPurWorship', 'c_s_pur_worship', 'C. S. Pur Worship']))}</TableCell>
                  <TableCell>{show(getValue(data, ['kalingavihar', 'kalinga_vihar_worship', 'kalingaViharWorship', 'Kalinga Vihar Worship']))}</TableCell>
                  <TableCell>{show(getValue(data, ['sundarpada', 'sundarpada_worship', 'sundarpadaWorship', 'Sundarpada Worship']))}</TableCell>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function MorningPrayerTable({ items, meta }) {
  const zoomId = getMetaValue(meta, items, ['zoom_id', 'meeting_id', 'zoomId', 'Meeting ID']) || '218382 5185'
  const passcode = getMetaValue(meta, items, ['passcode', 'pass_code', 'Passcode']) || '12345'

  return (
    <section style={ui.scheduleBox}>
      <SectionHeader
        title="Morning Prayer List"
        subtitle="From 07:00 to 08:00 AM, Every Day Except Sunday"
      />

      <MorningPrayerGreeting />


      <InfoGrid
        items={[
          { label: 'Time', value: '07:00 AM – 08:00 AM' },
          { label: 'Meeting ID', value: zoomId },
          { label: 'Passcode', value: passcode },
        ]}
      />

      <div style={ui.tableScroll}>
        <table style={ui.table}>
          <thead>
            <tr>
              <TableHead>Date</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Presiding By</TableHead>
              <TableHead>Speaker</TableHead>
            </tr>
          </thead>

          <tbody>
            {renderGroupedRows(items, 4, (item) => {
              const data = getItemData(item)
              const speaker = getValue(data, ['speaker', 'Speaker'])
              const isSpecial = /prayer time|testimony time/i.test(speaker || '')

              return (
                <tr key={item.id || getDateValue(item)}>
                  <TableCell>{formatDate(getDateValue(item))}</TableCell>
                  <TableCell>{show(getValue(data, ['day', 'day_name', 'Day']) || item.day_name)}</TableCell>
                  <TableCell>{show(getValue(data, ['presiding_by', 'presidingBy', 'Presiding By', 'PRESIDING BY']))}</TableCell>
                  <TableCell>
                    {isSpecial ? (
                      <span style={ui.specialBadge}>{speaker}</span>
                    ) : (
                      show(speaker)
                    )}
                  </TableCell>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ProgramSchedule
        title="Simple Schedule"
        program={getProgram(meta, items, 'morning_prayer')}
      />
    </section>
  )
}

function MondayPrayerTable({ items, meta }) {
  const zoomId = getMetaValue(meta, items, ['zoom_id', 'meeting_id', 'zoomId', 'Zoom ID']) || '2183825185'
  const passcode = getMetaValue(meta, items, ['passcode', 'pass_code', 'Passcode']) || '12345'

  return (
    <section style={ui.scheduleBox}>
      <SectionHeader
        title="Monday Prayer"
        subtitle="COCUC, Bhubaneswar"
      />

      <MondayPrayerGreeting />

      <InfoGrid
        items={[
          { label: 'Day & Time', value: 'Monday, 07:00 PM – 08:00 PM' },
          { label: 'Zoom ID', value: zoomId },
          { label: 'Passcode', value: passcode },
        ]}
      />

      <div style={ui.tableScroll}>
        <table style={ui.table}>
          <thead>
            <tr>
              <TableHead>Date</TableHead>
              <TableHead>Presided By</TableHead>
              <TableHead>Message By</TableHead>
              <TableHead>Singing & Worship Led By</TableHead>
              <TableHead>Participating Prayer Zones</TableHead>
            </tr>
          </thead>

          <tbody>
            {renderGroupedRows(items, 5, (item) => {
              const data = getItemData(item)

              return (
                <tr key={item.id || getDateValue(item)}>
                  <TableCell>{formatDate(getDateValue(item))}</TableCell>

                  <TableCell>
                    {show(getValue(data, [
                      'presided',
                      'presided_by',
                      'presidedBy',
                      'Presided By',
                      'Presided By:'
                    ]))}
                  </TableCell>

                  <TableCell>
                    {show(getValue(data, [
                      'message',
                      'message_by',
                      'messageBy',
                      'Message By',
                      'Message By:'
                    ]))}
                  </TableCell>

                  <TableCell>
                    {show(getValue(data, [
                      'worship',
                      'worshipby',
                      'worship_by',
                      'worshipled',
                      'worship_led',
                      'worshipledby',
                      'worship_led_by',
                      'worshiplead',
                      'worship_lead',
                      'worshipleadby',
                      'worship_lead_by',
                      'worshipleader',
                      'worship_leader',
                      'ledby',
                      'led_by',
                      'singing',
                      'singingby',
                      'singing_by',
                      'singingledby',
                      'singing_led_by',
                      'singingworship',
                      'singing_worship',
                      'singingworshipby',
                      'singing_worship_by',
                      'singingworshipled',
                      'singing_worship_led',
                      'singingworshipledby',
                      'singing_worship_led_by',
                      'singingworshipleadby',
                      'singing_worship_lead_by',
                      'singingandworship',
                      'singing_and_worship',
                      'singingandworshipled',
                      'singing_and_worship_led',
                      'singingandworshipledby',
                      'singing_and_worship_led_by',
                      'Singing & Worship Led By',
                      'Singing & Worship Led By:',
                      'Singing Worship Led By',
                      'Singing Worship Led By:'
                    ]))}
                  </TableCell>

                  <TableCell>
                    {show(getValue(data, [
                      'zones',
                      'prayer_zones',
                      'participating_zones',
                      'participating_prayer_zones',
                      'Participating Prayer Zones',
                      'Participating Prayer Zones:'
                    ]))}
                  </TableCell>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ProgramSchedule
        title="Simple Schedule"
        program={getProgram(meta, items, 'monday_prayer')}
      />
    </section>
  )
}


function PrayerWingsTable({ items }) {
  return (
    <section style={ui.scheduleBox}>
      <SectionHeader
        title="Prayer Wings"
        subtitle="Church of Christ, Union Church, Bhubaneswar"
      />

      <div style={ui.tableScroll}>
        <table style={ui.table}>
          <thead>
            <tr>
              <TableHead>Date</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Title / Focus</TableHead>
              <TableHead>Leader / Speaker</TableHead>
              <TableHead>Details</TableHead>
            </tr>
          </thead>

          <tbody>
            {renderGroupedRows(items, 5, (item) => {
              const data = getItemData(item)

              return (
                <tr key={item.id || getDateValue(item)}>
                  <TableCell>{formatDate(getDateValue(item))}</TableCell>
                  <TableCell>{show(getValue(data, ['day', 'day_name', 'Day']) || item.day_name)}</TableCell>
                  <TableCell>{show(getValue(data, ['title', 'focus', 'topic', 'prayer_focus', 'Title', 'Focus', 'Topic']))}</TableCell>
                  <TableCell>{show(getValue(data, ['leader', 'speaker', 'presiding', 'presiding_by', 'Leader', 'Speaker', 'Presiding']))}</TableCell>
                  <TableCell>{show(getValue(data, ['details', 'description', 'note', 'notes', 'Details', 'Description', 'Note']))}</TableCell>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function CEUnionTable({ items }) {
  return (
    <section style={ui.scheduleBox}>
      <SectionHeader
        title="CE Union Schedule"
        subtitle="Christian Endeavour Union, Church of Christ, Union Church, Bhubaneswar"
      />

      <div style={ui.tableScroll}>
        <table style={ui.table}>
          <colgroup>
            <col style={{ width: '14%' }} />
            <col style={{ width: '24%' }} />
            <col style={{ width: '42%' }} />
            <col style={{ width: '20%' }} />
          </colgroup>

          <thead>
            <tr>
              <TableHead>Date</TableHead>
              <TableHead>Speaker</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Presiding</TableHead>
            </tr>
          </thead>

          <tbody>
            {renderGroupedRows(items, 4, (item) => {
              const data = getItemData(item)

              return (
                <tr key={item.id || getDateValue(item)}>
                  <TableCell>{formatDate(getDateValue(item))}</TableCell>
                  <TableCell>{show(getValue(data, ['speaker', 'Speaker']))}</TableCell>
                  <TableCell>{show(getValue(data, ['topic', 'Topic']))}</TableCell>
                  <TableCell>{show(getValue(data, ['presiding', 'presiding_by', 'presided_by', 'Presiding', 'PRESIDING']))}</TableCell>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function QuarterlyPrayerTable({ items, meta }) {
  const timing = getMetaValue(meta, items, ['timing', 'time', 'header', 'Timing']) || 'Every day at 07:00 PM'

  return (
    <section style={ui.scheduleBox}>
      <SectionHeader
        title="Quarterly Prayer Week"
        subtitle="COCUC, Bhubaneswar"
      />

      <QuarterlyPrayerGreeting />

      <InfoGrid
        items={[
          { label: 'Timing', value: timing },
        ]}
      />

      <div style={ui.tableScroll}>
        <table style={ui.table}>
          <colgroup>
            <col style={{ width: '12%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '13%' }} />
          </colgroup>

          <thead>
            <tr>
              <TableHead>Date</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Presiding</TableHead>
              <TableHead>Speaker</TableHead>
              <TableHead>Prayer Focus</TableHead>
              <TableHead>Worship Led By</TableHead>
            </tr>
          </thead>

          <tbody>
            {renderGroupedRows(items, 6, (item) => {
              const data = getItemData(item)

              return (
                <tr key={item.id || getDateValue(item)}>
                  <TableCell>{formatDate(getDateValue(item))}</TableCell>
                  <TableCell>{show(getValue(data, ['day', 'day_name', 'Day']) || item.day_name)}</TableCell>
                  <TableCell>{show(getValue(data, ['presiding', 'presiding_by', 'presided_by', 'Presiding']))}</TableCell>
                  <TableCell>{show(getValue(data, ['speaker', 'Speaker']))}</TableCell>
                  <TableCell>{show(getValue(data, ['prayer_focus', 'focus', 'Prayer Focus', 'Focus']))}</TableCell>
                  <TableCell>{show(getValue(data, ['worship_led_by', 'worship_by', 'worship', 'worship_led', 'Worship Led By', 'Worship Led By:']))}</TableCell>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ProgramSchedule
        title="Simple Schedule"
        program={getProgram(meta, items, 'quarterly_prayer')}
      />
    </section>
  )
}

function BibleStudyTable({ items }) {
  return (
    <section style={ui.scheduleBox}>
      <SectionHeader
        title="Bible Study Program"
        subtitle="Every Wednesday at 07 PM at the Amenity Hall"
      />

      <div style={ui.tableScroll}>


        <table style={ui.table}>
          <colgroup>
            <col style={{ width: '12%' }} />
            <col style={{ width: '40%' }} />
            <col style={{ width: '48%' }} />
          </colgroup>

          <thead>
            <tr>
              <TableHead>Date</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Speaker</TableHead>
            </tr>
          </thead>



          <tbody>
            {renderGroupedRows(items, 3, (item) => {
              const data = getItemData(item)

              return (
                <tr key={item.id || getDateValue(item)}>
                  <TableCell>{formatDate(getDateValue(item))}</TableCell>
                  <TableCell>{show(getValue(data, ['topic', 'Topic']))}</TableCell>
                  <TableCell>{show(getValue(data, ['speaker', 'Speaker']))}</TableCell>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function EveningZoomPrayerTable({ items, meta }) {
  const zoomId = getMetaValue(meta, items, ['zoom_id', 'meeting_id', 'zoomId', 'Zoom ID']) || '2183825185'
  const passcode = getMetaValue(meta, items, ['passcode', 'pass_code', 'Passcode']) || '12345'
  const note = getMetaValue(meta, items, ['note', 'nb', 'NB'])

  return (
    <section style={ui.scheduleBox}>
      <SectionHeader
        title="Evening Zoom Prayer"
        subtitle="C O C U C, Bhubaneswar | 07:00 PM – 08:00 PM"
      />

      <EveningZoomPrayerGreeting />

      <InfoGrid
        items={[
          { label: 'Platform', value: 'Zoom' },
          { label: 'Zoom ID', value: zoomId },
          { label: 'Passcode', value: passcode },
        ]}
      />

      <div style={ui.tableScroll}>
        <table style={ui.table}>
          <thead>
            <tr>
              <TableHead>Date</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Leader</TableHead>
              <TableHead>Speaker</TableHead>
              <TableHead>Worship</TableHead>
            </tr>
          </thead>

          <tbody>
            {renderGroupedRows(items, 5, (item) => {
              const data = getItemData(item)

              return (
                <tr key={item.id || getDateValue(item)}>
                  <TableCell>{formatDate(getDateValue(item))}</TableCell>
                  <TableCell>{show(getValue(data, ['day', 'day_name', 'Day']) || item.day_name)}</TableCell>
                  <TableCell>{show(getValue(data, ['leader', 'Leader', 'LEADER']))}</TableCell>
                  <TableCell>{show(getValue(data, ['speaker', 'Speaker', 'SPEAKER']))}</TableCell>
                  <TableCell>{show(getValue(data, ['worship', 'Worship', 'WORSHIP']))}</TableCell>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {note && (
        <div style={ui.noteBox}>
          <strong>Note: </strong>
          {note}
        </div>
      )}

      <ProgramSchedule
        title="Program"
        program={getProgram(meta, items, 'evening_zoom_prayer')}
      />
    </section>
  )
}

function MorningPrayerGreeting() {
  return (
    <div style={{ marginBottom: '28px' }}>
      <div
        style={{
          background: '#fff8ec',
          borderLeft: '4px solid #990000',
          borderRadius: '14px',
          padding: '22px 26px',
          marginBottom: '24px',
          boxShadow: '0 12px 32px rgba(90, 0, 0, 0.08)',
        }}
      >
        <p
          style={{
            margin: 0,
            color: '#111',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '20px',
            fontWeight: 700,
            fontStyle: 'italic',
            lineHeight: 1.65,
          }}
        >
          “In the morning, Lord, You hear my voice; in the morning I lay my
          requests before You and wait expectantly.”
        </p>

        <p
          style={{
            margin: '12px 0 0',
            color: '#990000',
            fontSize: '13px',
            fontWeight: 900,
            letterSpacing: '0.08em',
          }}
        >
          — PSALM 5:3
        </p>
      </div>

      <div
        style={{
          background: '#870000',
          color: '#ffffff',
          borderRadius: '14px',
          padding: '24px 28px',
          marginBottom: '24px',
          boxShadow: '0 16px 35px rgba(153, 0, 0, 0.22)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '20px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                opacity: 0.85,
                marginBottom: '8px',
              }}
            >
              Days
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900 }}>
              Mon – Sat (Except Sunday)
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                opacity: 0.85,
                marginBottom: '8px',
              }}
            >
              Time
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900 }}>
              07:00 AM – 08:00 AM IST
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                opacity: 0.85,
                marginBottom: '8px',
              }}
            >
              Venue
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900 }}>
              Church & Online (Zoom)
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #eeeeee',
          borderRadius: '16px',
          padding: '30px 34px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.06)',
        }}
      >
        <p style={{ margin: '0 0 18px', color: '#222', lineHeight: 1.8 }}>
          At the <strong>Church of Christ (Union Church), Bhubaneswar</strong>,
          we believe there is no better way to face the day than by anchoring
          our hearts in scripture, worship, and community prayer. Whether you
          are seeking strength for the week ahead, peace in a time of trial, or
          simply want to fellowship with God, our doors and hearts are open.
        </p>

        <p style={{ margin: '0 0 18px', color: '#222', lineHeight: 1.8 }}>
          At Union Church, faithful worshippers come every day and pray for
          others’ needs and also for the State and the Nation. Even Jesus set an
          example for us as He used to pray early in the morning to His Father
          in Heaven.
        </p>

        <blockquote
          style={{
            margin: '18px 0',
            padding: '4px 0 4px 18px',
            borderLeft: '2px solid #990000',
            color: '#111',
            fontStyle: 'italic',
            lineHeight: 1.8,
          }}
        >
          As a Church, the importance of Prayer is utmost in these days. Because
          as believers, we are going to face difficult days in the future. We
          need the power from above to face trials — and that power we can
          receive only when we are on our knees and pray.
        </blockquote>

        <p style={{ margin: 0, color: '#222', lineHeight: 1.8 }}>
          Join us as we gather to seek the Lord’s face, lift up our community,
          and intercede for one another. Both our Pastors, Deacons, and other
          members of the Church share God’s Word during this prayer time. Those
          who come regularly are thoroughly blessed.
        </p>
      </div>
    </div>
  )
}

function MondayPrayerGreeting() {
  return (
    <div style={{ marginBottom: '28px' }}>
      <div
        style={{
          background: '#870000',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '26px 32px',
          marginBottom: '28px',
          boxShadow: '0 16px 35px rgba(153, 0, 0, 0.22)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                opacity: 0.85,
                marginBottom: '8px',
              }}
            >
              Day & Time
            </div>

            <div style={{ fontSize: '22px', fontWeight: 900 }}>
              Every Monday | 7:00 PM – 8:00 PM
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                opacity: 0.85,
                marginBottom: '8px',
              }}
            >
              In-Person Venue
            </div>

            <div style={{ fontSize: '20px', fontWeight: 900 }}>
              Ground Floor Amenity Hall
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                opacity: 0.85,
                marginBottom: '8px',
              }}
            >
              Also Available
            </div>

            <div style={{ fontSize: '20px', fontWeight: 900 }}>
              Online via Zoom
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #eeeeee',
          borderRadius: '18px',
          padding: '34px 38px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.06)',
        }}
      >
        <p style={{ margin: '0 0 20px', color: '#222', lineHeight: 1.85 }}>
          There is no better way to anchor our week than coming together as a
          family in prayer. Every Monday, the{' '}
          <strong>Church of Christ (Union Church), Bhubaneswar</strong> gathers
          to seek God&apos;s face, intercede for our community, and lift up
          different matters of the Church.
        </p>

        <p style={{ margin: '0 0 20px', color: '#222', lineHeight: 1.85 }}>
          Whether you join us in person or virtually, your presence and prayers
          matter! This dedicated time is spent in worship through songs,
          meditation, and prayer — conducted by our Associate Pastors, Deacons,
          or invited leaders.
        </p>

        <blockquote
          style={{
            margin: '22px 0 0',
            padding: '4px 0 4px 20px',
            borderLeft: '3px solid #990000',
            color: '#111',
            fontStyle: 'italic',
            lineHeight: 1.85,
          }}
        >
          Unless a Church prays, we cannot see lives being changed; we cannot
          fulfill the Great Commission which the Lord has given to His people.
          Do come and join us as we pray in faith on various matters.
        </blockquote>
      </div>
    </div>
  )
}

function EveningZoomPrayerGreeting() {
  return (
    <div style={{ marginBottom: '28px' }}>
      <div
        style={{
          background: '#870000',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '26px 32px',
          marginBottom: '28px',
          boxShadow: '0 16px 35px rgba(153, 0, 0, 0.22)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                opacity: 0.85,
                marginBottom: '8px',
              }}
            >
              Days
            </div>

            <div style={{ fontSize: '22px', fontWeight: 900 }}>
              Every Friday & Saturday
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                opacity: 0.85,
                marginBottom: '8px',
              }}
            >
              Time
            </div>

            <div style={{ fontSize: '22px', fontWeight: 900 }}>
              07:00 PM – 08:00 PM IST
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                opacity: 0.85,
                marginBottom: '8px',
              }}
            >
              Platform
            </div>

            <div style={{ fontSize: '22px', fontWeight: 900 }}>
              Zoom Only
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #eeeeee',
          borderRadius: '18px',
          padding: '34px 38px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.06)',
        }}
      >
        <p style={{ margin: '0 0 20px', color: '#222', lineHeight: 1.85 }}>
          Evening Zoom Prayer takes place <strong>every Friday and Saturday</strong>.
          During these sessions, we passionately intercede for our congregation
          and community. All are welcome to join from the comfort of your home.
        </p>

        <p
          style={{
            margin: '0 0 20px',
            color: '#111',
            lineHeight: 1.85,
            fontWeight: 800,
          }}
        >
          During these sessions, we passionately intercede for:
        </p>

        <ul
          style={{
            margin: 0,
            paddingLeft: '1.4rem',
            color: '#222',
            lineHeight: 1.9,
          }}
        >
          <li style={{ marginBottom: '12px' }}>
            The diverse prayer requests submitted by our congregation.
          </li>

          <li style={{ marginBottom: '12px' }}>
            Prayer for healing of the sick.
          </li>

          <li>
            Comfort, strength, and relief for our elders suffering from various
            ailments.
          </li>
        </ul>
      </div>
    </div>
  )
}


function QuarterlyPrayerGreeting() {
  return (
    <div style={{ marginBottom: '28px' }}>
      <div
        style={{
          background: '#fff8ec',
          borderLeft: '4px solid #990000',
          borderRadius: '14px',
          padding: '22px 26px',
          marginBottom: '24px',
          boxShadow: '0 12px 32px rgba(90, 0, 0, 0.08)',
        }}
      >
        <p
          style={{
            margin: 0,
            color: '#111',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '20px',
            fontWeight: 700,
            fontStyle: 'italic',
            lineHeight: 1.65,
          }}
        >
          “The earnest prayer of a righteous person has great power and produces
          wonderful results.”
        </p>

        <p
          style={{
            margin: '12px 0 0',
            color: '#990000',
            fontSize: '13px',
            fontWeight: 900,
            letterSpacing: '0.08em',
          }}
        >
          — JAMES 5:16
        </p>
      </div>

      <div
        style={{
          background: '#870000',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '26px 32px',
          marginBottom: '28px',
          boxShadow: '0 16px 35px rgba(153, 0, 0, 0.22)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                opacity: 0.85,
                marginBottom: '8px',
              }}
            >
              When
            </div>

            <div style={{ fontSize: '20px', fontWeight: 900 }}>
              First Week of Every New Quarter
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                opacity: 0.85,
                marginBottom: '8px',
              }}
            >
              This Quarter
            </div>

            <div style={{ fontSize: '20px', fontWeight: 900 }}>
              6th – 11th July 2026
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                opacity: 0.85,
                marginBottom: '8px',
              }}
            >
              Daily Time
            </div>

            <div style={{ fontSize: '20px', fontWeight: 900 }}>
              07:00 PM IST
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #eeeeee',
          borderRadius: '18px',
          padding: '34px 38px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.06)',
        }}
      >
        <p style={{ margin: '0 0 20px', color: '#222', lineHeight: 1.85 }}>
          The <strong>Church Quarterly Prayer Week</strong> takes place every
          first week of a new quarter. Join us as we gather as one body for six
          evenings of focused, mission-driven prayer.
        </p>

        <p style={{ margin: 0, color: '#222', lineHeight: 1.85 }}>
          Each evening, we will direct our hearts toward specific mission
          fields, communities, and generations — interceding for transformation,
          protection, and spiritual growth. These are not ordinary prayer
          meetings; they are moments where the entire church family unites in
          purpose and faith.
        </p>
      </div>
    </div>
  )
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={ui.sectionTop}>
      <h2 style={ui.sectionTitle}>{title}</h2>
      {subtitle && <p style={ui.sectionSubTitle}>{subtitle}</p>}
    </div>
  )
}

function InfoGrid({ items }) {
  return (
    <div style={ui.infoGrid}>
      {items.map((item) => (
        <div key={item.label} style={ui.infoCard}>
          <span style={ui.infoLabel}>{item.label}</span>
          <span style={ui.infoValue}>{item.value || '—'}</span>
        </div>
      ))}
    </div>
  )
}

function ProgramSchedule({ title, program }) {
  if (!program || program.length === 0) return null

  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ color: '#990000', margin: '0 0 12px', fontSize: 22 }}>
        {title}
      </h3>

      <div style={ui.tableScroll}>
        <table style={{ ...ui.table, minWidth: 520 }}>
          <tbody>
            {program.map((row, index) => (
              <tr key={`${row.item || row.title}-${index}`}>
                <TableCell>{show(row.item || row.title || row.name)}</TableCell>
                <TableCell>{show(row.duration || row.time)}</TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TableHead({ children }) {
  return <th style={ui.th}>{children}</th>
}

function TableCell({ children }) {
  return <td style={ui.td}>{children}</td>
}

function renderGroupedRows(items, colSpan, renderRow) {
  let lastMonth = ''

  return items.map((item, index) => {
    const month = getMonthLabel(item)
    const shouldShowMonth = month && month !== lastMonth

    if (shouldShowMonth) {
      lastMonth = month
    }

    return (
      <Fragment key={`${item.id || getDateValue(item) || index}-group`}>
        {shouldShowMonth && (
          <tr>
            <td colSpan={colSpan} style={ui.monthRow}>
              {month}
            </td>
          </tr>
        )}
        {renderRow(item)}
      </Fragment>
    )
  })
}

function normalizeApiResponse(result) {
  if (Array.isArray(result)) {
    return {
      items: result,
      meta: {},
    }
  }

  return {
    items: result?.items || result?.data || result?.schedules || [],
    meta: result?.meta || result?.info || result?.upload || {},
  }
}

function getUpcomingItems(items) {
  return [...items]
    .filter((item) => {
      const date = parseDateForCompare(getDateValue(item))

      if (!date) return true

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      return date >= today
    })
    .sort((a, b) => {
      const dateA = parseDateForCompare(getDateValue(a))
      const dateB = parseDateForCompare(getDateValue(b))

      if (!dateA || !dateB) {
        return Number(a.sort_order || 0) - Number(b.sort_order || 0)
      }

      return dateA - dateB
    })
}

function getItemData(item) {
  return {
    ...item,
    ...parseJson(item?.data_json),
    ...parseJson(item?.data),
    ...parseJson(item?.fields),
  }
}

function parseJson(value) {
  if (!value) return {}

  if (typeof value === 'object') return value

  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
}

function getValue(source, keys) {
  if (!source) return ''

  for (const key of keys) {
    if (
      source[key] !== undefined &&
      source[key] !== null &&
      source[key] !== ''
    ) {
      return source[key]
    }
  }

  const normalize = (value) =>
    String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')

  const normalizedKeys = keys.map(normalize)

  for (const sourceKey of Object.keys(source)) {
    const normalizedSourceKey = normalize(sourceKey)

    if (normalizedKeys.includes(normalizedSourceKey)) {
      const value = source[sourceKey]

      if (value !== undefined && value !== null && value !== '') {
        return value
      }
    }
  }

  for (const sourceKey of Object.keys(source)) {
    const normalizedSourceKey = normalize(sourceKey)

    for (const normalizedKey of normalizedKeys) {
      if (
        normalizedKey.length >= 4 &&
        normalizedSourceKey.length >= 4 &&
        (normalizedSourceKey.includes(normalizedKey) ||
          normalizedKey.includes(normalizedSourceKey))
      ) {
        const value = source[sourceKey]

        if (value !== undefined && value !== null && value !== '') {
          return value
        }
      }
    }
  }

  return ''
}

function getMetaValue(meta, items, keys) {
  const metaValue = getValue(meta, keys)

  if (metaValue) return metaValue

  for (const item of items) {
    const data = getItemData(item)
    const itemValue = getValue(data, keys)

    if (itemValue) return itemValue
  }

  return ''
}

function getProgram(meta, items, section) {
  const metaProgram = meta?.program || meta?.schedule || meta?.simple_schedule

  if (Array.isArray(metaProgram) && metaProgram.length > 0) {
    return metaProgram
  }

  for (const item of items) {
    const data = getItemData(item)
    const rowProgram = data.program || data.schedule || data.simple_schedule

    if (Array.isArray(rowProgram) && rowProgram.length > 0) {
      return rowProgram
    }
  }

  return defaultPrograms[section] || []
}

function getDateValue(item) {
  const data = getItemData(item)

  return (
    item?.schedule_date ||
    item?.event_date ||
    data?.schedule_date ||
    data?.event_date ||
    data?.date ||
    data?.Date ||
    ''
  )
}

function getMonthLabel(item) {
  const data = getItemData(item)

  if (item?.month_label) return item.month_label
  if (data?.month_label) return data.month_label
  if (data?.month) return data.month

  const dateValue = getDateValue(item)
  const parsedDate = parseDateForCompare(dateValue)

  if (!parsedDate) return ''

  return parsedDate.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  })
}

function parseDateForCompare(value) {
  if (!value) return null

  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const [year, month, day] = value.slice(0, 10).split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) {
    const [day, month, year] = value.split('.').map(Number)
    return new Date(year, month - 1, day)
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return null

  date.setHours(0, 0, 0, 0)
  return date
}

function formatDate(value) {
  if (!value) return '—'

  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const [year, month, day] = value.slice(0, 10).split('-')
    return `${day}.${month}.${year}`
  }

  if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) {
    return value
  }

  const date = parseDateForCompare(value)

  if (!date) return value

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function show(value) {
  return value || '—'
}