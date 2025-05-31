import React, { useEffect, useState, useRef } from 'react';

export interface ChatMessage {
  user_id: string;
  content: string;
}

export interface WebSocketMessage {
  type: 'messages';
  data?: ChatMessage[];
}

const WhisperChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
	// FIXME: user id should be stored in the local storage
  const [userId] = useState(() => crypto.randomUUID());
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Fetch message history
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:8000/v1/chat/messages');
				if (!response.ok) {
					throw new Error(`Failed to fetch messages: ${response.statusText}`);
				}
				const data: ChatMessage[] = await response.json();
				console.log(`Fetched ${data.length} messages`);
				setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

		fetchMessages();

		const intervalId = setInterval(() => {
			fetchMessages();
		}, 500);

    // Initialize WebSocket connection
    const ws = new WebSocket('ws://localhost:8000/v1/chat/ws');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      fetchMessages();
    };

    ws.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);
      if (data.type === 'messages' && data.data) {
        setMessages(prev => [...prev, ...data.data!]);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    return () => {
      ws.close();
			clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !wsRef.current) return;

    const message: ChatMessage = {
      user_id: userId,
      content: inputMessage.trim()
    };

    try {
      wsRef.current.send(JSON.stringify({
        type: 'chat_messages_request',
        data: [message]
      }));
      setInputMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Whisper Chat Room</h1>
        <div className="bg-white rounded shadow p-6 min-h-[400px] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.user_id === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.user_id === userId
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="border-t pt-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="chat-input"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="chat-send-button"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhisperChat; 