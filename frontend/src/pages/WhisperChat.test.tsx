/// <reference types="vitest-dom/extend-expect" />
import React from 'react'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import WhisperChat, { ChatMessage } from './WhisperChat'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import WS from 'vitest-websocket-mock'
import { vi } from 'vitest'

// Clean up WebSocket mock after each test
let server: WS

const initialMessages: ChatMessage[] = [{
	user_id: '1',
	content: 'Hello, world!'
}]

describe('WhisperChat', () => {
	beforeAll(() => {
		vi.stubGlobal('fetch', async () => {
			return {
				ok: true,
				json: async () => initialMessages
			}
		})
	})
  beforeEach(() => {
    // Fix the WebSocket URL to match your component
    server = new WS('ws://localhost:8000/v1/chat/ws', { jsonProtocol: true })
    // Add this mock for scrollIntoView
    Element.prototype.scrollIntoView = vi.fn()
  })


  afterEach(() => {
		cleanup()
    WS.clean()
    vi.restoreAllMocks()
  })

  it('renders the WhisperChat component', () => {
    render(<WhisperChat />)
    expect(screen.getByText('Whisper Chat Room')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument() })

  it('connects to WebSocket server', async () => {
    render(<WhisperChat />)
    // Wait for the WebSocket connection with a timeout
    await server.connected
    expect(server).toBeDefined()
  })

	// Spec: we should constantly pull messages from the server by calling the /v1/chat/messages endpoint and display them in the chatroom.
	// For now, we should just overwrite the entire messages and display all of them in chatroom. 
	// TODO: calling /v1/chat/messages with timestmap offset to get the new messages.
	it('should pull messages from the server and display them in the chatroom', async () => {
		render(<WhisperChat />)
		await server.connected
		await server.send(JSON.stringify({
			type: 'chat_messages_request',
			data: [{
				user_id: '1',
				content: 'Hello, world!'
			}]
		}))

		await waitFor(() => {
			expect(screen.getByText('Hello, world!')).toBeInTheDocument()
		})

		const newMessageContent	= 'Hello, world from user 2!'

		vi.stubGlobal('fetch', async () => {
			return {
				ok: true,
				json: async () => [...initialMessages, {
					user_id: '2',
					content: newMessageContent
				}]
			}
		})

		const input = screen.getByTestId('chat-input')
    const sendButton = screen.getByTestId('chat-send-button')

		// Type the message
		fireEvent.change(input, { target: { value: newMessageContent } })

		// Click the send button
		fireEvent.click(sendButton)

		// expect websocket received the message
		await expect(server).toReceiveMessage({
			type: 'chat_messages_request',
			data: [{
				user_id: expect.any(String),
				content: newMessageContent
			}]
		})

		await waitFor(() => {
			expect(screen.getByText(newMessageContent)).toBeInTheDocument()
		})
	})

	// Spec: When user send a message, message should be sent to server, and the message should be pulled from the server and displayed in the chatroom.
}) 