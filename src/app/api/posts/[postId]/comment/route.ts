import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { content } = await request.json()
    const { postId } = params

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
      },
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