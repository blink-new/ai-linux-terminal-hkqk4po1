import { useState, useCallback } from 'react'
import { TerminalCommand, TerminalState, FileSystemItem } from '../types/terminal'
import { LINUX_COMMANDS, PIPE_OPERATORS, COMMAND_COMBINATIONS, getCommandInfo } from '../utils/commands'

// Mock file system for demonstration
const mockFileSystem: Record<string, FileSystemItem[]> = {
  '/': [
    { name: 'home', type: 'directory', permissions: 'drwxr-xr-x' },
    { name: 'etc', type: 'directory', permissions: 'drwxr-xr-x' },
    { name: 'var', type: 'directory', permissions: 'drwxr-xr-x' },
    { name: 'usr', type: 'directory', permissions: 'drwxr-xr-x' },
    { name: 'bin', type: 'directory', permissions: 'drwxr-xr-x' },
  ],
  '/home': [
    { name: 'user', type: 'directory', permissions: 'drwxr-xr-x' },
    { name: 'guest', type: 'directory', permissions: 'drwxr-xr-x' },
  ],
  '/home/user': [
    { name: 'documents', type: 'directory', permissions: 'drwxr-xr-x' },
    { name: 'downloads', type: 'directory', permissions: 'drwxr-xr-x' },
    { name: 'projects', type: 'directory', permissions: 'drwxr-xr-x' },
    { name: '.bashrc', type: 'file', size: 3423, permissions: '-rw-r--r--' },
    { name: 'readme.txt', type: 'file', size: 1024, permissions: '-rw-r--r--' },
  ],
  '/home/user/projects': [
    { name: 'ai-terminal', type: 'directory', permissions: 'drwxr-xr-x' },
    { name: 'web-app', type: 'directory', permissions: 'drwxr-xr-x' },
    { name: 'script.sh', type: 'file', size: 512, permissions: '-rwxr-xr-x' },
  ],
}

// AI-powered workflow prediction patterns
const workflowPatterns = {
  // File operations
  'find': 'find . -name "*.txt" -type f',
  'find .': 'find . -name "*.txt" -type f',
  'grep': 'grep -r "pattern" .',
  'grep -': 'grep -r "pattern" .',
  'ls': 'ls -la',
  'cat': 'cat filename.txt',
  'tail': 'tail -f /var/log/syslog',
  'head': 'head -n 20 filename.txt',
  
  // Network diagnostics
  'ping': 'ping -c 4 google.com',
  'curl': 'curl -I https://google.com',
  'wget': 'wget https://example.com/file.txt',
  'netstat': 'netstat -tuln',
  'ss': 'ss -tuln',
  'traceroute': 'traceroute google.com',
  'nslookup': 'nslookup google.com',
  'dig': 'dig google.com',
  'lsof': 'lsof -i :80',
  
  // System monitoring
  'ps': 'ps aux | grep process',
  'top': 'top',
  'htop': 'htop',
  'df': 'df -h',
  'du': 'du -sh *',
  'free': 'free -h',
  
  // File permissions
  'chmod': 'chmod 755 filename',
  'chown': 'chown user:group filename',
  
  // Archive operations
  'tar': 'tar -czf archive.tar.gz directory/',
  'unzip': 'unzip file.zip',
  'zip': 'zip -r archive.zip directory/',
  
  // System info
  'uname': 'uname -a',
  'lscpu': 'lscpu',
  'lsblk': 'lsblk',
  'mount': 'mount | grep "^/"',
  'who': 'whoami',
  'date': 'date +"%Y-%m-%d %H:%M:%S"',
}

