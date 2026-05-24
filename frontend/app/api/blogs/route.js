import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const blogs = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, role: true }
        }
      }
    })
    return NextResponse.json(blogs, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    // RBAC Security Check
    if (!session || !['Senior Pastor', 'Associate Pastor', 'Youth Pastor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden: Unauthorized access' }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, thumbnail_url } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        thumbnail: thumbnail_url,
        authorTitle: session.user.role,
        authorId: session.user.id
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}
