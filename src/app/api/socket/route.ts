import { Server as NetServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { NextResponse } from 'next/server'

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

      socket.on('post-created', (post) => {
        io?.emit('post-created', post)
      })

      socket.on('comment-created', (data) => {
        io?.emit('comment-created', data)
      })

      socket.on('like-updated', (data) => {
        io?.emit('like-updated', data)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected')
      })
    })
  }

  return NextResponse.json({ success: true })
} 