'use client'

import { useAuth } from '@/components/AuthContext'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'

export default function SecretaryPortal() {
  const { user, token, loading, logout } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  
  const [activeTab, setActiveTab] = useState('weekly') // weekly, special, speaking
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, type: '', text: '' })
  const toastRef = useRef(null)
  
  const [weeklyEditId, setWeeklyEditId] = useState(null)
  const [specialEditId, setSpecialEditId] = useState(null)
  const [speakingEditId, setSpeakingEditId] = useState(null)
  const tabContentRef = useRef(null)
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api'

  // Weekly Notices State
  const [weeklyNotices, setWeeklyNotices] = useState([])
  const [weeklyDate, setWeeklyDate] = useState('')
  const [weeklyFiles, setWeeklyFiles] = useState([])
  const [individualNotices, setIndividualNotices] = useState([{ title: '', details: '', file: null }])

  // Special Programmes State
  const [specialProgrammes, setSpecialProgrammes] = useState([])
  const [specialDate, setSpecialDate] = useState('')
  const [specialTitle, setSpecialTitle] = useState('')
  const [specialWing, setSpecialWing] = useState('Church (General)')
  const [customWing, setCustomWing] = useState('')
  const [specialEventFrom, setSpecialEventFrom] = useState('')
  const [specialEventTo, setSpecialEventTo] = useState('')
  const [specialDuration, setSpecialDuration] = useState('')
  const [specialDetails, setSpecialDetails] = useState('')
  const [specialFile, setSpecialFile] = useState(null)

  // Speaking Arrangements State
  const [speakingArrangements, setSpeakingArrangements] = useState([])
  const [speakingSection, setSpeakingSection] = useState('Sunday Worships')
  const [speakingDetails, setSpeakingDetails] = useState('')
  const [speakingDate, setSpeakingDate] = useState('')
  const [speakingFile1, setSpeakingFile1] = useState(null)
  const [speakingFile2, setSpeakingFile2] = useState(null)
  const [speakingFile3, setSpeakingFile3] = useState(null)

  // Previews
  const [weeklyFilesPreviews, setWeeklyFilesPreviews] = useState([])
  const [specialFilePreview, setSpecialFilePreview] = useState(null)
  const [speakingFile1Preview, setSpeakingFile1Preview] = useState(null)
  const [speakingFile2Preview, setSpeakingFile2Preview] = useState(null)
  const [speakingFile3Preview, setSpeakingFile3Preview] = useState(null)
  const [fullscreenPreview, setFullscreenPreview] = useState(null)
  const [previewZoom, setPreviewZoom] = useState(1);
  const [previewPan, setPreviewPan] = useState({ x: 0, y: 0 });
  const [previewIsDragging, setPreviewIsDragging] = useState(false);
  const [previewDragStart, setPreviewDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (fullscreenPreview) {
      setPreviewZoom(1);
      setPreviewPan({ x: 0, y: 0 });
      setPreviewIsDragging(false);
    }
  }, [fullscreenPreview]);

  const handlePreviewWheel = (e) => {
    if (e.deltaY < 0) {
      setPreviewZoom(z => Math.min(z + 0.2, 5));
    } else {
      setPreviewZoom(z => Math.max(z - 0.2, 0.5));
    }
  };

  const handlePreviewMouseDown = (e) => {
    e.preventDefault();
    setPreviewIsDragging(true);
    setPreviewDragStart({ x: e.clientX - previewPan.x, y: e.clientY - previewPan.y });
  };
  const handlePreviewMouseMove = (e) => {
    if (previewIsDragging) setPreviewPan({ x: e.clientX - previewDragStart.x, y: e.clientY - previewDragStart.y });
  };
  const handlePreviewMouseUp = () => setPreviewIsDragging(false);

  const handlePreviewTouchStart = (e) => {
    if (e.touches.length === 1) {
      setPreviewIsDragging(true);
      setPreviewDragStart({ x: e.touches[0].clientX - previewPan.x, y: e.touches[0].clientY - previewPan.y });
    }
  };
  const handlePreviewTouchMove = (e) => {
    if (previewIsDragging && e.touches.length === 1) {
      setPreviewPan({ x: e.touches[0].clientX - previewDragStart.x, y: e.touches[0].clientY - previewDragStart.y });
    }
  };

  useEffect(() => {
    if (tabContentRef.current) {
      gsap.fromTo(tabContentRef.current, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' })
    }
  }, [activeTab])

  useEffect(() => {
    setMounted(true)
    
    // Set IST Date automatically
    const istDate = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    const d = new Date(istDate);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    
    setWeeklyDate(formattedDate);
    setSpecialDate(formattedDate);
    setSpeakingDate(formattedDate);

    if (!loading) {
      if (!user) {
        router.push('/admin/login')
      } else if (user.designation !== 'Secretary') {
        router.push('/admin')
      } else {
        fetchAllData()
        if (localStorage.getItem('just_logged_in') === 'true') {
          setTimeout(() => showToast('success', 'Welcome Secretary, login successful'), 300)
          localStorage.removeItem('just_logged_in')
        }
      }
    }
  }, [user, loading, router])

  // Automatically calculate duration for Special Programmes
  useEffect(() => {
    if (specialEventFrom && specialEventTo) {
      const from = new Date(specialEventFrom)
      const to = new Date(specialEventTo)
      const diffTime = to - from
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // Inclusive
      if (diffDays > 0) {
        setSpecialDuration(`${diffDays} day${diffDays > 1 ? 's' : ''}`)
      } else {
        setSpecialDuration('Invalid date range')
      }
    } else {
      setSpecialDuration('')
    }
  }, [specialEventFrom, specialEventTo])

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      weeklyFilesPreviews.forEach(p => URL.revokeObjectURL(p.url))
      if (specialFilePreview) URL.revokeObjectURL(specialFilePreview)
      if (speakingFile1Preview) URL.revokeObjectURL(speakingFile1Preview)
      if (speakingFile2Preview) URL.revokeObjectURL(speakingFile2Preview)
      if (speakingFile3Preview) URL.revokeObjectURL(speakingFile3Preview)
    }
  }, [weeklyFilesPreviews, specialFilePreview, speakingFile1Preview, speakingFile2Preview, speakingFile3Preview])

  const handleWeeklyFilesChange = (e) => {
    if (e.target.files.length > 5) {
      alert('Max 5 files allowed')
      e.target.value = ''
      setWeeklyFiles([])
      weeklyFilesPreviews.forEach(p => URL.revokeObjectURL(p.url))
      setWeeklyFilesPreviews([])
      return
    }
    const files = Array.from(e.target.files)
    setWeeklyFiles(files)
    
    // Create previews
    weeklyFilesPreviews.forEach(p => URL.revokeObjectURL(p.url))
    const previews = files.map(f => ({ file: f, url: URL.createObjectURL(f), type: f.type.startsWith('image/') ? 'image' : 'doc' }))
    setWeeklyFilesPreviews(previews)
  }

  const removeWeeklyFile = (index) => {
    const newFiles = [...weeklyFiles]
    newFiles.splice(index, 1)
    setWeeklyFiles(newFiles)
    
    const newPreviews = [...weeklyFilesPreviews]
    URL.revokeObjectURL(newPreviews[index].url)
    newPreviews.splice(index, 1)
    setWeeklyFilesPreviews(newPreviews)
    
    // Reset input
    if (newFiles.length === 0) {
      document.getElementById('weeklyFiles').value = ''
    }
  }

  const handleSingleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0]
    if (!file) return
    setFile(file)
    setPreview({ url: URL.createObjectURL(file), type: file.type.startsWith('image/') ? 'image' : 'doc' })
  }

  const clearSingleFile = (inputId, setFile, setPreview, previewObj) => {
    setFile(null)
    if (previewObj) URL.revokeObjectURL(previewObj.url)
    setPreview(null)
    if (document.getElementById(inputId)) document.getElementById(inputId).value = ''
  }

  const fetchAllData = () => {
    fetch(`${API_URL}/weekly_notices.php`).then(r => r.json()).then(d => Array.isArray(d) && setWeeklyNotices(d)).catch(() => {})
    fetch(`${API_URL}/special_programmes.php`).then(r => r.json()).then(d => Array.isArray(d) && setSpecialProgrammes(d)).catch(() => {})
    fetch(`${API_URL}/speaking_arrangements.php`).then(r => r.json()).then(d => Array.isArray(d) && setSpeakingArrangements(d)).catch(() => {})
  }

  const showToast = (type, text) => {
    setToast({ show: true, type, text })
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      if (toastRef.current) gsap.fromTo(toastRef.current, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
    }, 80)
    setTimeout(() => {
      if (toastRef.current) {
        gsap.to(toastRef.current, { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in', onComplete: () => setToast({ show: false, type: '', text: '' }) })
      } else setToast({ show: false, type: '', text: '' })
    }, 5000)
  }

  const displayDate = (dateStr) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const handleWeeklySubmit = async (e) => {
    e.preventDefault()
    if (!weeklyDate) return showToast('error', 'Release date is required.')
    
    setSubmitLoading(true)
    try {
      const fd = new FormData()
      if (weeklyEditId) fd.append('id', weeklyEditId)
      fd.append('release_date', weeklyDate)
      
      const noticesToSave = individualNotices.map(n => ({ title: n.title, details: n.details })).filter(n => n.title.trim() || n.details.trim())
      fd.append('notices_json', JSON.stringify(noticesToSave))
      
      individualNotices.forEach((n, i) => {
        if (n.file) fd.append('notice_file_' + i, n.file)
      })

      for (let i = 0; i < weeklyFiles.length; i++) {
        fd.append('documents[]', weeklyFiles[i])
      }

      const res = await fetch(`${API_URL}/weekly_notices.php`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      })

      if (res.ok) {
        showToast('success', 'Weekly Notice published successfully!')
        setWeeklyDate(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}).split(',')[0].split('/').reverse().join('-')); 
        setWeeklyFiles([]); document.getElementById('weeklyFiles').value = ''
        weeklyFilesPreviews.forEach(p => URL.revokeObjectURL(p.url))
        setWeeklyFilesPreviews([])
        setIndividualNotices([{ title: '', details: '', file: null }])
        setWeeklyEditId(null)
        fetchAllData()
      } else {
        const err = await res.json()
        showToast('error', err.error || 'Failed to publish.')
      }
    } catch (e) {
      showToast('error', 'Network error.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleSpecialSubmit = async (e) => {
    e.preventDefault()
    if (!specialDate || !specialTitle || !specialWing) return showToast('error', 'All fields required.')
    
    setSubmitLoading(true)
    try {
      const fd = new FormData()
      if (specialEditId) fd.append('id', specialEditId)
      fd.append('upload_date', specialDate)
      fd.append('title', specialTitle)
      fd.append('wing', specialWing)
      if (specialWing === 'Others') fd.append('custom_wing', customWing)
      if (specialEventFrom) fd.append('event_from', specialEventFrom)
      if (specialEventTo) fd.append('event_to', specialEventTo)
      if (specialDuration) fd.append('duration', specialDuration)
      if (specialDetails) fd.append('details', specialDetails)
      if (specialFile) fd.append('document', specialFile)

      const res = await fetch(`${API_URL}/special_programmes.php`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      })

      if (res.ok) {
        showToast('success', 'Special Programme added successfully!')
        setSpecialDate(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}).split(',')[0].split('/').reverse().join('-')); 
        setSpecialTitle(''); setSpecialWing('Church (General)'); setCustomWing(''); setSpecialEditId(null);
        setSpecialEventFrom(''); setSpecialEventTo(''); setSpecialDuration(''); setSpecialDetails('');
        clearSingleFile('specialFile', setSpecialFile, setSpecialFilePreview, specialFilePreview);
        fetchAllData()
      } else {
        const err = await res.json()
        showToast('error', err.error || 'Failed to add programme.')
      }
    } catch (e) {
      showToast('error', 'Network error.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleSpeakingSubmit = async (e) => {
    e.preventDefault()
    if (!speakingSection || !speakingDate) return showToast('error', 'Section and Date are required.')
    
    setSubmitLoading(true)
    try {
      const fd = new FormData()
      if (speakingEditId) fd.append('id', speakingEditId)
      fd.append('sub_section', speakingSection)
      fd.append('details', speakingDetails)
      fd.append('event_date', speakingDate)
      if (speakingFile1) fd.append('attachment1', speakingFile1)
      if (speakingFile2) fd.append('attachment2', speakingFile2)
      if (speakingFile3) fd.append('attachment3', speakingFile3)

      const res = await fetch(`${API_URL}/speaking_arrangements.php`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      })

      if (res.ok) {
        showToast('success', 'Speaking Arrangement added successfully!')
        setSpeakingDate(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}).split(',')[0].split('/').reverse().join('-'));
        setSpeakingSection('Sunday Worships'); setSpeakingDetails(''); setSpeakingEditId(null);
        clearSingleFile('spkFile1', setSpeakingFile1, setSpeakingFile1Preview, speakingFile1Preview);
        clearSingleFile('spkFile2', setSpeakingFile2, setSpeakingFile2Preview, speakingFile2Preview);
        clearSingleFile('spkFile3', setSpeakingFile3, setSpeakingFile3Preview, speakingFile3Preview);
        fetchAllData()
      } else {
        const err = await res.json()
        showToast('error', err.error || 'Failed to add arrangement.')
      }
    } catch (e) {
      showToast('error', 'Network error.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleEditWeekly = (item) => {
    setWeeklyEditId(item.id)
    setWeeklyDate(item.release_date)
    try {
      const parsedNotices = item.notices_json ? JSON.parse(item.notices_json) : []
      if (parsedNotices.length > 0) {
        setIndividualNotices(parsedNotices.map(n => ({ ...n, file: null })))
      } else {
        setIndividualNotices([{ title: '', details: '', file: null }])
      }
    } catch(e) {
      setIndividualNotices([{ title: '', details: '', file: null }])
    }
    setActiveTab('weekly')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEditSpecial = (item) => {
    setSpecialEditId(item.id)
    setSpecialDate(item.upload_date)
    setSpecialTitle(item.title)
    if (item.wing === 'Church' || item.wing === 'Church (General)') {
      setSpecialWing('Church (General)')
      setCustomWing('')
    } else if (['C.E Union', 'Mahila Samiti (Maa sabha)', 'Youth Fellowship'].includes(item.wing)) {
      setSpecialWing(item.wing)
      setCustomWing('')
    } else {
      setSpecialWing('Others')
      setCustomWing(item.custom_wing || item.wing)
    }
    setSpecialEventFrom(item.event_from || '')
    setSpecialEventTo(item.event_to || '')
    setSpecialDetails(item.details || '')
    setActiveTab('special')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEditSpeaking = (item) => {
    setSpeakingEditId(item.id)
    setSpeakingSection(item.sub_section)
    setSpeakingDetails(item.details || '')
    setSpeakingDate(item.event_date)
    setActiveTab('speaking')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (endpoint, id) => {
    if (!confirm("Are you sure you want to delete this entry permanently?")) return
    try {
      const res = await fetch(`${API_URL}/${endpoint}.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        showToast('success', 'Deleted successfully.')
        fetchAllData()
      } else {
        showToast('error', 'Failed to delete.')
      }
    } catch (e) {
      showToast('error', 'Network error.')
    }
  }

  if (loading || !user) {
    return <div className="section container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><div className="jumping-dots"><span></span><span></span><span></span></div></div>
  }

  const inputStyle = { width: '100%', padding: '1.1rem 1.2rem', borderRadius: '12px', border: '1px solid #e0e0e0', fontSize: '1rem', fontFamily: 'inherit', backgroundColor: '#fafafa', transition: 'all 0.2s ease' }
  const labelStyle = { display: 'block', marginBottom: '0.6rem', fontWeight: 600, color: '#333', fontSize: '0.95rem' }

  return (
    <>
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && mounted && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '20px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxWidth: '400px', width: '90%' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem', color: '#111', fontWeight: '800' }}>Ready to Leave?</h3>
            <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.5 }}>Are you sure you want to log out of the secretary dashboard?</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => setShowLogoutConfirm(false)} style={{ flex: 1, padding: '0.8rem', background: '#f5f5f5', color: '#444', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', fontSize: '1rem' }} onMouseOver={(e) => { e.target.style.background = '#ebebeb'; e.target.style.transform = 'translateY(-2px)' }} onMouseOut={(e) => { e.target.style.background = '#f5f5f5'; e.target.style.transform = 'translateY(0)' }}>Stay</button>
              <button onClick={logout} style={{ flex: 1, padding: '0.8rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', fontSize: '1rem', boxShadow: '0 4px 15px rgba(139,0,0,0.2)' }} onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(139,0,0,0.3)' }} onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(139,0,0,0.2)' }}>Log Out</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Toast */}
      {toast.show && (
        <div ref={toastRef} style={{ position: 'fixed', top: '100px', left: '50%', transform: 'translateX(-50%)', zIndex: 100000, display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '1rem 1.5rem', width: 'max-content', maxWidth: '90%', borderRadius: '12px', background: toast.type === 'success' ? '#f0fdf4' : '#fff5f5', border: `1px solid ${toast.type === 'success' ? '#bbf7d0' : '#fecaca'}`, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, background: toast.type === 'success' ? '#dcfce7' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: toast.type === 'success' ? '#16a34a' : '#dc2626' }}>
            {toast.type === 'success' ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>}
          </div>
          <p style={{ flex: 1, margin: 0, fontSize: '0.95rem', fontWeight: '600', color: toast.type === 'success' ? '#15803d' : '#b91c1c' }}>{toast.text}</p>
          <button onClick={() => setToast({ show: false, type: '', text: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '1.2rem', padding: '0.1rem 0.3rem' }}>×</button>
        </div>
      )}

      <div className="section container" style={{ paddingTop: '100px', paddingBottom: '4rem', maxWidth: '900px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', color: '#111', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-1px' }}>Secretary Dashboard</h1>
            <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.8rem' }}>Welcome back, <strong style={{color: 'var(--color-primary)'}}>{user.full_name}</strong></p>
          </div>
          <button onClick={() => setShowLogoutConfirm(true)} style={{ padding: '0.7rem 1.8rem', border: 'none', color: '#fff', backgroundColor: 'var(--color-primary)', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s ease', boxShadow: '0 4px 15px rgba(139,0,0,0.2)' }} onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(139,0,0,0.3)'; }} onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(139,0,0,0.2)'; }}>Sign Out</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('weekly')} style={{ flex: 1, padding: '1rem', background: activeTab === 'weekly' ? 'var(--color-primary)' : '#f5f5f5', color: activeTab === 'weekly' ? '#fff' : '#444', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', transition: '0.2s', boxShadow: activeTab === 'weekly' ? '0 4px 15px rgba(139,0,0,0.2)' : 'none' }}>Weekly Notices</button>
          <button onClick={() => setActiveTab('special')} style={{ flex: 1, padding: '1rem', background: activeTab === 'special' ? 'var(--color-primary)' : '#f5f5f5', color: activeTab === 'special' ? '#fff' : '#444', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', transition: '0.2s', boxShadow: activeTab === 'special' ? '0 4px 15px rgba(139,0,0,0.2)' : 'none' }}>Special Programmes</button>
          <button onClick={() => setActiveTab('speaking')} style={{ flex: 1, padding: '1rem', background: activeTab === 'speaking' ? 'var(--color-primary)' : '#f5f5f5', color: activeTab === 'speaking' ? '#fff' : '#444', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', transition: '0.2s', boxShadow: activeTab === 'speaking' ? '0 4px 15px rgba(139,0,0,0.2)' : 'none' }}>Speaking Arrangements</button>
        </div>

        {/* Tab Contents */}
        <div ref={tabContentRef} style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fcfcfc 100%)', padding: 'clamp(2rem, 5vw, 3.5rem)', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.04)', marginBottom: '4rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139,0,0,0.03) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }} />
          
          {activeTab === 'weekly' && (
            <form onSubmit={handleWeeklySubmit} style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: '1.8rem', color: '#111', fontWeight: '800', marginBottom: '2rem' }}>Publish Weekly Notice</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <label style={labelStyle}>Upload Date * (Auto-filled)</label>
                  <input type="text" readOnly value={displayDate(weeklyDate)} style={{...inputStyle, background: '#f0f0f0', color: '#666', cursor: 'not-allowed'}} />
                </div>
                <div>
                  <label style={labelStyle}>Attach Documents (Max 5 files)</label>
                  <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '-0.4rem', marginBottom: '0.8rem' }}>Allowed formats: PDF, DOCX, XLSX, PPT, Images. Hold Ctrl/Cmd to select multiple.</p>
                  <input type="file" id="weeklyFiles" multiple onChange={handleWeeklyFilesChange} style={{...inputStyle, padding: '0.9rem'}} />
                  {weeklyFilesPreviews.length > 0 && (
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                      {weeklyFilesPreviews.map((p, i) => (
                        <div key={i} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden', background: '#fff' }}>
                          {p.type === 'image' ? (
                            <img src={p.url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} onClick={() => setFullscreenPreview(p)} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', cursor: 'pointer' }} onClick={() => setFullscreenPreview(p)}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                              <span style={{ fontSize: '0.6rem', marginTop: '4px', color: '#666', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 4px' }}>{p.file.name}</span>
                            </div>
                          )}
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeWeeklyFile(i); }} style={{ position: 'absolute', top: '2px', right: '2px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>&times;</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#111', fontWeight: '700', marginBottom: '1rem' }}>Add Individual Notices</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {individualNotices.map((notice, idx) => (
                      <div key={idx} style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem', position: 'relative' }}>
                        {individualNotices.length > 1 && (
                          <button type="button" onClick={() => {
                            const newN = [...individualNotices]; newN.splice(idx, 1); setIndividualNotices(newN);
                          }} style={{ position: 'absolute', top: '10px', right: '10px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                        )}
                        <div style={{ marginBottom: '1rem' }}>
                          <label style={{...labelStyle, fontSize: '0.9rem'}}>Notice Title</label>
                          <input type="text" value={notice.title} onChange={e => { const newN = [...individualNotices]; newN[idx].title = e.target.value; setIndividualNotices(newN); }} style={{...inputStyle, padding: '0.7rem'}} placeholder="e.g. Women's Fellowship Meeting" />
                        </div>
                        <div>
                          <label style={{...labelStyle, fontSize: '0.9rem'}}>Details Space</label>
                          <textarea value={notice.details} onChange={e => { const newN = [...individualNotices]; newN[idx].details = e.target.value; setIndividualNotices(newN); }} style={{...inputStyle, padding: '0.7rem', minHeight: '80px'}} placeholder="Write details..." />
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                          <label style={{...labelStyle, fontSize: '0.9rem'}}>Attachment (Optional)</label>
                          <input type="file" onChange={e => { const newN = [...individualNotices]; newN[idx].file = e.target.files[0]; setIndividualNotices(newN); }} style={{...inputStyle, padding: '0.7rem'}} />
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => setIndividualNotices([...individualNotices, {title: '', details: ''}])} style={{ background: '#fff', border: '1px dashed var(--color-primary)', color: 'var(--color-primary)', padding: '1rem', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>+ Add More Notice</button>
                  </div>
                </div>

                <button type="submit" disabled={submitLoading} className="btn-primary" style={{ padding: '1.2rem', fontSize: '1.1rem', fontWeight: '700', borderRadius: '12px', border: 'none', background: 'var(--color-primary)', color: '#fff', cursor: 'pointer', opacity: submitLoading ? 0.6 : 1 }}>{weeklyEditId ? 'Update Notice' : 'Publish Notice'}</button>
              </div>
            </form>
          )}

          {activeTab === 'special' && (
            <form onSubmit={handleSpecialSubmit} style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: '1.8rem', color: '#111', fontWeight: '800', marginBottom: '2rem' }}>Add Special Programme</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <label style={labelStyle}>Upload Date * (Auto-filled)</label>
                  <input type="text" readOnly value={displayDate(specialDate)} style={{...inputStyle, background: '#f0f0f0', color: '#666', cursor: 'not-allowed'}} />
                </div>
                <div>
                  <label style={labelStyle}>Wing *</label>
                  <select required value={specialWing} onChange={e => setSpecialWing(e.target.value)} style={inputStyle}>
                    <option value="Church (General)">Church (General)</option>
                    <option value="C.E Union">C.E Union</option>
                    <option value="Mahila Samiti (Maa sabha)">Mahila Samiti (Maa sabha)</option>
                    <option value="Youth Fellowship">Youth Fellowship</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                {specialWing === 'Others' && (
                  <div>
                    <label style={labelStyle}>Specify Wing Name *</label>
                    <input type="text" required value={customWing} onChange={e => setCustomWing(e.target.value)} style={inputStyle} placeholder="Wing Name" />
                  </div>
                )}
                <div>
                  <label style={labelStyle}>Programme Title *</label>
                  <input type="text" required value={specialTitle} onChange={e => setSpecialTitle(e.target.value)} style={inputStyle} placeholder="e.g. Christmas Eve Celebration" />
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '150px' }}>
                    <label style={labelStyle}>Event Date (From) *</label>
                    <input type="date" required value={specialEventFrom} onChange={e => setSpecialEventFrom(e.target.value)} style={inputStyle} />
                  </div>
                  <div style={{ flex: 1, minWidth: '150px' }}>
                    <label style={labelStyle}>Event Date (To) *</label>
                    <input type="date" required value={specialEventTo} onChange={e => setSpecialEventTo(e.target.value)} style={inputStyle} />
                  </div>
                  <div style={{ width: '120px', minWidth: '100px' }}>
                    <label style={labelStyle}>Duration</label>
                    <input type="text" readOnly value={specialDuration} style={{...inputStyle, background: '#f5f5f5', color: '#666', padding: '1.1rem 0.5rem', textAlign: 'center'}} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Programme Details</label>
                  <textarea value={specialDetails} onChange={e => setSpecialDetails(e.target.value)} style={{...inputStyle, minHeight: '100px'}} placeholder="Write details about the programme..." />
                </div>
                <div>
                  <label style={labelStyle}>Attach Document (1 file max)</label>
                  <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '-0.4rem', marginBottom: '0.8rem' }}>Allowed formats: PDF, DOCX, XLSX, PPT, Images.</p>
                  <input type="file" id="specialFile" onChange={e => handleSingleFileChange(e, setSpecialFile, setSpecialFilePreview)} style={{...inputStyle, padding: '0.9rem'}} />
                  {specialFilePreview && (
                    <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden', background: '#fff', marginTop: '1rem' }}>
                      {specialFilePreview.type === 'image' ? (
                        <img src={specialFilePreview.url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} onClick={() => setFullscreenPreview(specialFilePreview)} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', cursor: 'pointer' }} onClick={() => setFullscreenPreview(specialFilePreview)}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                          <span style={{ fontSize: '0.7rem', marginTop: '4px', color: '#666' }}>Document</span>
                        </div>
                      )}
                      <button type="button" onClick={(e) => { e.stopPropagation(); clearSingleFile('specialFile', setSpecialFile, setSpecialFilePreview, specialFilePreview); }} style={{ position: 'absolute', top: '2px', right: '2px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>&times;</button>
                    </div>
                  )}
                </div>
                <button type="submit" disabled={submitLoading} className="btn-primary" style={{ padding: '1.2rem', fontSize: '1.1rem', fontWeight: '700', borderRadius: '12px', border: 'none', background: 'var(--color-primary)', color: '#fff', cursor: 'pointer', opacity: submitLoading ? 0.6 : 1 }}>{specialEditId ? 'Update Programme' : 'Add Programme +'}</button>
              </div>
            </form>
          )}

          {activeTab === 'speaking' && (
            <form onSubmit={handleSpeakingSubmit} style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: '1.8rem', color: '#111', fontWeight: '800', marginBottom: '2rem' }}>Add Speaking Arrangement</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <label style={labelStyle}>Upload Date * (Auto-filled)</label>
                  <input type="text" readOnly value={displayDate(speakingDate)} style={{...inputStyle, background: '#f0f0f0', color: '#666', cursor: 'not-allowed'}} />
                </div>
                <div>
                  <label style={labelStyle}>Sub-Section *</label>
                  <select required value={speakingSection} onChange={e => setSpeakingSection(e.target.value)} style={inputStyle}>
                    <option value="Sunday Worships">Sunday Worships</option>
                    <option value="Morning prayer">Morning prayer</option>
                    <option value="Monday Prayer">Monday Prayer</option>
                    <option value="C.E Union">C.E Union</option>
                    <option value="Wednesday Prayer">Wednesday Prayer</option>
                    <option value="Zoom Prayer">Zoom Prayer</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Details Space (Optional)</label>
                  <textarea value={speakingDetails} onChange={e => setSpeakingDetails(e.target.value)} style={{...inputStyle, minHeight: '100px'}} placeholder="Write details..." />
                </div>
                <div>
                  <label style={labelStyle}>Attachments (Up to 3)</label>
                  <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '-0.4rem', marginBottom: '0.8rem' }}>Allowed formats: PDF, DOCX, XLSX, PPT, Images.</p>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flexDirection: 'column' }}>
                    <div style={{flex: 1}}>
                      <label style={{...labelStyle, fontSize: '0.85rem', color: '#666'}}>Attachment 1</label>
                      <input type="file" id="spkFile1" onChange={e => handleSingleFileChange(e, setSpeakingFile1, setSpeakingFile1Preview)} style={{...inputStyle, padding: '0.9rem'}} />
                      {speakingFile1Preview && (
                        <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden', background: '#fff', marginTop: '0.5rem' }}>
                          {speakingFile1Preview.type === 'image' ? <img src={speakingFile1Preview.url} style={{width:'100%', height:'100%', objectFit:'cover', cursor: 'pointer'}} onClick={() => setFullscreenPreview(speakingFile1Preview)} /> : <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'#f9f9f9', cursor: 'pointer'}} onClick={() => setFullscreenPreview(speakingFile1Preview)}><span style={{fontSize:'0.6rem', color:'#666'}}>Doc 1</span></div>}
                          <button type="button" onClick={(e) => { e.stopPropagation(); clearSingleFile('spkFile1', setSpeakingFile1, setSpeakingFile1Preview, speakingFile1Preview); }} style={{ position: 'absolute', top: '2px', right: '2px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>&times;</button>
                        </div>
                      )}
                    </div>
                    <div style={{flex: 1, minWidth: '100px'}}>
                      <label style={{...labelStyle, fontSize: '0.85rem', color: '#666'}}>Attachment 2</label>
                      <input type="file" id="spkFile2" onChange={e => handleSingleFileChange(e, setSpeakingFile2, setSpeakingFile2Preview)} style={{...inputStyle, padding: '0.9rem'}} />
                      {speakingFile2Preview && (
                        <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden', background: '#fff', marginTop: '0.5rem' }}>
                          {speakingFile2Preview.type === 'image' ? <img src={speakingFile2Preview.url} style={{width:'100%', height:'100%', objectFit:'cover', cursor: 'pointer'}} onClick={() => setFullscreenPreview(speakingFile2Preview)} /> : <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'#f9f9f9', cursor: 'pointer'}} onClick={() => setFullscreenPreview(speakingFile2Preview)}><span style={{fontSize:'0.6rem', color:'#666'}}>Doc 2</span></div>}
                          <button type="button" onClick={(e) => { e.stopPropagation(); clearSingleFile('spkFile2', setSpeakingFile2, setSpeakingFile2Preview, speakingFile2Preview); }} style={{ position: 'absolute', top: '2px', right: '2px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>&times;</button>
                        </div>
                      )}
                    </div>
                    <div style={{flex: 1, minWidth: '100px'}}>
                      <label style={{...labelStyle, fontSize: '0.85rem', color: '#666'}}>Attachment 3</label>
                      <input type="file" id="spkFile3" onChange={e => handleSingleFileChange(e, setSpeakingFile3, setSpeakingFile3Preview)} style={{...inputStyle, padding: '0.9rem'}} />
                      {speakingFile3Preview && (
                        <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden', background: '#fff', marginTop: '0.5rem' }}>
                          {speakingFile3Preview.type === 'image' ? <img src={speakingFile3Preview.url} style={{width:'100%', height:'100%', objectFit:'cover', cursor: 'pointer'}} onClick={() => setFullscreenPreview(speakingFile3Preview)} /> : <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'#f9f9f9', cursor: 'pointer'}} onClick={() => setFullscreenPreview(speakingFile3Preview)}><span style={{fontSize:'0.6rem', color:'#666'}}>Doc 3</span></div>}
                          <button type="button" onClick={(e) => { e.stopPropagation(); clearSingleFile('spkFile3', setSpeakingFile3, setSpeakingFile3Preview, speakingFile3Preview); }} style={{ position: 'absolute', top: '2px', right: '2px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>&times;</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={submitLoading} className="btn-primary" style={{ padding: '1.2rem', fontSize: '1.1rem', fontWeight: '700', borderRadius: '12px', border: 'none', background: 'var(--color-primary)', color: '#fff', cursor: 'pointer', opacity: submitLoading ? 0.6 : 1 }}>{speakingEditId ? 'Update Arrangement' : 'Add Arrangement'}</button>
              </div>
            </form>
          )}
        </div>

        {/* Past Uploads List */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, var(--color-primary), transparent)', opacity: 0.35 }} />
            <span style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '1.45rem',
              fontStyle: 'italic',
              fontWeight: '600',
              color: 'var(--color-primary)',
              letterSpacing: '0.02em',
              whiteSpace: 'normal',
              textAlign: 'center'
            }}>
              Manage Existing {activeTab === 'weekly' ? 'Notices' : activeTab === 'special' ? 'Programmes' : 'Arrangements'}
            </span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, var(--color-primary), transparent)', opacity: 0.35 }} />
          </div>
          
          {/* Weekly List */}
          {activeTab === 'weekly' && (
            weeklyNotices.length === 0 ? <p style={{ padding: '3rem', textAlign: 'center', color: '#aaa' }}>No notices published yet.</p> :
            weeklyNotices.map((item, i) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1.25rem 2rem', borderBottom: i < weeklyNotices.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', color: '#1a1a1a', margin: '0 0 0.3rem 0', fontWeight: '600' }}>Notice for {new Date(item.release_date).toLocaleDateString()}</h3>
                  <p style={{ fontSize: '0.78rem', color: '#aaa', margin: 0 }}>Docs: {item.documents_json ? JSON.parse(item.documents_json).length : 0}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEditWeekly(item)} style={{ padding: '0.45rem 1rem', background: '#e0f2fe', border: '1px solid #bae6fd', color: '#0369a1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem' }}>Edit</button>
                  <button onClick={() => handleDelete('weekly_notices', item.id)} style={{ padding: '0.45rem 1rem', background: '#fff0f0', border: '1px solid #ffcdd2', color: '#d32f2f', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem' }}>Delete</button>
                </div>
              </div>
            ))
          )}

          {/* Special List */}
          {activeTab === 'special' && (
            specialProgrammes.length === 0 ? <p style={{ padding: '3rem', textAlign: 'center', color: '#aaa' }}>No programmes published yet.</p> :
            specialProgrammes.map((item, i) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1.25rem 2rem', borderBottom: i < specialProgrammes.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', color: '#1a1a1a', margin: '0 0 0.3rem 0', fontWeight: '600' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.78rem', color: '#aaa', margin: 0 }}>{item.wing === 'Others' ? item.custom_wing : item.wing} | {new Date(item.upload_date).toLocaleDateString()}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEditSpecial(item)} style={{ padding: '0.45rem 1rem', background: '#e0f2fe', border: '1px solid #bae6fd', color: '#0369a1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem' }}>Edit</button>
                  <button onClick={() => handleDelete('special_programmes', item.id)} style={{ padding: '0.45rem 1rem', background: '#fff0f0', border: '1px solid #ffcdd2', color: '#d32f2f', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem' }}>Delete</button>
                </div>
              </div>
            ))
          )}

          {/* Speaking List */}
          {activeTab === 'speaking' && (
            speakingArrangements.length === 0 ? <p style={{ padding: '3rem', textAlign: 'center', color: '#aaa' }}>No arrangements published yet.</p> :
            speakingArrangements.map((item, i) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1.25rem 2rem', borderBottom: i < speakingArrangements.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', color: '#1a1a1a', margin: '0 0 0.3rem 0', fontWeight: '600' }}>{item.sub_section}</h3>
                  <p style={{ fontSize: '0.78rem', color: '#aaa', margin: 0 }}>{new Date(item.event_date).toLocaleDateString()}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEditSpeaking(item)} style={{ padding: '0.45rem 1rem', background: '#e0f2fe', border: '1px solid #bae6fd', color: '#0369a1', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem' }}>Edit</button>
                  <button onClick={() => handleDelete('speaking_arrangements', item.id)} style={{ padding: '0.45rem 1rem', background: '#fff0f0', border: '1px solid #ffcdd2', color: '#d32f2f', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem' }}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Fullscreen Preview Overlay */}
      {fullscreenPreview && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1100, display: 'flex', flexDirection: 'column', backdropFilter: 'blur(8px)' }}
          onWheel={handlePreviewWheel}
          onMouseUp={handlePreviewMouseUp}
          onMouseLeave={handlePreviewMouseUp}
          onTouchEnd={handlePreviewMouseUp}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '1rem', gap: '1rem', zIndex: 1102 }}>
            {fullscreenPreview.type === 'image' && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={(e) => { e.stopPropagation(); setPreviewZoom(z => Math.max(z - 0.2, 0.5)); }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
                <button onClick={(e) => { e.stopPropagation(); setPreviewZoom(1); setPreviewPan({x:0, y:0}); }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}>Reset</button>
                <button onClick={(e) => { e.stopPropagation(); setPreviewZoom(z => Math.min(z + 0.2, 5)); }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
              </div>
            )}
            <button 
              onClick={() => setFullscreenPreview(null)} 
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '2.5rem', cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.2s', padding: '0 0.5rem' }}
              onMouseOver={(e) => e.target.style.opacity = '1'}
              onMouseOut={(e) => e.target.style.opacity = '0.8'}
            >
              &times;
            </button>
          </div>
          
          <div 
            style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseDown={fullscreenPreview.type === 'image' ? handlePreviewMouseDown : undefined}
            onMouseMove={fullscreenPreview.type === 'image' ? handlePreviewMouseMove : undefined}
            onTouchStart={fullscreenPreview.type === 'image' ? handlePreviewTouchStart : undefined}
            onTouchMove={fullscreenPreview.type === 'image' ? handlePreviewTouchMove : undefined}
          >
            {fullscreenPreview.type === 'image' ? (
                <img 
                  src={fullscreenPreview.url} 
                  alt="Fullscreen Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain', 
                    borderRadius: '8px', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    transform: `translate(${previewPan.x}px, ${previewPan.y}px) scale(${previewZoom})`,
                    cursor: previewIsDragging ? 'grabbing' : 'grab',
                    transition: previewIsDragging ? 'none' : 'transform 0.1s ease-out',
                    userSelect: 'none'
                  }} 
                  draggable={false}
                />
            ) : (
                <iframe src={fullscreenPreview.url} style={{ width: '90%', height: '90%', border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
            )}
          </div>
        </div>
      )}

    </>
  )
}
