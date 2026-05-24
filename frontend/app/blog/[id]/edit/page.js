import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../api/auth/[...nextauth]/route'
import { notFound, redirect } from 'next/navigation'
import EditBlogForm from './EditBlogForm'

const prisma = new PrismaClient()

export default async function EditBlogPage({ params }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  
  if (!session || !['Senior Pastor', 'Associate Pastor', 'Youth Pastor'].includes(session.user.role)) {
    redirect('/admin')
  }

  const post = await prisma.post.findUnique({
    where: { id }
  })

  if (!post) {
    notFound()
  }

  if (post.authorId !== session.user.id) {
    return (
      <div className="section container" style={{ marginTop: '100px', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-primary)' }}>Access Denied</h1>
        <p>You do not have permission to edit this article.</p>
      </div>
    )
  }

  return (
    <div className="section container" style={{ marginTop: '80px', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--color-primary)' }}>Edit Article</h1>
      
      <div style={{ backgroundColor: 'var(--color-white)', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        <EditBlogForm post={post} />
      </div>
    </div>
  )
}
