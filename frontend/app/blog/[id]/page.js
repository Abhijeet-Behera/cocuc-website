import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]/route'
import AdminBlogControls from '@/components/AdminBlogControls'

const prisma = new PrismaClient()

export default async function BlogPostPage({ params }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: { name: true, role: true }
      }
    }
  })

  if (!post) {
    notFound()
  }

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* Hero Header */}
      <section style={{ backgroundColor: 'var(--color-primary-dark)', color: 'var(--color-white)', padding: '150px 0 80px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span style={{ display: 'inline-block', backgroundColor: 'var(--color-primary-light)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>
            {post.authorTitle}
          </span>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>{post.title}</h1>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', opacity: 0.9, fontSize: '1.1rem' }}>
            <span>By {post.author?.name || 'Unknown Author'}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container" style={{ maxWidth: '800px', marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        <div style={{ backgroundColor: 'var(--color-white)', padding: '4rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid rgba(0,0,0,0.05)' }}>
          {post.thumbnail && (
            <div style={{ width: '100%', height: '350px', marginBottom: '3rem', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <img src={post.thumbnail} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          
          <div style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>
            {post.content}
          </div>
          
          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <Link href="/#sermons" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '1.1rem', textDecoration: 'none' }} className="hover-scale">
              &larr; Back to Home
            </Link>
            
            {/* Admin Controls */}
            {session && session.user.id === post.authorId && (
              <AdminBlogControls postId={post.id} />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