export const useTerminal = () => {
  const [state, setState] = useState<TerminalState>({
    currentDirectory: '/home/user',
    history: [],
    fileSystem: mockFileSystem,
    isExecuting: false,
  })

  // AI-powered workflow prediction
  const predictWorkflow = useCallback((currentInput: string, history: TerminalCommand[]): string | null => {
    const input = currentInput.toLowerCase().trim()
    
    // Direct pattern matching
    for (const [pattern, suggestion] of Object.entries(workflowPatterns)) {
      if (pattern.startsWith(input) && pattern !== input) {
        return suggestion
      }
    }
    
    // Context-aware predictions based on recent commands
    if (history.length > 0) {
      const lastCommand = history[history.length - 1].command.toLowerCase()
      
      // Git workflow predictions
      if (lastCommand.includes('git status') && input.startsWith('git')) {
        if (input === 'git' || input === 'git ') return 'git add .'
      }
      if (lastCommand.includes('git add') && input.startsWith('git')) {
        if (input === 'git' || input === 'git ') return 'git commit -m "Update"'
      }
      if (lastCommand.includes('git commit') && input.startsWith('git')) {
        if (input === 'git' || input === 'git ') return 'git push origin main'
      }
      
      // Network troubleshooting workflow
      if (lastCommand.includes('ping') && input.startsWith('tr')) {
        return 'traceroute google.com'
      }
      if (lastCommand.includes('ping') && input.startsWith('ns')) {
        return 'nslookup google.com'
      }
      
      // File search workflow
      if (lastCommand.includes('find') && input.startsWith('gr')) {
        return 'grep -r "pattern" .'
      }
    }
    
    return null
  }, [])

  const executeCommand = useCallback(async (command: string): Promise<TerminalCommand> => {
    setState(prev => ({ ...prev, isExecuting: true }))

    const commandId = Date.now().toString()
    const timestamp = new Date()
    
    // Simulate command execution delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200))

    let output = ''
    let exitCode = 0
    let newDirectory = state.currentDirectory

    const args = command.trim().split(' ')
    const cmd = args[0]

    try {
      switch (cmd) {
        case 'ls': {
          const lsPath = args[1] || state.currentDirectory
          const items = state.fileSystem[lsPath] || []
          if (args.includes('-la') || args.includes('-l')) {
            output = items.map(item => 
              `${item.permissions || 'drwxr-xr-x'} 1 user user ${item.size || 4096} ${new Date().toLocaleDateString()} ${item.name}`
            ).join('\n')
          } else {
            output = items.map(item => item.name).join('  ')
          }
          break
        }

        case 'pwd':
          output = state.currentDirectory
          break

        case 'cd': {
          const targetDir = args[1]
          if (!targetDir || targetDir === '~') {
            newDirectory = '/home/user'
          } else if (targetDir === '..') {
            const parts = state.currentDirectory.split('/').filter(Boolean)
            parts.pop()
            newDirectory = '/' + parts.join('/')
            if (newDirectory === '/') newDirectory = '/'
          } else if (targetDir.startsWith('/')) {
            newDirectory = targetDir
          } else {
            newDirectory = state.currentDirectory === '/' 
              ? `/${targetDir}` 
              : `${state.currentDirectory}/${targetDir}`
          }
          
          if (state.fileSystem[newDirectory]) {
            output = ''
          } else {
            output = `cd: ${targetDir}: No such file or directory`
            exitCode = 1
            newDirectory = state.currentDirectory
          }
          break
        }

        case 'cat': {
          const filename = args[1]
          if (!filename) {
            output = 'cat: missing file operand'
            exitCode = 1
          } else if (filename === 'readme.txt') {
            output = `Welcome to AI Terminal v2.0!

This revolutionary Linux terminal emulator features:

🧠 AI-POWERED WORKFLOW PREDICTION
- Start typing any command and watch AI predict your entire workflow
- Press TAB to accept predictions
- Context-aware suggestions based on your recent commands

🌐 ADVANCED NETWORKING TOOLS
- ping, curl, wget, traceroute, nslookup, dig
- netstat, ss for connection monitoring
- Real-time network diagnostics

🔧 COMPREHENSIVE LINUX COMMANDS
- File operations: ls, cd, pwd, cat, find, grep
- System monitoring: ps, top, df, du, free
- Permissions: chmod, chown
- Archives: tar, unzip

💡 BILLION-DOLLAR FEATURES
- Predictive command completion
- Context-aware AI assistance
- Real-time error prevention
- Intelligent workflow suggestions

Try typing "find" or "git" and see the magic happen!`
          } else if (filename === '.bashrc') {
            output = `# ~/.bashrc: executed by bash(1) for non-login shells.

export PATH=$HOME/bin:/usr/local/bin:$PATH
export EDITOR=nano

# AI Terminal aliases
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'

# Network shortcuts
alias ports='netstat -tuln'
alias connections='ss -tuln'
alias myip='curl -s ifconfig.me'

# AI-powered shortcuts
alias predict='echo "AI workflow prediction active - just start typing!"'

# Welcome message
echo "🧠 AI Terminal v2.0 - Linux with Neural Engine superpowers!"`
          } else {
            output = `cat: ${filename}: No such file or directory`
            exitCode = 1
          }
          break
        }

        case 'ping': {
          const host = args[1] || 'google.com'
          const count = args.includes('-c') ? parseInt(args[args.indexOf('-c') + 1]) || 4 : 4
          output = `PING ${host} (142.250.191.14): 56 data bytes
${Array.from({length: count}, (_, i) => 
  `64 bytes from 142.250.191.14: icmp_seq=${i} ttl=55 time=${(Math.random() * 5 + 10).toFixed(3)} ms`
).join('\n')}

--- ${host} ping statistics ---
${count} packets transmitted, ${count} packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 10.234/${(Math.random() * 2 + 12).toFixed(3)}/15.456/1.234 ms`
          break
        }

        case 'curl': {
          const url = args[1] || 'https://api.github.com'
          if (args.includes('-I')) {
            output = `HTTP/2 200 
server: GitHub.com
date: ${new Date().toUTCString()}
content-type: application/json; charset=utf-8
content-length: 2048
cache-control: public, max-age=60, s-maxage=60
etag: "abc123def456"
x-ratelimit-limit: 60
x-ratelimit-remaining: 59`
          } else {
            output = `{
  "current_user_url": "https://api.github.com/user",
  "authorizations_url": "https://api.github.com/authorizations",
  "repository_url": "https://api.github.com/repos/{owner}/{repo}",
  "status": "success",
  "message": "GitHub API v3"
}`
          }
          break
        }

        case 'wget': {
          const url = args[1] || 'https://example.com/file.txt'
          output = `--${new Date().toISOString()}--  ${url}
Resolving example.com (example.com)... 93.184.216.34
Connecting to example.com (example.com)|93.184.216.34|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1024 (1.0K) [text/plain]
Saving to: 'file.txt'

file.txt            100%[===================>]   1.00K  --.-KB/s    in 0s      

${new Date().toISOString()} (5.23 MB/s) - 'file.txt' saved [1024/1024]`
          break
        }

        case 'netstat': {
          if (args.includes('-tuln') || args.includes('-an')) {
            output = `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State      
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN     
tcp        0      0 127.0.0.1:3000          0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN     
tcp6       0      0 :::22                   :::*                    LISTEN     
tcp6       0      0 ::1:3000                :::*                    LISTEN     
udp        0      0 0.0.0.0:53              0.0.0.0:*                          
udp        0      0 0.0.0.0:68              0.0.0.0:*                          `
          } else {
            output = `Active Internet connections (w/o servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State      
tcp        0      0 192.168.1.100:45678     142.250.191.14:443      ESTABLISHED
tcp        0      0 192.168.1.100:45679     140.82.112.4:443        ESTABLISHED`
          }
          break
        }

        case 'ss': {
          output = `Netid  State      Recv-Q Send-Q Local Address:Port               Peer Address:Port              
tcp    LISTEN     0      128          *:22                       *:*                  
tcp    LISTEN     0      128    127.0.0.1:3000                   *:*                  
tcp    LISTEN     0      128          *:80                       *:*                  
tcp    LISTEN     0      128          *:443                      *:*                  
tcp    ESTAB      0      0      192.168.1.100:45678        142.250.191.14:443         
tcp    ESTAB      0      0      192.168.1.100:45679        140.82.112.4:443           `
          break
        }

        case 'traceroute': {
          const host = args[1] || 'google.com'
          output = `traceroute to ${host} (142.250.191.14), 30 hops max, 60 byte packets
 1  192.168.1.1 (192.168.1.1)  1.234 ms  1.123 ms  1.456 ms
 2  10.0.0.1 (10.0.0.1)  5.678 ms  5.432 ms  5.789 ms
 3  203.0.113.1 (203.0.113.1)  12.345 ms  12.123 ms  12.456 ms
 4  * * *
 5  142.250.191.14 (142.250.191.14)  15.678 ms  15.432 ms  15.789 ms`
          break
        }

        case 'nslookup': {
          const host = args[1] || 'google.com'
          output = `Server:		8.8.8.8
Address:	8.8.8.8#53

Non-authoritative answer:
Name:	${host}
Address: 142.250.191.14
Name:	${host}
Address: 2607:f8b0:4004:c1b::65`
          break
        }

        case 'dig': {
          const host = args[1] || 'google.com'
          output = `; <<>> DiG 9.16.1-Ubuntu <<>> ${host}
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;${host}.			IN	A

;; ANSWER SECTION:
${host}.		300	IN	A	142.250.191.14

;; Query time: 23 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
;; WHEN: ${new Date().toString()}
;; MSG SIZE  rcvd: 55`
          break
        }

        case 'ps': {
          if (args.includes('aux')) {
            output = `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1  225316  9876 ?        Ss   09:00   0:01 /sbin/init
root         2  0.0  0.0      0     0 ?        S    09:00   0:00 [kthreadd]
user      1234  0.5  2.1 1234567 87654 pts/0    Sl   09:30   0:05 ai-terminal
user      1235  0.1  0.5  123456  5432 pts/0    S    09:31   0:01 node server.js
user      1236  0.0  0.1   12345  1234 pts/0    R+   09:32   0:00 ps aux`
          } else {
            output = `  PID TTY          TIME CMD
 1234 pts/0    00:00:05 ai-terminal
 1235 pts/0    00:00:01 node
 1236 pts/0    00:00:00 ps`
          }
          break
        }

        case 'df': {
          if (args.includes('-h')) {
            output = `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        20G  8.5G   11G  45% /
tmpfs           2.0G     0  2.0G   0% /dev/shm
/dev/sda2       100G   45G   50G  48% /home`
          } else {
            output = `Filesystem     1K-blocks    Used Available Use% Mounted on
/dev/sda1       20971520 8912896  11534336  45% /
tmpfs            2097152       0   2097152   0% /dev/shm
/dev/sda2      104857600 47185920  52428800  48% /home`
          }
          break
        }

        case 'du': {
          if (args.includes('-sh')) {
            output = `1.2G	documents
856M	downloads
2.3G	projects
45M	.cache
12K	.bashrc`
          } else {
            output = `1234567	./documents
876543	./downloads
2345678	./projects
45678	./.cache
12	./.bashrc`
          }
          break
        }

        case 'free': {
          if (args.includes('-h')) {
            output = `              total        used        free      shared  buff/cache   available
Mem:           7.8G        2.1G        3.2G        156M        2.5G        5.4G
Swap:          2.0G          0B        2.0G`
          } else {
            output = `              total        used        free      shared  buff/cache   available
Mem:        8165432     2156789     3287654      159876     2720989     5567123
Swap:       2097152           0     2097152`
          }
          break
        }

        case 'lsof': {
          const port = args.includes('-i') ? args[args.indexOf('-i') + 1] || ':80' : ':80'
          output = `COMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
nginx   1234 root    6u  IPv4  12345      0t0  TCP *${port} (LISTEN)
nginx   1235 www     6u  IPv4  12345      0t0  TCP *${port} (LISTEN)`
          break
        }

        case 'whoami':
          output = 'user'
          break

        case 'date':
          output = new Date().toString()
          break

        case 'uname':
          if (args.includes('-a')) {
            output = 'Linux ai-terminal 5.15.0-ai #1 SMP x86_64 GNU/Linux'
          } else {
            output = 'Linux'
          }
          break

        case 'lscpu':
          output = `Architecture:                    x86_64
CPU op-mode(s):                  32-bit, 64-bit
Byte Order:                      Little Endian
CPU(s):                          4
Model name:                      AI Terminal Processor
CPU MHz:                         2400.000
Cache L1d:                       128 KiB
Cache L1i:                       128 KiB
Cache L2:                        1 MiB
Cache L3:                        8 MiB`
          break

        case 'echo':
          output = args.slice(1).join(' ')
          break

        case 'find': {
          const path = args[1] || '.'
          const nameFlag = args.indexOf('-name')
          const pattern = nameFlag !== -1 ? args[nameFlag + 1] : '*'
          output = `${path}/documents/report.txt
${path}/downloads/image.jpg
${path}/projects/ai-terminal/README.md
${path}/projects/web-app/index.html`
          break
        }

        case 'grep': {
          if (args.includes('-r')) {
            const pattern = args[args.indexOf('-r') + 1] || 'pattern'
            output = `./documents/report.txt:Found ${pattern} in line 15
./projects/ai-terminal/README.md:${pattern} appears in documentation
./projects/web-app/index.html:HTML contains ${pattern} reference`
          } else {
            output = 'grep: missing pattern'
            exitCode = 1
          }
          break
        }

        case 'clear':
          output = ''
          break

        case 'mkdir': {
          const dirName = args[1]
          if (!dirName) {
            output = 'mkdir: missing operand'
            exitCode = 1
          } else {
            output = `Directory '${dirName}' created`
          }
          break
        }

        case 'rmdir': {
          const dirName = args[1]
          if (!dirName) {
            output = 'rmdir: missing operand'
            exitCode = 1
          } else {
            output = `Directory '${dirName}' removed`
          }
          break
        }

        case 'rm': {
          const fileName = args[1]
          if (!fileName) {
            output = 'rm: missing operand'
            exitCode = 1
          } else if (args.includes('-rf')) {
            output = `Removed '${fileName}' and its contents`
          } else {
            output = `Removed '${fileName}'`
          }
          break
        }

        case 'cp': {
          const source = args[1]
          const dest = args[2]
          if (!source || !dest) {
            output = 'cp: missing file operand'
            exitCode = 1
          } else {
            output = `'${source}' copied to '${dest}'`
          }
          break
        }

        case 'mv': {
          const source = args[1]
          const dest = args[2]
          if (!source || !dest) {
            output = 'mv: missing file operand'
            exitCode = 1
          } else {
            output = `'${source}' moved to '${dest}'`
          }
          break
        }

        case 'touch': {
          const fileName = args[1]
          if (!fileName) {
            output = 'touch: missing file operand'
            exitCode = 1
          } else {
            output = `File '${fileName}' created/updated`
          }
          break
        }

        case 'ln': {
          const target = args[1]
          const link = args[2]
          if (!target || !link) {
            output = 'ln: missing operand'
            exitCode = 1
          } else if (args.includes('-s')) {
            output = `Symbolic link '${link}' created pointing to '${target}'`
          } else {
            output = `Hard link '${link}' created for '${target}'`
          }
          break
        }

        case 'which': {
          const cmdName = args[1]
          if (!cmdName) {
            output = 'which: missing argument'
            exitCode = 1
          } else {
            output = `/usr/bin/${cmdName}`
          }
          break
        }

        case 'whereis': {
          const cmdName = args[1]
          if (!cmdName) {
            output = 'whereis: missing argument'
            exitCode = 1
          } else {
            output = `${cmdName}: /usr/bin/${cmdName} /usr/share/man/man1/${cmdName}.1.gz`
          }
          break
        }

        case 'locate': {
          const pattern = args[1]
          if (!pattern) {
            output = 'locate: missing pattern'
            exitCode = 1
          } else {
            output = `/home/user/documents/${pattern}\n/usr/share/doc/${pattern}\n/var/log/${pattern}.log`
          }
          break
        }

        case 'less':
        case 'more': {
          const fileName = args[1]
          if (!fileName) {
            output = `${cmd}: missing file operand`
            exitCode = 1
          } else if (fileName === 'readme.txt') {
            output = `Viewing ${fileName} (press 'q' to quit)\n\nWelcome to AI Terminal!\n\nThis is a comprehensive Linux terminal emulator with AI assistance.\nSupports 100+ Linux commands for file operations, networking, and system administration.\n\n[Press 'q' to quit, 'space' for next page]`
          } else {
            output = `${cmd}: ${fileName}: No such file or directory`
            exitCode = 1
          }
          break
        }

        case 'head': {
          const fileName = args[1]
          const lines = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10
          if (!fileName) {
            output = 'head: missing file operand'
            exitCode = 1
          } else if (fileName === 'readme.txt') {
            output = `Welcome to AI Terminal!\n\nThis is a comprehensive Linux terminal emulator with AI assistance.\nSupports 100+ Linux commands for file operations, networking, and system administration.\n\nFeatures:\n- File system operations\n- Network diagnostics\n- Text processing\n- System monitoring`
          } else {
            output = `head: ${fileName}: No such file or directory`
            exitCode = 1
          }
          break
        }

        case 'tail': {
          const fileName = args[1]
          const lines = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10
          if (!fileName) {
            output = 'tail: missing file operand'
            exitCode = 1
          } else if (fileName === '/var/log/syslog' || args.includes('-f')) {
            output = `Jan 20 10:30:15 ai-terminal systemd[1]: Started AI Terminal Service\nJan 20 10:30:16 ai-terminal kernel: [12345.678] AI Terminal: Neural engine initialized\nJan 20 10:30:17 ai-terminal ai-terminal[1234]: Command prediction engine ready\nJan 20 10:30:18 ai-terminal ai-terminal[1234]: Network diagnostics module loaded\nJan 20 10:30:19 ai-terminal ai-terminal[1234]: File system monitor active\n${args.includes('-f') ? '\n[Following log file - press Ctrl+C to stop]' : ''}`
          } else {
            output = `tail: ${fileName}: No such file or directory`
            exitCode = 1
          }
          break
        }

        case 'wc': {
          const fileName = args[1]
          if (!fileName) {
            output = 'wc: missing file operand'
            exitCode = 1
          } else if (fileName === 'readme.txt') {
            if (args.includes('-l')) {
              output = '25 readme.txt'
            } else if (args.includes('-w')) {
              output = '156 readme.txt'
            } else if (args.includes('-c')) {
              output = '1024 readme.txt'
            } else {
              output = '  25  156 1024 readme.txt'
            }
          } else {
            output = `wc: ${fileName}: No such file or directory`
            exitCode = 1
          }
          break
        }

        case 'sort': {
          const fileName = args[1]
          if (!fileName) {
            output = 'sort: missing file operand'
            exitCode = 1
          } else {
            output = `apple\nbanana\ncherry\ndate\nfig\ngrape`
          }
          break
        }

        case 'uniq': {
          const fileName = args[1]
          if (!fileName) {
            output = 'uniq: missing file operand'
            exitCode = 1
          } else {
            output = `apple\nbanana\ncherry`
          }
          break
        }

        case 'cut': {
          const fileName = args[args.length - 1]
          if (args.includes('-d') && args.includes('-f')) {
            output = `user\nroot\ndaemon\nbin`
          } else if (args.includes('-c')) {
            output = `abcdefghij\nklmnopqrst\nuvwxyz1234`
          } else {
            output = 'cut: you must specify a list of bytes, characters, or fields'
            exitCode = 1
          }
          break
        }

        case 'tr': {
          if (args.length < 3) {
            output = 'tr: missing operand'
            exitCode = 1
          } else {
            output = `Character translation completed`
          }
          break
        }

        case 'sed': {
          const fileName = args[args.length - 1]
          if (!fileName || args.length < 2) {
            output = 'sed: missing script or file'
            exitCode = 1
          } else {
            output = `Text substitution completed on ${fileName}`
          }
          break
        }

        case 'awk': {
          const fileName = args[args.length - 1]
          if (!fileName || args.length < 2) {
            output = 'awk: missing script or file'
            exitCode = 1
          } else {
            output = `field1\nfield2\nfield3`
          }
          break
        }

        case 'kill': {
          const pid = args[1]
          if (!pid) {
            output = 'kill: missing process ID'
            exitCode = 1
          } else {
            output = `Process ${pid} terminated`
          }
          break
        }

        case 'killall': {
          const processName = args[1]
          if (!processName) {
            output = 'killall: missing process name'
            exitCode = 1
          } else {
            output = `Killed all ${processName} processes`
          }
          break
        }

        case 'pgrep': {
          const pattern = args[1]
          if (!pattern) {
            output = 'pgrep: missing pattern'
            exitCode = 1
          } else {
            output = `1234\n1235\n1236`
          }
          break
        }

        case 'pkill': {
          const pattern = args[1]
          if (!pattern) {
            output = 'pkill: missing pattern'
            exitCode = 1
          } else {
            output = `Killed processes matching '${pattern}'`
          }
          break
        }

        case 'jobs':
          output = `[1]+  Running                 long-running-script &\n[2]-  Stopped                 vim document.txt`
          break

        case 'bg':
          output = `[1]+ long-running-script &`
          break

        case 'fg':
          output = `vim document.txt`
          break

        case 'uptime':
          output = ` 10:30:15 up 2 days,  3:45,  2 users,  load average: 0.15, 0.25, 0.30`
          break

        case 'who':
          output = `user     pts/0        2024-01-20 09:00 (192.168.1.100)\nroot     tty1         2024-01-20 08:30`
          break

        case 'w':
          output = ` 10:30:15 up 2 days,  3:45,  2 users,  load average: 0.15, 0.25, 0.30\nUSER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT\nuser     pts/0    192.168.1.100    09:00    0.00s  0.05s  0.01s w\nroot     tty1     -                08:30    1:30m  0.02s  0.02s -bash`
          break

        case 'last':
          output = `user     pts/0        192.168.1.100    Sat Jan 20 09:00   still logged in\nuser     pts/0        192.168.1.100    Fri Jan 19 14:30 - 18:45  (04:15)\nroot     tty1                          Sat Jan 20 08:30   still logged in`
          break

        case 'id': {
          const user = args[1] || 'user'
          output = `uid=1000(${user}) gid=1000(${user}) groups=1000(${user}),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),120(lpadmin),131(lxd),132(sambashare)`
          break
        }

        case 'history':
          output = `    1  ls -la\n    2  cd projects\n    3  find . -name "*.txt"\n    4  grep -r "pattern" .\n    5  ps aux | grep python\n    6  netstat -tuln\n    7  ping google.com\n    8  history`
          break

        case 'alias':
          if (args.length === 1) {
            output = `alias ll='ls -la'\nalias la='ls -A'\nalias l='ls -CF'\nalias ..='cd ..'\nalias grep='grep --color=auto'`
          } else {
            output = `Alias '${args[1]}' created`
          }
          break

        case 'unalias': {
          const aliasName = args[1]
          if (!aliasName) {
            output = 'unalias: missing alias name'
            exitCode = 1
          } else {
            output = `Alias '${aliasName}' removed`
          }
          break
        }

        case 'type': {
          const cmdName = args[1]
          if (!cmdName) {
            output = 'type: missing argument'
            exitCode = 1
          } else {
            output = `${cmdName} is /usr/bin/${cmdName}`
          }
          break
        }

        case 'file': {
          const fileName = args[1]
          if (!fileName) {
            output = 'file: missing file operand'
            exitCode = 1
          } else if (fileName === 'readme.txt') {
            output = `readme.txt: ASCII text`
          } else if (fileName === 'script.sh') {
            output = `script.sh: Bourne-Again shell script, ASCII text executable`
          } else {
            output = `${fileName}: cannot open (No such file or directory)`
            exitCode = 1
          }
          break
        }

        case 'stat': {
          const fileName = args[1]
          if (!fileName) {
            output = 'stat: missing file operand'
            exitCode = 1
          } else if (fileName === 'readme.txt') {
            output = `  File: readme.txt\n  Size: 1024      \tBlocks: 8          IO Block: 4096   regular file\nDevice: 801h/2049d\tInode: 123456      Links: 1\nAccess: (0644/-rw-r--r--)  Uid: ( 1000/    user)   Gid: ( 1000/    user)\nAccess: 2024-01-20 09:00:00.000000000 +0000\nModify: 2024-01-20 08:30:00.000000000 +0000\nChange: 2024-01-20 08:30:00.000000000 +0000`
          } else {
            output = `stat: cannot stat '${fileName}': No such file or directory`
            exitCode = 1
          }
          break
        }

        case 'basename': {
          const path = args[1]
          if (!path) {
            output = 'basename: missing operand'
            exitCode = 1
          } else {
            const parts = path.split('/')
            output = parts[parts.length - 1]
          }
          break
        }

        case 'dirname': {
          const path = args[1]
          if (!path) {
            output = 'dirname: missing operand'
            exitCode = 1
          } else {
            const parts = path.split('/')
            parts.pop()
            output = parts.join('/') || '/'
          }
          break
        }

        case 'cal': {
          const month = args[1]
          const year = args[2]
          if (args.includes('-y')) {
            output = `                            2024\n      January               February               March\nSu Mo Tu We Th Fr Sa  Su Mo Tu We Th Fr Sa  Su Mo Tu We Th Fr Sa\n    1  2  3  4  5  6               1  2  3                  1  2\n 7  8  9 10 11 12 13   4  5  6  7  8  9 10   3  4  5  6  7  8  9\n14 15 16 17 18 19 20  11 12 13 14 15 16 17  10 11 12 13 14 15 16\n21 22 23 24 25 26 27  18 19 20 21 22 23 24  17 18 19 20 21 22 23\n28 29 30 31           25 26 27 28 29        24 25 26 27 28 29 30\n                                            31`
          } else {
            output = `    January 2024\nSu Mo Tu We Th Fr Sa\n    1  2  3  4  5  6\n 7  8  9 10 11 12 13\n14 15 16 17 18 19 20\n21 22 23 24 25 26 27\n28 29 30 31`
          }
          break
        }

        case 'gzip': {
          const fileName = args[1]
          if (!fileName) {
            output = 'gzip: missing file operand'
            exitCode = 1
          } else {
            output = `File '${fileName}' compressed to '${fileName}.gz'`
          }
          break
        }

        case 'gunzip': {
          const fileName = args[1]
          if (!fileName) {
            output = 'gunzip: missing file operand'
            exitCode = 1
          } else {
            output = `File '${fileName}' decompressed`
          }
          break
        }

        case 'zip': {
          const archive = args[1]
          const files = args.slice(2)
          if (!archive || files.length === 0) {
            output = 'zip: missing archive name or files'
            exitCode = 1
          } else {
            output = `  adding: ${files.join('\n  adding: ')}\nArchive '${archive}' created`
          }
          break
        }

        case 'chgrp': {
          const group = args[1]
          const file = args[2]
          if (!group || !file) {
            output = 'chgrp: missing operand'
            exitCode = 1
          } else {
            output = `Group ownership of '${file}' changed to '${group}'`
          }
          break
        }

        case 'umask': {
          if (args.length === 1) {
            output = '0022'
          } else {
            output = `umask set to ${args[1]}`
          }
          break
        }

        case 'watch': {
          const watchCmd = args.slice(1).join(' ')
          if (!watchCmd) {
            output = 'watch: missing command'
            exitCode = 1
          } else {
            output = `Every 2.0s: ${watchCmd}\n\n[Command output would refresh here every 2 seconds]`
          }
          break
        }

        case 'screen':
          output = `Screen version 4.08.00 (GNU) 05-Feb-20\n\nCopyright (c) 2018-2020 Alexander Naumov, Amadeusz Slawinski\nCopyright (c) 2015-2017 Juergen Weigert, Alexander Naumov, Amadeusz Slawinski\nCopyright (c) 2010-2014 Juergen Weigert, Sadrul Habib Chowdhury\n\nUse 'screen -S session_name' to create a new session`
          break

        case 'tmux':
          output = `tmux 3.1c\n\nUsage: tmux [-2CluvV] [-c shell-command] [-f file] [-L socket-name]\n            [-S socket-path] [command [flags]]\n\nUse 'tmux new -s session' to create a new session`
          break

        case 'xargs': {
          if (args.length < 2) {
            output = 'xargs: missing command'
            exitCode = 1
          } else {
            output = `xargs: executing command with piped input`
          }
          break
        }

        case 'tee': {
          const fileName = args[1]
          if (!fileName) {
            output = 'tee: missing file operand'
            exitCode = 1
          } else {
            output = `Output written to both stdout and '${fileName}'`
          }
          break
        }

        case 'help':
          output = `AI Terminal - Linux Command Reference

FILE SYSTEM:
  ls [-la]         List directory contents
  cd [dir]         Change directory  
  pwd              Print working directory
  mkdir [dir]      Create directories
  rmdir [dir]      Remove empty directories
  rm [-rf] [file]  Remove files and directories
  cp [-r] [src] [dst]  Copy files and directories
  mv [src] [dst]   Move/rename files
  find [path] [expr]   Search for files and directories
  locate [pattern] Find files by name
  which [cmd]      Locate command
  touch [file]     Create empty files or update timestamps
  ln [-s] [target] [link]  Create links

TEXT PROCESSING:
  cat [file]       Display file contents
  less [file]      View file contents page by page
  head [-n] [file] Display first lines of file
  tail [-f] [file] Display last lines of file
  grep [-r] [pattern] [file]  Search text patterns
  sed [script] [file]  Stream editor for text
  awk [pattern] [file]  Text processing tool
  cut [-d] [-f] [file]  Extract columns from text
  sort [-n] [file] Sort lines in text files
  uniq [file]      Report or omit repeated lines
  wc [-l] [file]   Word, line, character count
  tr [set1] [set2] Translate or delete characters

NETWORKING:
  ping [-c] [host] Test connectivity
  curl [-I] [url]  HTTP client
  wget [url]       Download files from web
  netstat [-tuln]  Display network connections
  ss [-tuln]       Modern netstat replacement
  traceroute [host]  Trace network path
  nslookup [host]  DNS lookup utility
  dig [host]       Advanced DNS lookup
  host [host]      DNS lookup utility
  lsof [-i] [port] List open files and connections
  nc [host] [port] Netcat network utility
  ssh [user@host]  Secure shell remote login
  scp [src] [dst]  Secure copy over SSH

PROCESS MANAGEMENT:
  ps [aux]         Display running processes
  top              Display processes (real-time)
  htop             Interactive process viewer
  kill [PID]       Terminate processes
  killall [name]   Kill processes by name
  pgrep [pattern]  Find process IDs by name
  jobs             Display active jobs
  bg [job]         Put job in background
  fg [job]         Bring job to foreground

SYSTEM INFO:
  df [-h]          Display filesystem disk space
  du [-sh] [dir]   Display directory space usage
  free [-h]        Display memory usage
  uptime           Show system uptime and load
  uname [-a]       System information
  lscpu            Display CPU information
  lsblk            List block devices
  mount            Display mounted filesystems
  whoami           Display current username
  who              Show logged in users
  date             Display or set date

PERMISSIONS:
  chmod [mode] [file]  Change file permissions
  chown [owner] [file] Change file ownership
  chgrp [group] [file] Change group ownership

ARCHIVES:
  tar [-czf] [archive] [files]  Archive files
  gzip [file]      Compress files
  gunzip [file]    Decompress gzip files
  zip [-r] [archive] [files]  Create zip archives
  unzip [archive]  Extract zip archives

PIPES & REDIRECTION:
  |    Pipe output to next command
  >    Redirect output to file (overwrite)
  >>   Redirect output to file (append)
  <    Redirect input from file
  &&   Execute next if previous succeeds
  ||   Execute next if previous fails

COMMON COMBINATIONS:
  ps aux | grep [process]
  find . -name "*.log" | xargs grep "error"
  ls -la | grep "^d"
  netstat -tuln | grep :80
  df -h | grep -v tmpfs

Type 'help [command]' for detailed info about a specific command.
AI assistance available - just ask for help with any task!`
          break

        case 'nc': {
          const host = args[1]
          const port = args[2]
          if (args.includes('-l')) {
            output = `Listening on port ${port || '8080'}`
          } else if (!host || !port) {
            output = 'nc: missing host or port'
            exitCode = 1
          } else {
            output = `Connected to ${host} port ${port}`
          }
          break
        }

        case 'telnet': {
          const host = args[1]
          const port = args[2] || '23'
          if (!host) {
            output = 'telnet: missing host'
            exitCode = 1
          } else {
            output = `Trying ${host}...\nConnected to ${host}.\nEscape character is '^]'.`
          }
          break
        }

        case 'ssh': {
          const target = args[1]
          if (!target) {
            output = 'ssh: missing destination'
            exitCode = 1
          } else {
            output = `Connecting to ${target}...\nConnection established.`
          }
          break
        }

        case 'scp': {
          const source = args[1]
          const dest = args[2]
          if (!source || !dest) {
            output = 'scp: missing source or destination'
            exitCode = 1
          } else {
            output = `${source} -> ${dest}\nFile transfer completed.`
          }
          break
        }

        case 'rsync': {
          const source = args[1]
          const dest = args[2]
          if (!source || !dest) {
            output = 'rsync: missing source or destination'
            exitCode = 1
          } else {
            output = `sending incremental file list\n${source}\n\nsent 1,024 bytes  received 35 bytes  2,118.00 bytes/sec\ntotal size is 1,024  speedup is 0.97`
          }
          break
        }

        case 'arp': {
          if (args.includes('-a')) {
            output = `? (192.168.1.1) at aa:bb:cc:dd:ee:ff [ether] on eth0\n? (192.168.1.100) at 11:22:33:44:55:66 [ether] on eth0\n? (192.168.1.254) at ff:ee:dd:cc:bb:aa [ether] on eth0`
          } else {
            output = `Address                  HWtype  HWaddress           Flags Mask            Iface\n192.168.1.1              ether   aa:bb:cc:dd:ee:ff   C                     eth0\n192.168.1.254            ether   ff:ee:dd:cc:bb:aa   C                     eth0`
          }
          break
        }

        case 'route': {
          if (args.includes('-n')) {
            output = `Kernel IP routing table\nDestination     Gateway         Genmask         Flags Metric Ref    Use Iface\n0.0.0.0         192.168.1.1     0.0.0.0         UG    100    0        0 eth0\n192.168.1.0     0.0.0.0         255.255.255.0   U     100    0        0 eth0`
          } else {
            output = `Kernel IP routing table\nDestination     Gateway         Genmask         Flags Metric Ref    Use Iface\ndefault         gateway         0.0.0.0         UG    100    0        0 eth0\n192.168.1.0     0.0.0.0         255.255.255.0   U     100    0        0 eth0`
          }
          break
        }

        case 'ip': {
          if (args.includes('addr')) {
            output = `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000\n    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000\n    link/ether 11:22:33:44:55:66 brd ff:ff:ff:ff:ff:ff\n    inet 192.168.1.100/24 brd 192.168.1.255 scope global dynamic eth0`
          } else if (args.includes('route')) {
            output = `default via 192.168.1.1 dev eth0 proto dhcp metric 100\n192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100 metric 100`
          } else if (args.includes('link')) {
            output = `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000\n    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP mode DEFAULT group default qlen 1000\n    link/ether 11:22:33:44:55:66 brd ff:ff:ff:ff:ff:ff`
          } else {
            output = 'ip: missing command. Try "ip addr", "ip route", or "ip link"'
            exitCode = 1
          }
          break
        }

        case 'ifconfig': {
          const interfaceName = args[1]
          if (interfaceName) {
            output = `${interfaceName}: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255\n        ether 11:22:33:44:55:66  txqueuelen 1000  (Ethernet)\n        RX packets 12345  bytes 1234567 (1.2 MB)\n        TX packets 6789  bytes 987654 (987.6 KB)`
          } else {
            output = `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255\n        ether 11:22:33:44:55:66  txqueuelen 1000  (Ethernet)\n\nlo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536\n        inet 127.0.0.1  netmask 255.0.0.0\n        loop  txqueuelen 1000  (Local Loopback)`
          }
          break
        }

        case 'iwconfig': {
          output = `wlan0     IEEE 802.11  ESSID:"MyNetwork"\n          Mode:Managed  Frequency:2.437 GHz  Access Point: AA:BB:CC:DD:EE:FF\n          Bit Rate=54 Mb/s   Tx-Power=20 dBm\n          Retry short limit:7   RTS thr:off   Fragment thr:off\n          Power Management:on\n          Link Quality=70/70  Signal level=-40 dBm\n          Rx invalid nwid:0  Rx invalid crypt:0  Rx invalid frag:0`
          break
        }

        case 'host': {
          const hostname = args[1]
          if (!hostname) {
            output = 'host: missing hostname'
            exitCode = 1
          } else {
            output = `${hostname} has address 142.250.191.14\n${hostname} has IPv6 address 2607:f8b0:4004:c1b::65\n${hostname} mail is handled by 10 smtp.${hostname}.`
          }
          break
        }

        case 'tracepath': {
          const host = args[1] || 'google.com'
          output = `tracepath to ${host} (142.250.191.14), 30 hops max\n 1:  192.168.1.1                                           1.234ms\n 2:  10.0.0.1                                             5.678ms\n 3:  203.0.113.1                                         12.345ms\n 4:  no reply\n 5:  142.250.191.14                                      15.678ms reached`
          break
        }

        case 'lsusb': {
          if (args.includes('-v')) {
            output = `Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub\nDevice Descriptor:\n  bLength                18\n  bDescriptorType         1\n  bcdUSB               2.00`
          } else {
            output = `Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub\nBus 001 Device 002: ID 8087:0024 Intel Corp. Integrated Rate Matching Hub\nBus 001 Device 003: ID 046d:c52b Logitech, Inc. Unifying Receiver`
          }
          break
        }

        case 'lspci': {
          if (args.includes('-v')) {
            output = `00:00.0 Host bridge: Intel Corporation Device 1234\n\tSubsystem: Intel Corporation Device 5678\n\tFlags: bus master, fast devsel, latency 0`
          } else {
            output = `00:00.0 Host bridge: Intel Corporation Device 1234\n00:02.0 VGA compatible controller: Intel Corporation Device 5678\n00:1f.0 ISA bridge: Intel Corporation Device 9abc`
          }
          break
        }

        case 'mount': {
          if (args.length === 1) {
            output = `/dev/sda1 on / type ext4 (rw,relatime)\n/dev/sda2 on /home type ext4 (rw,relatime)\ntmpfs on /tmp type tmpfs (rw,nosuid,nodev)\nproc on /proc type proc (rw,nosuid,nodev,noexec,relatime)`
          } else {
            const device = args[1]
            const mountpoint = args[2]
            output = `Mounted ${device} on ${mountpoint}`
          }
          break
        }

        case 'umount': {
          const mountpoint = args[1]
          if (!mountpoint) {
            output = 'umount: missing mountpoint'
            exitCode = 1
          } else {
            output = `Unmounted ${mountpoint}`
          }
          break
        }

        case 'nohup': {
          const command = args.slice(1).join(' ')
          if (!command) {
            output = 'nohup: missing command'
            exitCode = 1
          } else {
            output = `nohup: ignoring input and appending output to 'nohup.out'\n[1] 12345`
          }
          break
        }

        default:
          output = `${cmd}: command not found

Try 'help' to see available commands or ask the AI assistant for guidance!`
          exitCode = 127
      }
    } catch (error) {
      output = `Error executing command: ${error}`
      exitCode = 1
    }

    const terminalCommand: TerminalCommand = {
      id: commandId,
      command,
      output,
      timestamp,
      exitCode,
      directory: state.currentDirectory,
    }

    setState(prev => ({
      ...prev,
      currentDirectory: newDirectory,
      history: [...prev.history, terminalCommand],
      isExecuting: false,
    }))

    return terminalCommand
  }, [state.currentDirectory, state.fileSystem])

  const clearHistory = useCallback(() => {
    setState(prev => ({ ...prev, history: [] }))
  }, [])

  return {
    ...state,
    executeCommand,
    clearHistory,
    predictWorkflow,
  }
}