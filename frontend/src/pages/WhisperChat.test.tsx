/// <reference types="vitest-dom/extend-expect" />
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import WhisperChat from './WhisperChat'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import WS from 'vitest-websocket-mock'

// Clean up WebSocket mock after each test
let server: WS

describe('WhisperChat', () => {
  beforeEach(() => {
    server = new WS('ws://localhost:8000/ws/chat', { jsonProtocol: true })
  })

  afterEach(() => {
    WS.clean()
  })

  it('renders the WhisperChat placeholder', () => {
    render(<WhisperChat />)
    expect(screen.getByText('Whisper Chat Room')).toBeInTheDocument()
    expect(screen.getByText('This is the WhisperChat room. Real-time chat coming soon.')).toBeInTheDocument()
  })

  it('connects to WebSocket server', async () => {
    render(<WhisperChat />)
    // Wait for the WebSocket connection
    await server.connected
    // Now server is being used
    expect(server).toBeDefined()
  })

  // Future: Add tests for real-time chat functionality
}) 