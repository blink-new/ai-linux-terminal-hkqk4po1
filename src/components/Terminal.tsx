import React, { useState, useRef, useEffect } from 'react'
import { Terminal as TerminalIcon, Zap, Brain, TrendingUp } from 'lucide-react'
import { useTerminal } from '../hooks/useTerminal'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Badge } from './ui/badge'

export const Terminal: React.FC = () => {
  const [currentCommand, setCurrentCommand] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const { history, currentDirectory, isExecuting, executeCommand, clearHistory, predictWorkflow } = useTerminal()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [workflowPrediction, setWorkflowPrediction] = useState<string | null>(null)

  useEffect(() => {
    // Auto-scroll to bottom when new output is added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    // Focus input on mount and when not executing
    if (!isExecuting && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExecuting])

  // AI-powered workflow prediction
  useEffect(() => {
    if (currentCommand.length > 2 && !isExecuting) {
      const prediction = predictWorkflow(currentCommand, history)
      setWorkflowPrediction(prediction)
    } else {
      setWorkflowPrediction(null)
    }
  }, [currentCommand, history, isExecuting, predictWorkflow])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === 'Tab' && workflowPrediction) {
      e.preventDefault()
      setCurrentCommand(workflowPrediction)
      setCursorPosition(workflowPrediction.length)
    } else if (e.key === 'ArrowLeft') {
      setCursorPosition(Math.max(0, cursorPosition - 1))
    } else if (e.key === 'ArrowRight') {
      setCursorPosition(Math.min(currentCommand.length, cursorPosition + 1))
    }
  }

  const handleSubmit = async () => {
    if (!currentCommand.trim() || isExecuting) return

    const command = currentCommand.trim()
    setCurrentCommand('')
    setCursorPosition(0)
    setWorkflowPrediction(null)

    if (command === 'clear') {
      clearHistory()
      return
    }

    await executeCommand(command)
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getPrompt = () => {
    return `user@ai-terminal:${currentDirectory}$`
  }

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-lg terminal-glow">
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-card/50">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground">AI Terminal</span>
          <Badge variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30">
            <Brain className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="text-xs h-6 px-2"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="terminal-font text-sm space-y-1">


            {/* Command History */}
            {history.map((cmd) => (
              <div key={cmd.id} className="space-y-1">
                {/* Command Input Line */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground text-xs">
                    {formatTimestamp(cmd.timestamp)}
                  </span>
                  <span className="text-accent font-medium">
                    {getPrompt()}
                  </span>
                  <span className="text-foreground">{cmd.command}</span>
                </div>
                
                {/* Command Output */}
                {cmd.output && (
                  <div className={`terminal-output pl-6 text-sm ${
                    cmd.exitCode === 0 ? 'text-foreground' : 'text-red-400'
                  }`}>
                    {cmd.output}
                  </div>
                )}
              </div>
            ))}

            {/* Current Command Input (inline like real terminal) */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground text-xs">
                {formatTimestamp(new Date())}
              </span>
              <span className="text-accent font-medium">
                {getPrompt()}
              </span>
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  value={currentCommand}
                  onChange={(e) => {
                    setCurrentCommand(e.target.value)
                    setCursorPosition(e.target.selectionStart || 0)
                  }}
                  onKeyDown={handleKeyDown}
                  onSelect={(e) => setCursorPosition((e.target as HTMLInputElement).selectionStart || 0)}
                  disabled={isExecuting}
                  className="bg-transparent border-none outline-none text-foreground terminal-font text-sm w-full"
                  autoComplete="off"
                  spellCheck={false}
                  style={{ caretColor: 'hsl(var(--primary))' }}
                />
                {/* Blinking cursor */}
                {!isExecuting && (
                  <span 
                    className="absolute top-0 text-primary terminal-cursor"
                    style={{ 
                      left: `${cursorPosition * 0.6}em`,
                      pointerEvents: 'none'
                    }}
                  >
                    |
                  </span>
                )}
                {/* AI Workflow Prediction */}
                {workflowPrediction && workflowPrediction !== currentCommand && (
                  <div className="absolute top-6 left-0 bg-primary/10 border border-primary/30 rounded p-2 text-xs z-10">
                    <div className="flex items-center gap-1 text-primary mb-1">
                      <Brain className="w-3 h-3" />
                      <span className="font-medium">AI Prediction:</span>
                    </div>
                    <div className="text-foreground font-mono">{workflowPrediction}</div>
                    <div className="text-muted-foreground mt-1">Press TAB to accept</div>
                  </div>
                )}
              </div>
              {isExecuting && (
                <div className="flex items-center gap-1 text-primary">
                  <Zap className="w-3 h-3 animate-pulse" />
                  <span className="text-xs">executing...</span>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>


      </div>
    </div>
  )
}