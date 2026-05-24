'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminBlogControls({ postId }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this article? This action cannot be undone.")
    if (!confirmDelete) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/blogs/${postId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert("Article deleted successfully.")
        router.push('/')
        router.refresh()
      } else {
        const data = await res.json()
        alert(`Failed to delete: ${data.error}`)
      }
    } catch (err) {
      alert("An unexpected error occurred while deleting.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
      <Link href={`/blog/${postId}/edit`} className="btn-primary hover-scale" style={{ backgroundColor: '#e6a200', color: 'white', textDecoration: 'none' }}>
        Edit Article
      </Link>
      <button 
        onClick={handleDelete} 
        disabled={isDeleting}
        className="btn-primary hover-scale" 
        style={{ backgroundColor: '#cc0000', opacity: isDeleting ? 0.7 : 1 }}
      >
        {isDeleting ? 'Deleting...' : 'Delete Article'}
      </button>
    </div>
  )
}
