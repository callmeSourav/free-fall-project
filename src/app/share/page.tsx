'use client'

import { useState, useEffect } from 'react'
import { FiInfo } from 'react-icons/fi'
import { toast } from 'sonner'
import io, { Socket } from 'socket.io-client'

interface Post {
  id: string;
  content: string;
  mood: string;
  createdAt: string;
  comments: any[]; // Add comments array to match the explore page structure
}

export default function SharePage() {
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('neutral')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSocketConnected, setIsSocketConnected] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const initSocket = async () => {
      try {
        // Initialize socket connection
        const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
          path: '/api/socket',
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

        setSocket(newSocket)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, mood }),
      })

      if (!response.ok) throw new Error('Failed to create post')
      
      const post: Post = await response.json()
      
      // Emit post-created event if socket is connected
      if (socket?.connected) {
        socket.emit('post-created', post)
      }
      
      setContent('')
      setMood('neutral')
      toast.success('Your thought has been shared anonymously!')
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Failed to share your thought. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Share Your Thoughts</h1>
      <p className="text-gray-600 mb-6">
        Share your thoughts anonymously. No account needed.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">How are you feeling?</label>
            <div className="flex gap-2">
              {[
                { value: 'happy', emoji: '😊' },
                { value: 'neutral', emoji: '😐' },
                { value: 'sad', emoji: '😢' },
                { value: 'angry', emoji: '😠' },
              ].map(({ value, emoji }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMood(value)}
                  className={`p-2 rounded-full text-2xl ${
                    mood === value ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, feelings, or experiences..."
            className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={500}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>{content.length}/500 characters</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
            isSubmitting || !content.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isSubmitting ? 'Sharing...' : 'Share Anonymously'}
        </button>
      </form>

      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FiInfo className="text-blue-500 text-xl mt-1" />
          <div>
            <h3 className="font-medium text-blue-900">Community Guidelines</h3>
            <ul className="mt-2 text-sm text-blue-800 space-y-1">
              <li>• Be respectful and supportive of others</li>
              <li>• No hate speech or harassment</li>
              <li>• No personal information</li>
              <li>• Keep it appropriate for all ages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 