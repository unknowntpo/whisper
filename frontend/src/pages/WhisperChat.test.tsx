/// <reference types="vitest-dom/extend-expect" />
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import WhisperChat from './WhisperChat'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import WS from 'vitest-websocket-mock'
import { vi } from 'vitest'

// Clean up WebSocket mock after each test
let server: WS

describe('WhisperChat', () => {
  beforeEach(() => {
    // Fix the WebSocket URL to match your component
    server = new WS('ws://localhost:8000/v1/chat/ws', { jsonProtocol: true })
    // Add this mock for scrollIntoView
    Element.prototype.scrollIntoView = vi.fn()
  })

  afterEach(() => {
    WS.clean()
  })

  it('renders the WhisperChat component', () => {
    render(<WhisperChat />)
    expect(screen.getByText('Whisper Chat Room')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument()
  })

  it('connects to WebSocket server', async () => {
    render(<WhisperChat />)
    // Wait for the WebSocket connection with a timeout
    await server.connected
    expect(server).toBeDefined()
  })

  // Future: Add tests for real-time chat functionality
}) 