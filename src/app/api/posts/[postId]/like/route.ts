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
    const post = await prisma.post.update({
      where: { id: params.postId },
      data: {
        likes: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ likes: post.likes })
  } catch (error) {
    console.error('Failed to like post:', error)
    return NextResponse.json(
      { error: 'Failed to like post' },
      { status: 500 }
    )
  }
} 