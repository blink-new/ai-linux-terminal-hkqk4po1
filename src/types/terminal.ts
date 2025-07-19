export interface TerminalCommand {
  id: string
  command: string
  output: string
  timestamp: Date
  exitCode: number
  directory: string
}

export interface FileSystemItem {
  name: string
  type: 'file' | 'directory'
  size?: number
  permissions?: string
  modified?: Date
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'suggestion' | 'explanation' | 'help'
}

export interface TerminalState {
  currentDirectory: string
  history: TerminalCommand[]
  fileSystem: Record<string, FileSystemItem[]>
  isExecuting: boolean
}