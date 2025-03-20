import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: any
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      console.error(`Attempt ${i + 1} failed:`, error)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
  }
  throw lastError
}

export async function GET() {
  try {
    const posts = await withRetry(() => 
      prisma.post.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          comments: true,
        },
      })
    )

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: 'Database connection error. Please try again later.' },
        { status: 503 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch posts. Please try again later.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content, mood } = body

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const post = await withRetry(() =>
      prisma.post.create({
        data: {
          content,
          mood: mood || 'neutral',
        },
        include: {
          comments: true,
        },
      })
    )

    return NextResponse.json(post)
  } catch (error) {
    console.error('Failed to create post:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: 'Database connection error. Please try again later.' },
        { status: 503 }
      )
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON data' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create post. Please try again.' },
      { status: 500 }
    )
  }
} 