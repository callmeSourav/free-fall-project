import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        comments: true,
        likes: true,
      },
    })
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { content, mood } = await request.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      )
    }

    if (mood && !['happy', 'neutral', 'sad', 'angry'].includes(mood)) {
      return NextResponse.json(
        { error: 'Invalid mood value' },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        content,
        mood: mood || 'neutral',
      },
      include: {
        comments: true,
        likes: true,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Failed to create post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
} 