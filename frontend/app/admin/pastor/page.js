'use client'

import { useAuth } from '@/components/AuthContext'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'

export default function PastorPortal() {
  const { user, token, loading, logout } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  
  const [blogs, setBlogs] = useState([])
  const [editId, setEditId] = useState(null)
  
  const [customAuthor, setCustomAuthor] = useState('Pastor')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [pdf, setPdf] = useState(null)
  
  const [image1Preview, setImage1Preview] = useState(null)
  const [image2Preview, setImage2Preview] = useState(null)
  const [pdfPreview, setPdfPreview] = useState(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  
  const [submitLoading, setSubmitLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, type: '', text: '' })
  const [fullscreenPreview, setFullscreenPreview] = useState(null)
  const toastRef = useRef(null)
  const pageTopRef = useRef(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api'

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_URL}/blogs.php`)
      if (!res.ok) {
        console.warn("Failed to load blogs: HTTP " + res.status)
        return
      }
      const data = await res.json()
      if (Array.isArray(data)) setBlogs(data)
    } catch (err) {
      console.warn("Failed to load blogs", err)
    }
  }

  useEffect(() => {
    setMounted(true)
    if (!loading) {
      if (!user) {
        router.push('/admin/login')
      } else if (user.designation !== 'Pastor' && user.designation !== 'Developer') {
        router.push('/admin')
      } else {
        fetchBlogs()
        
        // Check if just logged in
        if (localStorage.getItem('just_logged_in') === 'true') {
          setTimeout(() => {
            showToast('success', 'Welcome Pastor, login successful')
          }, 300)
          localStorage.removeItem('just_logged_in')
        }
      }
    }
  }, [user, loading, router])

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (image1Preview) URL.revokeObjectURL(image1Preview)
      if (image2Preview) URL.revokeObjectURL(image2Preview)
      if (pdfPreview) URL.revokeObjectURL(pdfPreview)
    }
  }, [image1Preview, image2Preview, pdfPreview])

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)

    if (type === 'image1') {
      if (image1Preview) URL.revokeObjectURL(image1Preview)
      setImage1(file)
      setImage1Preview(previewUrl)
    } else if (type === 'image2') {
      if (image2Preview) URL.revokeObjectURL(image2Preview)
      setImage2(file)
      setImage2Preview(previewUrl)
    } else if (type === 'pdf') {
      if (pdfPreview) URL.revokeObjectURL(pdfPreview)
      setPdf(file)
      setPdfPreview(previewUrl)
    }
  }

  const clearFile = (type) => {
    if (type === 'image1') {
      setImage1(null)
      if (image1Preview) URL.revokeObjectURL(image1Preview)
      setImage1Preview(null)
      if (document.getElementById('image1')) document.getElementById('image1').value = ''
    } else if (type === 'image2') {
      setImage2(null)
      if (image2Preview) URL.revokeObjectURL(image2Preview)
      setImage2Preview(null)
      if (document.getElementById('image2')) document.getElementById('image2').value = ''
    } else if (type === 'pdf') {
      setPdf(null)
      if (pdfPreview) URL.revokeObjectURL(pdfPreview)
      setPdfPreview(null)
      if (document.getElementById('pdf')) document.getElementById('pdf').value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const hasText = title.trim() && content.trim();
    const hasFile = !!image1 || !!image2 || !!pdf;
    // Wait, the existing file previews should also count as having a file when editing
    const hasExistingFile = !!image1Preview || !!image2Preview || !!pdfPreview;
    if (!hasText && !hasFile && !hasExistingFile) return showToast('error', 'Please provide either Title & Content, or an Attachment.')
    
    setSubmitLoading(true)
    
    try {
      let formData = new FormData();
      if (editId) formData.append('id', editId);
      formData.append('title', title);
      formData.append('custom_author', customAuthor);
      formData.append('content', content);
      if (image1) formData.append('image1', image1);
      if (image2) formData.append('image2', image2);
      if (pdf) formData.append('pdf', pdf);

      const res = await fetch(`${API_URL}/blogs.php`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      if (res.ok) {
        showToast('success', editId ? 'Blog updated successfully!' : 'Blog & Inspiration published successfully!')
        resetForm()
        fetchBlogs()
      } else {
        const error = await res.json()
        showToast('error', error.error || 'Failed to publish blog.')
      }
    } catch (err) {
      showToast('error', 'An unexpected error occurred while publishing.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this blog?")) return;
    
    try {
      const res = await fetch(`${API_URL}/blogs.php`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        showToast('success', 'Blog deleted successfully.');
        fetchBlogs();
        if (editId === id) resetForm();
      } else {
        showToast('error', 'Failed to delete blog.');
      }
    } catch (err) {
      showToast('error', 'An unexpected error occurred.');
    }
  }

  const handleEdit = (blog) => {
    setEditId(blog.id);
    setCustomAuthor(blog.custom_author || blog.author_name || 'Pastor');
    setTitle(blog.title);
    setContent(blog.content);
    // Keep previews of existing files
    setImage1(null); setImage2(null); setPdf(null);
    setImage1Preview(blog.image1_path || null);
    setImage2Preview(blog.image2_path || null);
    setPdfPreview(blog.pdf_path || null);
    if (document.getElementById('image1')) document.getElementById('image1').value = "";
    if (document.getElementById('image2')) document.getElementById('image2').value = "";
    if (document.getElementById('pdf')) document.getElementById('pdf').value = "";
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const showToast = (type, text) => {
    setToast({ show: true, type, text })
    // Scroll the toast into view
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      // Animate the toast in
      if (toastRef.current) {
        gsap.fromTo(toastRef.current,
          { opacity: 0, y: -16 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        )
      }
    }, 80)
    // Auto-hide after 5s
    setTimeout(() => {
      if (toastRef.current) {
        gsap.to(toastRef.current, {
          opacity: 0, y: -10, duration: 0.3, ease: 'power2.in',
          onComplete: () => setToast({ show: false, type: '', text: '' })
        })
      } else {
        setToast({ show: false, type: '', text: '' })
      }
    }, 5000)
  }

  const resetForm = () => {
    setEditId(null)
    setCustomAuthor('Pastor')
    setTitle('')
    setContent('')
    setImage1(null); setImage2(null); setPdf(null);
    setImage1Preview(null); setImage2Preview(null); setPdfPreview(null);
    if (document.getElementById('image1')) document.getElementById('image1').value = "";
    if (document.getElementById('image2')) document.getElementById('image2').value = "";
    if (document.getElementById('pdf')) document.getElementById('pdf').value = "";
  }

  if (loading || !user) {
    return (
      <div className="section container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="jumping-dots"><span></span><span></span><span></span></div>
      </div>
    )
  }

  const inputStyle = {
    width: '100%',
    padding: '1.1rem 1.2rem',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    fontSize: '1rem',
    fontFamily: 'inherit',
    backgroundColor: '#fafafa',
    transition: 'all 0.2s ease'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.6rem',
    fontWeight: 600,
    color: '#333',
    fontSize: '0.95rem'
  };

  return (
    <>
      {/* Logout Confirmation Modal - Moved to React Portal to guarantee perfectly centered fixed positioning */}
      {showLogoutConfirm && mounted && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '20px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxWidth: '400px', width: '90%' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem', color: '#111', fontWeight: '800' }}>Ready to Leave?</h3>
            <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.5 }}>Are you sure you want to log out of the pastor dashboard?</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => setShowLogoutConfirm(false)} style={{ flex: 1, padding: '0.8rem', background: '#f5f5f5', color: '#444', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', fontSize: '1rem' }} onMouseOver={(e) => { e.target.style.background = '#ebebeb'; e.target.style.transform = 'translateY(-2px)' }} onMouseOut={(e) => { e.target.style.background = '#f5f5f5'; e.target.style.transform = 'translateY(0)' }}>Stay Logged In</button>
              <button onClick={logout} style={{ flex: 1, padding: '0.8rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', fontSize: '1rem', boxShadow: '0 4px 15px rgba(139,0,0,0.2)' }} onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(139,0,0,0.3)' }} onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(139,0,0,0.2)' }}>Yes, Log Out</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Inline Toast Banner - Now absolutely fixed to the top center of viewport */}
      {toast.show && (
        <div
          ref={toastRef}
          style={{
            position: 'fixed',
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '1rem 1.5rem',
            width: 'max-content',
            maxWidth: '90%',
            borderRadius: '12px',
            background: toast.type === 'success' ? '#f0fdf4' : '#fff5f5',
            border: `1px solid ${toast.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
          }}
        >
          {/* Icon */}
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
            background: toast.type === 'success' ? '#dcfce7' : '#fee2e2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: toast.type === 'success' ? '#16a34a' : '#dc2626'
          }}>
            {toast.type === 'success'
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            }
          </div>
          <p style={{
            flex: 1,
            margin: 0,
            fontSize: '0.95rem',
            fontWeight: '600',
            color: toast.type === 'success' ? '#15803d' : '#b91c1c',
            fontFamily: 'var(--font-body)'
          }}>{toast.text}</p>
          <button
            onClick={() => setToast({ show: false, type: '', text: '' })}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '1.2rem', lineHeight: 1, padding: '0.1rem 0.3rem' }}
          >×</button>
        </div>
      )}

    <div className="section container" style={{ paddingTop: '100px', paddingBottom: '4rem', maxWidth: '900px' }}>
      {/* Scroll anchor */}
      <div ref={pageTopRef} style={{ position: 'relative', top: '-20px' }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', color: '#111', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-1px' }}>
            Pastor Dashboard
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.8rem' }}>
            Welcome back, <strong style={{color: 'var(--color-primary)'}}>{user.full_name}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {user.designation === 'Developer' && (
            <button onClick={() => router.push('/admin')} style={{ padding: '0.7rem 1.8rem', border: '1px solid #444', color: '#444', backgroundColor: 'transparent', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s ease' }} onMouseOver={(e) => { e.target.style.backgroundColor = '#f5f5f5'; }} onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; }}>
              ← Back to Developer Portal
            </button>
          )}
          <button 
            onClick={() => setShowLogoutConfirm(true)} 
            style={{ padding: '0.7rem 1.8rem', border: 'none', color: '#fff', backgroundColor: 'var(--color-primary)', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s ease', boxShadow: '0 4px 15px rgba(139,0,0,0.2)' }}
            onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(139,0,0,0.3)'; }}
            onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(139,0,0,0.2)'; }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Card (Publish/Edit) */}
      <div style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fcfcfc 100%)', padding: 'clamp(2rem, 5vw, 3.5rem)', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)', marginBottom: '4rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* Subtle decorative background element */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139,0,0,0.03) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }} />

        <div style={{ borderBottom: '1px solid #eaeaea', paddingBottom: '1.5rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1 }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: editId ? 'var(--color-primary)' : '#111', fontWeight: '800', letterSpacing: '-0.5px' }}>
              {editId ? 'Edit Existing Blog' : 'Publish a New Blog'}
            </h2>
            <p style={{ color: '#666', fontSize: '0.95rem', marginTop: '0.5rem', lineHeight: '1.6' }}>
              {editId ? 'Make changes to your blog below. If you do not upload new files, the old ones will be kept.' : 'Share an inspirational message with the congregation. Click on a file after selecting to preview it.'}
            </p>
          </div>
          {editId && (
            <button onClick={resetForm} style={{ padding: '0.6rem 1.2rem', background: '#f5f5f5', color: '#444', border: '1px solid #ddd', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }} onMouseOver={(e) => e.target.style.background='#eaeaea'} onMouseOut={(e) => e.target.style.background='#f5f5f5'}>
              Cancel Edit
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', zIndex: 1 }}>
          
          <div>
            <label style={labelStyle}>Author of the Blog</label>
            <input 
              type="text" 
              value={customAuthor}
              onChange={(e) => setCustomAuthor(e.target.value)}
              style={inputStyle} 
              placeholder="e.g., Pastor"
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.backgroundColor = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(139,0,0,0.05)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#eaeaea'; e.target.style.backgroundColor = '#fcfcfc'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div>
            <label style={labelStyle}>Blog Topic / Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle} 
              placeholder="e.g., Finding Peace in the Storm"
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.backgroundColor = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(139,0,0,0.05)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#eaeaea'; e.target.style.backgroundColor = '#fcfcfc'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Attachment 1 (Image)</label>
              <input 
                type="file" 
                id="image1"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'image1')}
                style={{...inputStyle, padding: '0.9rem', cursor: 'pointer', fontSize: '0.9rem'}} 
              />
              {image1Preview && (
                <div onClick={() => setFullscreenPreview({ url: image1Preview, type: 'image' })} style={{ marginTop: '1rem', width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden', cursor: 'zoom-in', border: '3px solid #fff', transition: 'transform 0.2s', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  <img src={image1Preview} alt="Preview 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Attachment 2 (Image)</label>
              <input 
                type="file" 
                id="image2"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'image2')}
                style={{...inputStyle, padding: '0.9rem', cursor: 'pointer', fontSize: '0.9rem'}} 
              />
              {image2Preview && (
                <div onClick={() => setFullscreenPreview({ url: image2Preview, type: 'image' })} style={{ marginTop: '1rem', width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden', cursor: 'zoom-in', border: '3px solid #fff', transition: 'transform 0.2s', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  <img src={image2Preview} alt="Preview 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>

          <div>
            <label style={labelStyle}>PDF Document (Optional)</label>
            <input 
              type="file" 
              id="pdf"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, 'pdf')}
              style={{...inputStyle, padding: '0.9rem', cursor: 'pointer', fontSize: '0.9rem'}} 
            />
            {pdfPreview && (
               <div onClick={() => setFullscreenPreview({ url: pdfPreview, type: 'pdf' })} style={{ marginTop: '1rem', cursor: 'zoom-in', padding: '0.8rem 1.2rem', background: '#f8f9fa', borderRadius: '10px', border: '1px solid #eaeaea', display: 'inline-flex', alignItems: 'center', gap: '0.8rem', color: '#111', fontWeight: '600', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} onMouseOver={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(139,0,0,0.08)'; }} onMouseOut={(e) => { e.currentTarget.style.background = '#f8f9fa'; e.currentTarget.style.borderColor = '#eaeaea'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'; }}>
                 <span style={{ fontSize: '1.2rem' }}>📄</span> Click to Preview PDF
               </div>
            )}
            <span style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem', display: 'block' }}>Max 1 PDF allowed. Useful for newsletters or detailed reading.</span>
          </div>

          <div>
            <label style={labelStyle}>Blog Content</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ ...inputStyle, minHeight: '350px', resize: 'vertical', lineHeight: '1.7', fontSize: '1.05rem' }} 
              placeholder="Write your inspirational message here..."
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.backgroundColor = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(139,0,0,0.05)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#eaeaea'; e.target.style.backgroundColor = '#fcfcfc'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <button 
            type="submit" 
            disabled={submitLoading} 
            className="btn-primary" 
            style={{ 
              padding: '1.2rem', 
              fontSize: '1.1rem', 
              fontWeight: '700',
              marginTop: '1.5rem', 
              opacity: submitLoading ? 0.6 : 1, 
              cursor: submitLoading ? 'not-allowed' : 'pointer', 
              border: 'none',
              borderRadius: '12px',
              transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
              boxShadow: '0 8px 20px rgba(139, 0, 0, 0.2)'
            }}
            onMouseOver={(e) => { if(!submitLoading) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 25px rgba(139, 0, 0, 0.3)'; } }}
            onMouseOut={(e) => { if(!submitLoading) { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 20px rgba(139, 0, 0, 0.2)'; } }}
          >
            {submitLoading ? (editId ? 'Updating...' : 'Publishing to Website...') : (editId ? 'Save Changes' : 'Publish Blog')}
          </button>
        </form>
      </div>

      {/* Existing Blogs List */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '16px', 
        border: '1px solid #f0f0f0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        overflow: 'hidden'
      }}>
        {/* List header */}
        <div style={{ 
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #f5f5f5',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, var(--color-primary), transparent)', opacity: 0.35 }} />
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '1.45rem',
            fontStyle: 'italic',
            fontWeight: '600',
            color: 'var(--color-primary)',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap'
          }}>
            Manage Existing Blogs
          </span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, var(--color-primary), transparent)', opacity: 0.35 }} />
        </div>
        
        {blogs.length === 0 ? (
          <p style={{ 
            color: '#aaa', 
            textAlign: 'center', 
            padding: '3rem', 
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem'
          }}>No blogs published yet.</p>
        ) : (
          <div>
            {blogs.map((blog, i) => (
              <div 
                key={blog.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  flexWrap: 'wrap', 
                  gap: '1rem', 
                  padding: '1.25rem 2rem', 
                  borderBottom: i < blogs.length - 1 ? '1px solid #f5f5f5' : 'none',
                  transition: 'background 0.15s ease',
                  background: '#fff'
                }} 
                onMouseOver={(e) => e.currentTarget.style.background = '#fdf9f9'}
                onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ 
                    fontSize: '1rem', 
                    color: '#1a1a1a', 
                    margin: '0 0 0.3rem 0', 
                    fontWeight: '600',
                    fontFamily: 'var(--font-heading)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>{blog.title}</h3>
                  <p style={{ 
                    fontSize: '0.78rem', 
                    color: '#aaa', 
                    margin: 0,
                    fontFamily: 'var(--font-body)'
                  }}>
                    {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexShrink: 0 }}>
                  <button 
                    onClick={() => handleEdit(blog)} 
                    style={{ 
                      padding: '0.45rem 1rem', 
                      background: 'transparent', 
                      border: '1px solid var(--color-primary)', 
                      color: 'var(--color-primary)', 
                      borderRadius: '6px', 
                      cursor: 'pointer', 
                      fontWeight: '600', 
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-heading)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(blog.id)} 
                    style={{ 
                      padding: '0.45rem 1rem', 
                      background: '#fff0f0', 
                      border: '1px solid #ffcdd2', 
                      color: '#d32f2f', 
                      borderRadius: '6px', 
                      cursor: 'pointer', 
                      fontWeight: '600', 
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-heading)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#ffebee'; e.currentTarget.style.borderColor = '#d32f2f'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = '#fff0f0'; e.currentTarget.style.borderColor = '#ffcdd2'; }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal replaced by inline toast banner above — see top of page */}

      {/* Fullscreen Preview Overlay */}
      {fullscreenPreview && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1100, display: 'flex', flexDirection: 'column', backdropFilter: 'blur(8px)', touchAction: 'none' }}>
          <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '1rem', zIndex: 1102 }}>
            <button 
              onClick={() => setFullscreenPreview(null)} 
              style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', fontSize: '2.5rem', cursor: 'pointer', transition: 'background 0.2s', padding: '0.2rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseOver={(e) => e.target.style.background = 'rgba(220,38,38,0.8)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(0,0,0,0.5)'}
            >
              &times;
            </button>
          </div>
          
          <div style={{ flex: 1, width: '100%', height: '100%', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {fullscreenPreview.type === 'image' ? (
                <img src={fullscreenPreview.url} alt="Fullscreen Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
            ) : (
                <iframe src={fullscreenPreview.url} style={{ width: '90%', height: '90%', border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  </>
  )
}
