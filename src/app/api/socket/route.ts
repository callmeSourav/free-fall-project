import { NextResponse } from 'next/server'
import { Server as NetServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

let io: SocketIOServer | null = null
let httpServer: NetServer | null = null

export async function GET() {
  if (!io) {
    httpServer = new NetServer()
    io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    })

    // Try different ports if 3001 is in use
    const ports = [3001, 3002, 3003, 3004, 3005]
    let port = 3001
    
    for (const p of ports) {
      try {
        await new Promise((resolve, reject) => {
          httpServer!.listen(p, () => {
            port = p
            resolve(true)
          })
        })
        break
      } catch (error) {
        if (p === ports[ports.length - 1]) {
          throw new Error('No available ports found')
        }
      }
    }

    io.on('connection', (socket) => {
      console.log('Client connected')

      socket.on('new-post', (post) => {
        io?.emit('post-created', post)
      })

      socket.on('new-comment', (comment) => {
        io?.emit('comment-created', comment)
      })

      socket.on('new-like', (like) => {
        io?.emit('like-updated', like)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected')
      })
    })
  }

  return NextResponse.json({ success: true })
} 