'use client'

import { useAuth } from '@/components/AuthContext'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PastorPortal() {
  const { user, token, loading, logout } = useAuth()
  const router = useRouter()
  
  const [blogs, setBlogs] = useState([])
  const [editId, setEditId] = useState(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [pdf, setPdf] = useState(null)
  
  const [image1Preview, setImage1Preview] = useState(null)
  const [image2Preview, setImage2Preview] = useState(null)
  const [pdfPreview, setPdfPreview] = useState(null)
  
  const [submitLoading, setSubmitLoading] = useState(false)
  const [modalInfo, setModalInfo] = useState({ show: false, type: '', text: '' })
  const [fullscreenPreview, setFullscreenPreview] = useState(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unionchurch.in/api'

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_URL}/blogs.php`)
      const data = await res.json()
      if (Array.isArray(data)) setBlogs(data)
    } catch (err) {
      console.error("Failed to load blogs")
    }
  }

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/admin/login')
      } else if (user.designation !== 'Pastor') {
        router.push('/admin')
      } else {
        fetchBlogs()
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitLoading(true)
    
    try {
      let formData = new FormData();
      if (editId) formData.append('id', editId);
      formData.append('title', title);
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
        setModalInfo({ show: true, type: 'success', text: editId ? 'Blog updated successfully!' : 'Blog & Inspiration published successfully!' })
        resetForm()
        fetchBlogs()
      } else {
        const error = await res.json()
        setModalInfo({ show: true, type: 'error', text: error.error || 'Failed to publish blog.' })
      }
    } catch (err) {
      setModalInfo({ show: true, type: 'error', text: 'An unexpected error occurred while publishing.' })
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
        setModalInfo({ show: true, type: 'success', text: 'Blog deleted successfully.' });
        fetchBlogs();
        if (editId === id) resetForm();
      } else {
        setModalInfo({ show: true, type: 'error', text: 'Failed to delete blog.' });
      }
    } catch (err) {
      setModalInfo({ show: true, type: 'error', text: 'An unexpected error occurred.' });
    }
  }

  const handleEdit = (blog) => {
    setEditId(blog.id);
    setTitle(blog.title);
    setContent(blog.content);
    // Clear current file inputs so user doesn't overwrite accidentally
    setImage1(null); setImage2(null); setPdf(null);
    setImage1Preview(null); setImage2Preview(null); setPdfPreview(null);
    if (document.getElementById('image1')) document.getElementById('image1').value = "";
    if (document.getElementById('image2')) document.getElementById('image2').value = "";
    if (document.getElementById('pdf')) document.getElementById('pdf').value = "";
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const resetForm = () => {
    setEditId(null)
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
    <div className="section container" style={{ paddingTop: '100px', paddingBottom: '4rem', maxWidth: '900px' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', color: 'var(--color-primary)', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.5px' }}>
            Pastor Dashboard
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Welcome back, <strong style={{color: '#111'}}>{user.full_name}</strong>
          </p>
        </div>
        <button 
          onClick={logout} 
          style={{ padding: '0.7rem 1.5rem', border: '2px solid var(--color-primary)', color: 'var(--color-primary)', backgroundColor: 'transparent', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s ease' }}
          onMouseOver={(e) => { e.target.style.backgroundColor = 'var(--color-primary)'; e.target.style.color = '#fff'; }}
          onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'var(--color-primary)'; }}
        >
          Sign Out
        </button>
      </div>

      {/* Main Card (Publish/Edit) */}
      <div style={{ backgroundColor: '#ffffff', padding: 'clamp(1.5rem, 5vw, 3.5rem)', borderRadius: '24px', boxShadow: '0 12px 40px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)', marginBottom: '3rem' }}>
        
        <div style={{ borderBottom: '2px solid #f5f5f5', paddingBottom: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: editId ? 'var(--color-primary)' : '#111', fontWeight: '700' }}>
              {editId ? 'Edit Existing Blog' : 'Publish a New Blog'}
            </h2>
            <p style={{ color: '#666', fontSize: '0.95rem', marginTop: '0.4rem', lineHeight: '1.5' }}>
              {editId ? 'Make changes to your blog below. If you do not upload new files, the old ones will be kept.' : 'Share an inspirational message with the congregation. Click on a file after selecting to preview it.'}
            </p>
          </div>
          {editId && (
            <button onClick={resetForm} style={{ padding: '0.5rem 1rem', background: '#f5f5f5', color: '#555', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              Cancel Edit
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div>
            <label style={labelStyle}>Blog Topic / Title *</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle} 
              placeholder="e.g., Finding Peace in the Storm"
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.backgroundColor = '#fff'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.backgroundColor = '#fafafa'; }}
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
                <div onClick={() => setFullscreenPreview({ url: image1Preview, type: 'image' })} style={{ marginTop: '1rem', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', cursor: 'zoom-in', border: '2px solid #eee', transition: 'transform 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
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
                <div onClick={() => setFullscreenPreview({ url: image2Preview, type: 'image' })} style={{ marginTop: '1rem', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', cursor: 'zoom-in', border: '2px solid #eee', transition: 'transform 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
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
               <div onClick={() => setFullscreenPreview({ url: pdfPreview, type: 'pdf' })} style={{ marginTop: '1rem', cursor: 'zoom-in', padding: '0.8rem 1.2rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd', display: 'inline-flex', alignItems: 'center', gap: '0.8rem', color: '#333', fontWeight: '500', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#e9ecef'} onMouseOut={(e) => e.currentTarget.style.background = '#f8f9fa'}>
                 📄 Click to Preview PDF
               </div>
            )}
            <span style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.4rem', display: 'block' }}>Max 1 PDF allowed. Useful for newsletters or detailed reading.</span>
          </div>

          <div>
            <label style={labelStyle}>Blog Content *</label>
            <textarea 
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ ...inputStyle, minHeight: '350px', resize: 'vertical', lineHeight: '1.6' }} 
              placeholder="Write your inspirational message here..."
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.backgroundColor = '#fff'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.backgroundColor = '#fafafa'; }}
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
              marginTop: '1rem', 
              opacity: submitLoading ? 0.6 : 1, 
              cursor: submitLoading ? 'not-allowed' : 'pointer', 
              border: 'none',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(128, 0, 0, 0.2)'
            }}
          >
            {submitLoading ? (editId ? 'Updating...' : 'Publishing to Website...') : (editId ? 'Save Changes' : 'Publish Blog')}
          </button>
        </form>
      </div>

      {/* Existing Blogs List */}
      <div style={{ backgroundColor: '#ffffff', padding: 'clamp(1.5rem, 5vw, 2.5rem)', borderRadius: '24px', boxShadow: '0 12px 40px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#111', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '2px solid #f5f5f5', paddingBottom: '1rem' }}>Manage Existing Blogs</h2>
        
        {blogs.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '2rem 0' }}>No blogs published yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {blogs.map(blog => (
              <div key={blog.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee', background: '#fafafa', transition: 'all 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#ddd'} onMouseOut={(e) => e.currentTarget.style.borderColor = '#eee'}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: '#111', margin: '0 0 0.5rem 0', fontWeight: '600' }}>{blog.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>
                    {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button 
                    onClick={() => handleEdit(blog)} 
                    style={{ padding: '0.5rem 1rem', background: '#fff', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: 'background 0.2s' }}
                    onMouseOver={(e) => { e.target.style.background = 'var(--color-primary)'; e.target.style.color = '#fff'; }}
                    onMouseOut={(e) => { e.target.style.background = '#fff'; e.target.style.color = 'var(--color-primary)'; }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(blog.id)} 
                    style={{ padding: '0.5rem 1rem', background: '#fff', border: '1px solid #c62828', color: '#c62828', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: 'background 0.2s' }}
                    onMouseOver={(e) => { e.target.style.background = '#c62828'; e.target.style.color = '#fff'; }}
                    onMouseOut={(e) => { e.target.style.background = '#fff'; e.target.style.color = '#c62828'; }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Success/Error Modal Overlay */}
      {modalInfo.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#fff', padding: '2.5rem 2rem', borderRadius: '20px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', maxWidth: '420px', width: '100%', textAlign: 'center', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              {modalInfo.type === 'success' ? (
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2e7d32' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              ) : (
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c62828' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                </div>
              )}
            </div>
            <h3 style={{ margin: '0 0 1rem 0', color: '#111', fontSize: '1.5rem', fontWeight: '800' }}>
              {modalInfo.type === 'success' ? 'Success' : 'Action Failed'}
            </h3>
            <p style={{ color: '#555', marginBottom: '2rem', fontSize: '1.05rem', lineHeight: '1.5' }}>
              {modalInfo.text}
            </p>
            <button 
              onClick={() => setModalInfo({show: false, type: '', text: ''})} 
              style={{ width: '100%', padding: '1rem', backgroundColor: modalInfo.type === 'success' ? 'var(--color-primary)' : '#c62828', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '1.05rem', transition: 'opacity 0.2s' }}
              onMouseOver={(e) => e.target.style.opacity = '0.9'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              Okay
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Preview Overlay */}
      {fullscreenPreview && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backdropFilter: 'blur(8px)' }}>
          <button 
            onClick={() => setFullscreenPreview(null)} 
            style={{ position: 'absolute', top: '20px', right: '30px', background: 'transparent', border: 'none', color: '#fff', fontSize: '3rem', cursor: 'pointer', zIndex: 1101, opacity: 0.7, transition: 'opacity 0.2s' }}
            onMouseOver={(e) => e.target.style.opacity = '1'}
            onMouseOut={(e) => e.target.style.opacity = '0.7'}
          >
            &times;
          </button>
          
          {fullscreenPreview.type === 'image' ? (
              <img src={fullscreenPreview.url} alt="Fullscreen Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
          ) : (
              <iframe src={fullscreenPreview.url} style={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
