'use client'

import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import io, { Socket } from 'socket.io-client'
import PostCard from '@/components/PostCard'

interface Post {
  id: string
  content: string
  mood: string
  createdAt: string
  comments: Comment[]
  likes: number
}

interface Comment {
  id: string
  content: string
  postId: string
  createdAt: string
}

export default function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const response = await fetch(`${apiUrl}/api/posts`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch posts')
        }
        const data = await response.json()
        setPosts(data)
      } catch (error: any) {
        console.error('Error fetching posts:', error)
        toast.error(error.message || 'Failed to load posts')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    const initSocket = async () => {
      try {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002'
        const newSocket = io(socketUrl, {
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        })

        newSocket.on('connect', () => {
          console.log('Connected to WebSocket server')
        })

        newSocket.on('post-created', (newPost: Post) => {
          setPosts(prevPosts => [newPost, ...prevPosts])
          toast.success('New post received!')
        })

        newSocket.on('comment-created', ({ postId, comment }: { postId: string; comment: Comment }) => {
          setPosts(prevPosts => 
            prevPosts.map(post => 
              post.id === postId 
                ? { ...post, comments: [...post.comments, comment] }
                : post
            )
          )
        })

        newSocket.on('like-updated', ({ postId, likes }: { postId: string; likes: number }) => {
          setPosts(prevPosts =>
            prevPosts.map(post =>
              post.id === postId ? { ...post, likes } : post
            )
          )
        })

        newSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error)
          toast.error('Failed to connect to real-time updates')
        })

        socketRef.current = newSocket

        return () => {
          newSocket.close()
        }
      } catch (error) {
        console.error('Failed to initialize WebSocket:', error)
        toast.error('Failed to connect to real-time updates')
      }
    }

    initSocket()
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Explore Thoughts</h1>
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No posts yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} socket={socketRef.current} />
          ))}
        </div>
      )}
    </div>
  )
} 