import React, { useEffect } from 'react'

const WhisperChat: React.FC = () => {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/chat')
    
    ws.onopen = () => {
      console.log('Connected to WebSocket server')
    }

    return () => {
      ws.close()
    }
  }, [])

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Whisper Chat Room</h1>
        <div className="bg-white rounded shadow p-6 min-h-[400px] flex flex-col">
          {/* Chat UI will go here */}
          <p className="text-gray-500">This is the WhisperChat room. Real-time chat coming soon.</p>
        </div>
      </div>
    </div>
  )
}

export default WhisperChat 