'use client'

import { useState } from 'react'
import { FiHeart, FiMessageCircle } from 'react-icons/fi'
import { toast } from 'sonner'
import { Socket } from 'socket.io-client'

interface Comment {
  id: string
  content: string
  postId: string
  createdAt: string
}

interface Post {
  id: string
  content: string
  mood: string
  createdAt: string
  comments: Comment[]
  likes: number
}

interface PostCardProps {
  post: Post
  socket: Socket | null
}

export default function PostCard({ post, socket }: PostCardProps) {
  const [isCommenting, setIsCommenting] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [localPost, setLocalPost] = useState(post)

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊'
      case 'sad': return '😢'
      case 'angry': return '😠'
      default: return '😐'
    }
  }

  const handleLike = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/api/posts/${post.id}/like`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to like post')
      }
      
      const { likes } = await response.json()
      setLocalPost(prev => ({ ...prev, likes }))
      
      if (socket?.connected) {
        socket.emit('like-updated', { postId: post.id, likes })
      }
    } catch (error: any) {
      console.error('Error liking post:', error)
      toast.error(error.message || 'Failed to like post')
    }
  }

  const handleComment = async () => {
    if (!newComment.trim()) return

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/api/posts/${post.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add comment')
      }

      const comment = await response.json()
      setLocalPost(prev => ({
        ...prev,
        comments: [...prev.comments, comment],
      }))
      
      if (socket?.connected) {
        socket.emit('comment-created', { postId: post.id, comment })
      }
      
      setNewComment('')
      toast.success('Comment added!')
    } catch (error: any) {
      console.error('Error adding comment:', error)
      toast.error(error.message || 'Failed to add comment')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getMoodEmoji(localPost.mood)}</span>
          <span className="text-gray-500 text-sm">
            {new Date(localPost.createdAt).toLocaleDateString()}
          </span>
        </div>
        <span className="text-xs text-gray-400">Anonymous</span>
      </div>

      <p className="text-gray-800 mb-4">{localPost.content}</p>

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-500"
        >
          <FiHeart className={localPost.likes > 0 ? 'fill-current text-red-500' : ''} />
          <span>{localPost.likes}</span>
        </button>
        <button
          onClick={() => setIsCommenting(!isCommenting)}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-500"
        >
          <FiMessageCircle />
          <span>{localPost.comments.length}</span>
        </button>
      </div>

      {isCommenting && (
        <div className="border-t pt-4">
          <div className="space-y-4 mb-4">
            {localPost.comments.map((comment) => (
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
              onClick={handleComment}
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
            >
              Comment
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 