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

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { content } = await request.json()
    const { postId } = params

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

    // First check if the post exists
    const post = await withRetry(() =>
      prisma.post.findUnique({
        where: {
          id: postId,
        },
      })
    )

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Then create the comment
    const comment = await withRetry(() =>
      prisma.comment.create({
        data: {
          content,
          postId,
        },
      })
    )

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Failed to create comment:', error)
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
      { error: 'Failed to create comment. Please try again.' },
      { status: 500 }
    )
  }
} 