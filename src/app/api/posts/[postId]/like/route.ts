import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params

    const like = await prisma.like.create({
      data: {
        postId,
      },
    })

    const likes = await prisma.like.findMany({
      where: {
        postId,
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