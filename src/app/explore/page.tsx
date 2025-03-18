'use client'

import { useEffect, useState, useRef } from 'react'
import { FiHeart, FiMessageCircle, FiFilter } from 'react-icons/fi'
import { toast } from 'sonner'
import io, { Socket } from 'socket.io-client'

interface Comment {
  id: string;
  content: string;
  createdAt: string;
}

interface Post {
  id: string;
  content: string;
  mood: string;
  createdAt: string;
  likes: { id: string }[];
  comments: Comment[];
}

export default function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filter, setFilter] = useState('all')
  const [activePost, setActivePost] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSocketConnected, setIsSocketConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const initSocket = async () => {
      try {
        // Initialize socket connection
        const newSocket = io('http://localhost:3002', {
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        })

        newSocket.on('connect', () => {
          console.log('Connected to WebSocket server')
          setIsSocketConnected(true)
        })

        newSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error)
          setIsSocketConnected(false)
          toast.error('Failed to connect to real-time updates')
        })

        newSocket.on('disconnect', () => {
          console.log('Disconnected from WebSocket server')
          setIsSocketConnected(false)
        })

        newSocket.on('post-created', (newPost: Post) => {
          setPosts((prev) => [newPost, ...prev])
          toast.success('New thought shared!')
        })

        newSocket.on('comment-created', ({ postId, comment }: { postId: string; comment: Comment }) => {
          setPosts((prev) =>
            prev.map((post) =>
              post.id === postId
                ? { ...post, comments: [...post.comments, comment] }
                : post
            )
          )
        })

        newSocket.on('like-updated', ({ postId, likes }: { postId: string; likes: { id: string }[] }) => {
          setPosts((prev) =>
            prev.map((post) =>
              post.id === postId ? { ...post, likes } : post
            )
          )
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
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
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
      
      if (socketRef.current?.connected) {
        socketRef.current.emit('like-updated', { postId, likes })
      }
    } catch (error) {
      console.error('Error liking post:', error)
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
      
      if (socketRef.current?.connected) {
        socketRef.current.emit('comment-created', { postId, comment })
      }
      setNewComment('')
      toast.success('Comment added!')
    } catch (error) {
      console.error('Error adding comment:', error)
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