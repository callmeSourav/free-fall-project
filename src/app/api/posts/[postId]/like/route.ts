import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    const post = await prisma.post.findUnique({
      where: { id: params.postId }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const like = await prisma.like.create({
      data: {
        postId: params.postId,
      },
    })

    const likes = await prisma.like.findMany({
      where: {
        postId: params.postId,
      },
    })

    return NextResponse.json({ likes })
  } catch (error) {
    console.error('Failed to like post:', error)
    return NextResponse.json(
      { error: 'Failed to like post' },
      { status: 500 }
    )
  }
} 