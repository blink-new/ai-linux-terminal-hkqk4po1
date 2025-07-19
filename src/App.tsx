import React, { useState, useEffect } from 'react'
import { Terminal } from './components/Terminal'
import { AIAssistant } from './components/AIAssistant'
import { useTerminal } from './hooks/useTerminal'
import { blink } from './blink/client'
import { Loader2, Cpu, Wifi, HardDrive } from 'lucide-react'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { currentDirectory, history } = useTerminal()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <div className="text-lg font-semibold">Initializing AI Terminal...</div>
          <div className="text-sm text-muted-foreground">Loading Linux environment</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold ai-gradient">AI Terminal</div>
          <div className="text-muted-foreground">Please sign in to access the terminal</div>
        </div>
      </div>
    )
  }

  const lastCommand = history.length > 0 ? history[history.length - 1].command : undefined

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <div className="text-xl font-bold ai-gradient">AI Terminal</div>
          </div>
          
          {/* System Status */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-500">
              <Cpu className="w-4 h-4" />
              <span className="hidden sm:inline">CPU: 2.4GHz</span>
            </div>
            <div className="flex items-center gap-1 text-blue-500">
              <HardDrive className="w-4 h-4" />
              <span className="hidden sm:inline">Disk: 85%</span>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <Wifi className="w-4 h-4" />
              <span className="hidden sm:inline">Online</span>
            </div>
            <div className="text-muted-foreground text-xs">
              {user.email?.split('@')[0]}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex gap-3 p-3 min-h-0 overflow-hidden">
        {/* Terminal Panel */}
        <div className="flex-1 min-w-0 flex flex-col">
          <Terminal />
        </div>
        
        {/* AI Assistant Panel */}
        <div className="w-96 min-w-0 flex flex-col">
          <AIAssistant 
            currentDirectory={currentDirectory}
            lastCommand={lastCommand}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-between p-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>AI Terminal</span>
            <span>•</span>
            <span>Neural Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App