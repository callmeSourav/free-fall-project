import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  if (!params.postId) {
    return NextResponse.json(
      { error: 'Post ID is required' },
      { status: 400 }
    )
  }

  try {
    const { content } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: params.postId,
      }
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Failed to create comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
} 