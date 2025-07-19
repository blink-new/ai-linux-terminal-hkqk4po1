import React, { useState, useRef, useEffect } from 'react'
import { Bot, Send, Lightbulb, HelpCircle, Zap } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { blink } from '../blink/client'
import { AIMessage } from '../types/terminal'

interface AIAssistantProps {
  currentDirectory: string
  lastCommand?: string
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  currentDirectory, 
  lastCommand 
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    // Add welcome message on mount
    if (messages.length === 0) {
      const welcomeMessage: AIMessage = {
        id: 'welcome',
        role: 'assistant',
        content: `Neural Engine ready. Ask me anything about Linux commands, networking, or system administration.`,
        timestamp: new Date(),
        type: 'help'
      }
      setMessages([welcomeMessage])
    }
  }, [messages.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentMessage.trim() || isGenerating) return

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsGenerating(true)

    try {
      // Create context-aware prompt
      const contextPrompt = `You are the Neural Engine for an AI-powered Linux terminal. Provide concise, practical answers about Linux commands and system administration. Current directory: ${currentDirectory}${lastCommand ? `. Last command: ${lastCommand}` : ''}.

Question: ${userMessage.content}

Keep responses short and actionable. Include specific commands when relevant. Be direct and helpful.`

      let assistantResponse = ''
      
      await blink.ai.streamText(
        { 
          prompt: contextPrompt,
          model: 'gpt-4o-mini',
          maxTokens: 500
        },
        (chunk) => {
          assistantResponse += chunk
          
          // Update the assistant message in real-time
          setMessages(prev => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]
            
            if (lastMessage && lastMessage.role === 'assistant' && lastMessage.id === 'streaming') {
              lastMessage.content = assistantResponse
            } else {
              newMessages.push({
                id: 'streaming',
                role: 'assistant',
                content: assistantResponse,
                timestamp: new Date(),
                type: 'explanation'
              })
            }
            
            return newMessages
          })
        }
      )

      // Finalize the message
      setMessages(prev => {
        const newMessages = [...prev]
        const lastMessage = newMessages[newMessages.length - 1]
        if (lastMessage && lastMessage.id === 'streaming') {
          lastMessage.id = Date.now().toString()
        }
        return newMessages
      })

    } catch (error) {
      console.error('AI response error:', error)
      const errorMessage: AIMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or ask a different question.',
        timestamp: new Date(),
        type: 'explanation'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setCurrentMessage(question)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMessageIcon = (message: AIMessage) => {
    if (message.role === 'user') return null
    
    switch (message.type) {
      case 'suggestion':
        return <Lightbulb className="w-4 h-4 text-yellow-500" />
      case 'help':
        return <HelpCircle className="w-4 h-4 text-blue-500" />
      default:
        return <Bot className="w-4 h-4 text-primary" />
    }
  }

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-lg">
      {/* AI Assistant Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground">AI Assistant</span>
          <Badge variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30">
            Neural Engine
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          {currentDirectory}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 mt-1">
                  {getMessageIcon(message)}
                </div>
              )}
              
              <Card className={`max-w-[85%] p-3 ${
                message.role === 'user' 
                  ? 'bg-primary text-black' 
                  : 'bg-muted'
              }`}>
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
                </div>
                <div className={`text-xs mt-2 ${
                  message.role === 'user' 
                    ? 'text-black/70' 
                    : 'text-muted-foreground'
                }`}>
                  {formatTimestamp(message.timestamp)}
                </div>
              </Card>
            </div>
          ))}
          
          {isGenerating && (
            <div className="flex items-center gap-2 text-primary">
              <Zap className="w-4 h-4 animate-pulse" />
              <span className="text-sm">AI is thinking...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Ask me anything about Linux commands..."
            disabled={isGenerating}
            className="bg-background border-border focus:border-primary"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!currentMessage.trim() || isGenerating}
            className="bg-primary hover:bg-primary/90 text-black"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}