'use client'

import { useEffect, useState } from 'react'
import { FiHeart, FiMessageCircle, FiFilter } from 'react-icons/fi'
import { toast } from 'sonner'
import io from 'socket.io-client'

let socket: any

type Post = {
  id: string
  content: string
  mood: string
  createdAt: string
  likes: { id: string }[]
  comments: { id: string; content: string; createdAt: string }[]
}

export default function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filter, setFilter] = useState('all')
  const [activePost, setActivePost] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initSocket = async () => {
      try {
        // First, try to connect to the WebSocket server
        const response = await fetch('/api/socket')
        if (!response.ok) throw new Error('Failed to initialize WebSocket')
        
        // Try different ports
        const ports = [3001, 3002, 3003, 3004, 3005]
        for (const port of ports) {
          try {
            socket = io(`http://localhost:${port}`, {
              path: '/api/socket',
              reconnection: true,
              reconnectionAttempts: 5,
            })
            console.log(`Connected to WebSocket server on port ${port}`)
            break
          } catch (error) {
            console.log(`Failed to connect on port ${port}`)
            continue
          }
        }

        socket.on('post-created', (newPost) => {
          setPosts((prev) => [newPost, ...prev])
          toast.success('New thought shared!')
        })

        socket.on('comment-created', ({ postId, comment }) => {
          setPosts((prev) =>
            prev.map((post) =>
              post.id === postId
                ? { ...post, comments: [...post.comments, comment] }
                : post
            )
          )
        })

        socket.on('like-updated', ({ postId, likes }) => {
          setPosts((prev) =>
            prev.map((post) =>
              post.id === postId ? { ...post, likes } : post
            )
          )
        })
      } catch (error) {
        console.error('Failed to initialize WebSocket:', error)
        toast.error('Failed to connect to real-time updates')
      }
    }

    initSocket()
    fetchPosts()

    return () => {
      if (socket) {
        socket.off('post-created')
        socket.off('comment-created')
        socket.off('like-updated')
        socket.disconnect()
      }
    }
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      toast.error('Failed to load posts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to like post')
      const { likes } = await response.json()
      if (socket) {
        socket.emit('new-like', { postId, likes })
      }
    } catch (error) {
      toast.error('Failed to like post')
    }
  }

  const handleComment = async (postId: string) => {
    if (!newComment.trim()) return

    try {
      const response = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      })

      if (!response.ok) throw new Error('Failed to add comment')
      const comment = await response.json()
      
      if (socket) {
        socket.emit('new-comment', { postId, comment })
      }
      setNewComment('')
      toast.success('Comment added!')
    } catch (error) {
      toast.error('Failed to add comment')
    }
  }

  const filteredPosts = filter === 'all'
    ? posts
    : posts.filter((post) => post.mood === filter)

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊'
      case 'sad': return '😢'
      case 'angry': return '😠'
      default: return '😐'
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Explore Posts</h1>
      <p className="text-gray-600 mb-6">
        Read and interact with anonymous thoughts from our community. No account needed.
      </p>

      <div className="mb-6 flex items-center gap-2">
        <FiFilter className="text-gray-500" />
        <div className="flex gap-2">
          {['all', 'happy', 'neutral', 'sad', 'angry'].map((mood) => (
            <button
              key={mood}
              onClick={() => setFilter(mood)}
              className={`px-4 py-2 rounded-full text-sm ${
                filter === mood
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {mood === 'all' ? 'All' : getMoodEmoji(mood)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getMoodEmoji(post.mood)}</span>
                <span className="text-gray-500 text-sm">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <span className="text-xs text-gray-400">Anonymous</span>
            </div>

            <p className="text-gray-800 mb-4">{post.content}</p>

            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-2 text-gray-500 hover:text-blue-500"
              >
                <FiHeart className={post.likes.length > 0 ? 'fill-current text-red-500' : ''} />
                <span>{post.likes.length}</span>
              </button>
              <button
                onClick={() => setActivePost(activePost === post.id ? null : post.id)}
                className="flex items-center gap-2 text-gray-500 hover:text-blue-500"
              >
                <FiMessageCircle />
                <span>{post.comments.length}</span>
              </button>
            </div>

            {activePost === post.id && (
              <div className="border-t pt-4">
                <div className="space-y-4 mb-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded p-3">
                      <p className="text-gray-800">{comment.content}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a supportive comment anonymously..."
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleComment(post.id)}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
                  >
                    Comment
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 