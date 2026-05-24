import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    // RBAC Security Check
    if (!session || !['Senior Pastor', 'Associate Pastor', 'Youth Pastor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden: Unauthorized access' }, { status: 403 })
    }

    const { id } = await params
    
    // Find post to verify ownership
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    // Allow if they are the author
    if (post.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden: You can only delete your own posts' }, { status: 403 })
    }

    await prisma.post.delete({ where: { id } })
    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['Senior Pastor', 'Associate Pastor', 'Youth Pastor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden: Unauthorized access' }, { status: 403 })
    }

    const { id } = await params
    
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    if (post.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden: You can only edit your own posts' }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, thumbnail_url } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        thumbnail: thumbnail_url,
      }
    })

    return NextResponse.json(updatedPost, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}
