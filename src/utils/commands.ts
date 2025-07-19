// Top 100 Linux Commands with focus on networking and file structure
export interface CommandInfo {
  name: string
  description: string
  category: 'file' | 'network' | 'system' | 'process' | 'text' | 'archive' | 'permission' | 'search'
  usage: string
  examples: string[]
}

export const LINUX_COMMANDS: Record<string, CommandInfo> = {
  // File System Operations
  'ls': {
    name: 'ls',
    description: 'List directory contents',
    category: 'file',
    usage: 'ls [options] [directory]',
    examples: ['ls -la', 'ls -lh', 'ls -R']
  },
  'cd': {
    name: 'cd',
    description: 'Change directory',
    category: 'file',
    usage: 'cd [directory]',
    examples: ['cd /home', 'cd ..', 'cd ~']
  },
  'pwd': {
    name: 'pwd',
    description: 'Print working directory',
    category: 'file',
    usage: 'pwd',
    examples: ['pwd']
  },
  'mkdir': {
    name: 'mkdir',
    description: 'Create directories',
    category: 'file',
    usage: 'mkdir [options] directory',
    examples: ['mkdir newdir', 'mkdir -p path/to/dir']
  },
  'rmdir': {
    name: 'rmdir',
    description: 'Remove empty directories',
    category: 'file',
    usage: 'rmdir directory',
    examples: ['rmdir emptydir']
  },
  'rm': {
    name: 'rm',
    description: 'Remove files and directories',
    category: 'file',
    usage: 'rm [options] file',
    examples: ['rm file.txt', 'rm -rf directory', 'rm -i file.txt']
  },
  'cp': {
    name: 'cp',
    description: 'Copy files and directories',
    category: 'file',
    usage: 'cp [options] source destination',
    examples: ['cp file.txt backup.txt', 'cp -r dir1 dir2']
  },
  'mv': {
    name: 'mv',
    description: 'Move/rename files and directories',
    category: 'file',
    usage: 'mv source destination',
    examples: ['mv old.txt new.txt', 'mv file.txt /home/user/']
  },
  'ln': {
    name: 'ln',
    description: 'Create links between files',
    category: 'file',
    usage: 'ln [options] target linkname',
    examples: ['ln -s /path/to/file symlink', 'ln file hardlink']
  },
  'find': {
    name: 'find',
    description: 'Search for files and directories',
    category: 'search',
    usage: 'find [path] [expression]',
    examples: ['find . -name "*.txt"', 'find /home -type f -size +1M', 'find . -mtime -7']
  },
  'locate': {
    name: 'locate',
    description: 'Find files by name (database)',
    category: 'search',
    usage: 'locate pattern',
    examples: ['locate filename', 'locate "*.conf"']
  },
  'which': {
    name: 'which',
    description: 'Locate command',
    category: 'search',
    usage: 'which command',
    examples: ['which python', 'which ls']
  },
  'whereis': {
    name: 'whereis',
    description: 'Locate binary, source, manual',
    category: 'search',
    usage: 'whereis command',
    examples: ['whereis ls', 'whereis python']
  },

  // Text Processing and Search
  'cat': {
    name: 'cat',
    description: 'Display file contents',
    category: 'text',
    usage: 'cat [options] file',
    examples: ['cat file.txt', 'cat -n file.txt']
  },
  'less': {
    name: 'less',
    description: 'View file contents page by page',
    category: 'text',
    usage: 'less file',
    examples: ['less file.txt', 'less +G file.txt']
  },
  'more': {
    name: 'more',
    description: 'View file contents page by page',
    category: 'text',
    usage: 'more file',
    examples: ['more file.txt']
  },
  'head': {
    name: 'head',
    description: 'Display first lines of file',
    category: 'text',
    usage: 'head [options] file',
    examples: ['head file.txt', 'head -n 20 file.txt']
  },
  'tail': {
    name: 'tail',
    description: 'Display last lines of file',
    category: 'text',
    usage: 'tail [options] file',
    examples: ['tail file.txt', 'tail -f /var/log/syslog', 'tail -n 50 file.txt']
  },
  'grep': {
    name: 'grep',
    description: 'Search text patterns in files',
    category: 'search',
    usage: 'grep [options] pattern [file]',
    examples: ['grep "pattern" file.txt', 'grep -r "text" .', 'grep -i "case" file.txt']
  },
  'egrep': {
    name: 'egrep',
    description: 'Extended grep with regex',
    category: 'search',
    usage: 'egrep pattern file',
    examples: ['egrep "pattern1|pattern2" file.txt']
  },
  'fgrep': {
    name: 'fgrep',
    description: 'Fixed string grep',
    category: 'search',
    usage: 'fgrep string file',
    examples: ['fgrep "exact string" file.txt']
  },
  'sed': {
    name: 'sed',
    description: 'Stream editor for filtering and transforming text',
    category: 'text',
    usage: 'sed [options] script [file]',
    examples: ['sed "s/old/new/g" file.txt', 'sed -n "1,5p" file.txt']
  },
  'awk': {
    name: 'awk',
    description: 'Text processing tool',
    category: 'text',
    usage: 'awk pattern { action } file',
    examples: ['awk "{print $1}" file.txt', 'awk "/pattern/ {print}" file.txt']
  },
  'cut': {
    name: 'cut',
    description: 'Extract columns from text',
    category: 'text',
    usage: 'cut [options] file',
    examples: ['cut -d":" -f1 /etc/passwd', 'cut -c1-10 file.txt']
  },
  'sort': {
    name: 'sort',
    description: 'Sort lines in text files',
    category: 'text',
    usage: 'sort [options] file',
    examples: ['sort file.txt', 'sort -n numbers.txt', 'sort -r file.txt']
  },
  'uniq': {
    name: 'uniq',
    description: 'Report or omit repeated lines',
    category: 'text',
    usage: 'uniq [options] file',
    examples: ['uniq file.txt', 'sort file.txt | uniq -c']
  },
  'wc': {
    name: 'wc',
    description: 'Word, line, character, and byte count',
    category: 'text',
    usage: 'wc [options] file',
    examples: ['wc file.txt', 'wc -l file.txt', 'wc -w file.txt']
  },
  'tr': {
    name: 'tr',
    description: 'Translate or delete characters',
    category: 'text',
    usage: 'tr [options] set1 [set2]',
    examples: ['tr "a-z" "A-Z"', 'tr -d "0-9"']
  },

  // Networking Commands
  'ping': {
    name: 'ping',
    description: 'Send ICMP echo requests',
    category: 'network',
    usage: 'ping [options] host',
    examples: ['ping google.com', 'ping -c 4 8.8.8.8', 'ping6 ipv6.google.com']
  },
  'curl': {
    name: 'curl',
    description: 'Transfer data from/to servers',
    category: 'network',
    usage: 'curl [options] URL',
    examples: ['curl https://api.github.com', 'curl -I https://google.com', 'curl -X POST -d "data" url']
  },
  'wget': {
    name: 'wget',
    description: 'Download files from web',
    category: 'network',
    usage: 'wget [options] URL',
    examples: ['wget https://example.com/file.zip', 'wget -r https://site.com']
  },
  'netstat': {
    name: 'netstat',
    description: 'Display network connections',
    category: 'network',
    usage: 'netstat [options]',
    examples: ['netstat -tuln', 'netstat -an', 'netstat -r']
  },
  'ss': {
    name: 'ss',
    description: 'Modern netstat replacement',
    category: 'network',
    usage: 'ss [options]',
    examples: ['ss -tuln', 'ss -an', 'ss -s']
  },
  'traceroute': {
    name: 'traceroute',
    description: 'Trace network path to destination',
    category: 'network',
    usage: 'traceroute host',
    examples: ['traceroute google.com', 'traceroute -n 8.8.8.8']
  },
  'tracepath': {
    name: 'tracepath',
    description: 'Trace network path (no root required)',
    category: 'network',
    usage: 'tracepath host',
    examples: ['tracepath google.com']
  },
  'nslookup': {
    name: 'nslookup',
    description: 'DNS lookup utility',
    category: 'network',
    usage: 'nslookup [host] [server]',
    examples: ['nslookup google.com', 'nslookup google.com 8.8.8.8']
  },
  'dig': {
    name: 'dig',
    description: 'Advanced DNS lookup tool',
    category: 'network',
    usage: 'dig [options] host [type]',
    examples: ['dig google.com', 'dig @8.8.8.8 google.com MX', 'dig +short google.com']
  },
  'host': {
    name: 'host',
    description: 'DNS lookup utility',
    category: 'network',
    usage: 'host [options] host [server]',
    examples: ['host google.com', 'host -t MX google.com']
  },
  'arp': {
    name: 'arp',
    description: 'Display/modify ARP table',
    category: 'network',
    usage: 'arp [options]',
    examples: ['arp -a', 'arp -n']
  },
  'route': {
    name: 'route',
    description: 'Display/modify routing table',
    category: 'network',
    usage: 'route [options]',
    examples: ['route -n', 'route add default gw 192.168.1.1']
  },
  'ip': {
    name: 'ip',
    description: 'Show/manipulate routing, devices',
    category: 'network',
    usage: 'ip [options] object command',
    examples: ['ip addr show', 'ip route show', 'ip link show']
  },
  'ifconfig': {
    name: 'ifconfig',
    description: 'Configure network interface',
    category: 'network',
    usage: 'ifconfig [interface] [options]',
    examples: ['ifconfig', 'ifconfig eth0', 'ifconfig eth0 up']
  },
  'iwconfig': {
    name: 'iwconfig',
    description: 'Configure wireless interface',
    category: 'network',
    usage: 'iwconfig [interface] [options]',
    examples: ['iwconfig', 'iwconfig wlan0']
  },
  'lsof': {
    name: 'lsof',
    description: 'List open files and network connections',
    category: 'network',
    usage: 'lsof [options]',
    examples: ['lsof -i :80', 'lsof -u user', 'lsof /path/to/file']
  },
  'nc': {
    name: 'nc',
    description: 'Netcat - network utility',
    category: 'network',
    usage: 'nc [options] host port',
    examples: ['nc -l 8080', 'nc google.com 80', 'nc -z host 20-30']
  },
  'telnet': {
    name: 'telnet',
    description: 'Connect to remote host',
    category: 'network',
    usage: 'telnet host [port]',
    examples: ['telnet google.com 80', 'telnet 192.168.1.1']
  },
  'ssh': {
    name: 'ssh',
    description: 'Secure shell remote login',
    category: 'network',
    usage: 'ssh [options] user@host',
    examples: ['ssh user@server.com', 'ssh -p 2222 user@host']
  },
  'scp': {
    name: 'scp',
    description: 'Secure copy over SSH',
    category: 'network',
    usage: 'scp [options] source destination',
    examples: ['scp file.txt user@host:/path/', 'scp -r dir/ user@host:/path/']
  },
  'rsync': {
    name: 'rsync',
    description: 'Synchronize files/directories',
    category: 'network',
    usage: 'rsync [options] source destination',
    examples: ['rsync -av dir/ user@host:/backup/', 'rsync -az --delete src/ dst/']
  },

  // System Information and Monitoring
  'ps': {
    name: 'ps',
    description: 'Display running processes',
    category: 'process',
    usage: 'ps [options]',
    examples: ['ps aux', 'ps -ef', 'ps -u user']
  },
  'top': {
    name: 'top',
    description: 'Display running processes (real-time)',
    category: 'process',
    usage: 'top [options]',
    examples: ['top', 'top -u user', 'top -p PID']
  },
  'htop': {
    name: 'htop',
    description: 'Interactive process viewer',
    category: 'process',
    usage: 'htop [options]',
    examples: ['htop', 'htop -u user']
  },
  'kill': {
    name: 'kill',
    description: 'Terminate processes',
    category: 'process',
    usage: 'kill [signal] PID',
    examples: ['kill 1234', 'kill -9 1234', 'kill -TERM 1234']
  },
  'killall': {
    name: 'killall',
    description: 'Kill processes by name',
    category: 'process',
    usage: 'killall [options] name',
    examples: ['killall firefox', 'killall -9 chrome']
  },
  'pgrep': {
    name: 'pgrep',
    description: 'Find process IDs by name',
    category: 'process',
    usage: 'pgrep [options] pattern',
    examples: ['pgrep firefox', 'pgrep -u user python']
  },
  'pkill': {
    name: 'pkill',
    description: 'Kill processes by name',
    category: 'process',
    usage: 'pkill [options] pattern',
    examples: ['pkill firefox', 'pkill -u user python']
  },
  'jobs': {
    name: 'jobs',
    description: 'Display active jobs',
    category: 'process',
    usage: 'jobs [options]',
    examples: ['jobs', 'jobs -l']
  },
  'bg': {
    name: 'bg',
    description: 'Put job in background',
    category: 'process',
    usage: 'bg [job]',
    examples: ['bg', 'bg %1']
  },
  'fg': {
    name: 'fg',
    description: 'Bring job to foreground',
    category: 'process',
    usage: 'fg [job]',
    examples: ['fg', 'fg %1']
  },
  'nohup': {
    name: 'nohup',
    description: 'Run command immune to hangups',
    category: 'process',
    usage: 'nohup command [args]',
    examples: ['nohup long-running-script &']
  },

  // System Information
  'df': {
    name: 'df',
    description: 'Display filesystem disk space',
    category: 'system',
    usage: 'df [options] [filesystem]',
    examples: ['df -h', 'df -i', 'df /home']
  },
  'du': {
    name: 'du',
    description: 'Display directory space usage',
    category: 'system',
    usage: 'du [options] [directory]',
    examples: ['du -sh *', 'du -h --max-depth=1', 'du -sk * | sort -n']
  },
  'free': {
    name: 'free',
    description: 'Display memory usage',
    category: 'system',
    usage: 'free [options]',
    examples: ['free -h', 'free -m', 'free -s 5']
  },
  'uptime': {
    name: 'uptime',
    description: 'Show system uptime and load',
    category: 'system',
    usage: 'uptime',
    examples: ['uptime']
  },
  'uname': {
    name: 'uname',
    description: 'System information',
    category: 'system',
    usage: 'uname [options]',
    examples: ['uname -a', 'uname -r', 'uname -m']
  },
  'lscpu': {
    name: 'lscpu',
    description: 'Display CPU information',
    category: 'system',
    usage: 'lscpu',
    examples: ['lscpu']
  },
  'lsblk': {
    name: 'lsblk',
    description: 'List block devices',
    category: 'system',
    usage: 'lsblk [options]',
    examples: ['lsblk', 'lsblk -f']
  },
  'lsusb': {
    name: 'lsusb',
    description: 'List USB devices',
    category: 'system',
    usage: 'lsusb [options]',
    examples: ['lsusb', 'lsusb -v']
  },
  'lspci': {
    name: 'lspci',
    description: 'List PCI devices',
    category: 'system',
    usage: 'lspci [options]',
    examples: ['lspci', 'lspci -v']
  },
  'mount': {
    name: 'mount',
    description: 'Mount filesystems',
    category: 'system',
    usage: 'mount [options] device mountpoint',
    examples: ['mount', 'mount /dev/sdb1 /mnt', 'mount -t ext4 /dev/sdb1 /mnt']
  },
  'umount': {
    name: 'umount',
    description: 'Unmount filesystems',
    category: 'system',
    usage: 'umount [options] mountpoint',
    examples: ['umount /mnt', 'umount -f /mnt']
  },

  // File Permissions and Ownership
  'chmod': {
    name: 'chmod',
    description: 'Change file permissions',
    category: 'permission',
    usage: 'chmod [options] mode file',
    examples: ['chmod 755 file.txt', 'chmod +x script.sh', 'chmod -R 644 dir/']
  },
  'chown': {
    name: 'chown',
    description: 'Change file ownership',
    category: 'permission',
    usage: 'chown [options] owner[:group] file',
    examples: ['chown user file.txt', 'chown user:group file.txt', 'chown -R user dir/']
  },
  'chgrp': {
    name: 'chgrp',
    description: 'Change group ownership',
    category: 'permission',
    usage: 'chgrp [options] group file',
    examples: ['chgrp group file.txt', 'chgrp -R group dir/']
  },
  'umask': {
    name: 'umask',
    description: 'Set default file permissions',
    category: 'permission',
    usage: 'umask [mode]',
    examples: ['umask', 'umask 022', 'umask 077']
  },

  // Archive and Compression
  'tar': {
    name: 'tar',
    description: 'Archive files',
    category: 'archive',
    usage: 'tar [options] archive files',
    examples: ['tar -czf archive.tar.gz dir/', 'tar -xzf archive.tar.gz', 'tar -tzf archive.tar.gz']
  },
  'gzip': {
    name: 'gzip',
    description: 'Compress files',
    category: 'archive',
    usage: 'gzip [options] file',
    examples: ['gzip file.txt', 'gzip -d file.txt.gz']
  },
  'gunzip': {
    name: 'gunzip',
    description: 'Decompress gzip files',
    category: 'archive',
    usage: 'gunzip file.gz',
    examples: ['gunzip file.txt.gz']
  },
  'zip': {
    name: 'zip',
    description: 'Create zip archives',
    category: 'archive',
    usage: 'zip [options] archive files',
    examples: ['zip archive.zip file1 file2', 'zip -r archive.zip dir/']
  },
  'unzip': {
    name: 'unzip',
    description: 'Extract zip archives',
    category: 'archive',
    usage: 'unzip [options] archive',
    examples: ['unzip archive.zip', 'unzip -l archive.zip']
  },

  // Utilities
  'echo': {
    name: 'echo',
    description: 'Display text',
    category: 'text',
    usage: 'echo [options] text',
    examples: ['echo "Hello World"', 'echo -n "No newline"', 'echo $PATH']
  },
  'date': {
    name: 'date',
    description: 'Display or set date',
    category: 'system',
    usage: 'date [options] [format]',
    examples: ['date', 'date +"%Y-%m-%d"', 'date -d "tomorrow"']
  },
  'cal': {
    name: 'cal',
    description: 'Display calendar',
    category: 'system',
    usage: 'cal [month] [year]',
    examples: ['cal', 'cal 12 2024', 'cal -y']
  },
  'whoami': {
    name: 'whoami',
    description: 'Display current username',
    category: 'system',
    usage: 'whoami',
    examples: ['whoami']
  },
  'id': {
    name: 'id',
    description: 'Display user and group IDs',
    category: 'system',
    usage: 'id [user]',
    examples: ['id', 'id user']
  },
  'who': {
    name: 'who',
    description: 'Show logged in users',
    category: 'system',
    usage: 'who [options]',
    examples: ['who', 'who -a']
  },
  'w': {
    name: 'w',
    description: 'Show logged in users and activity',
    category: 'system',
    usage: 'w [user]',
    examples: ['w', 'w user']
  },
  'last': {
    name: 'last',
    description: 'Show last logged in users',
    category: 'system',
    usage: 'last [options] [user]',
    examples: ['last', 'last user', 'last -n 10']
  },
  'history': {
    name: 'history',
    description: 'Command history',
    category: 'system',
    usage: 'history [options]',
    examples: ['history', 'history 10', 'history -c']
  },
  'alias': {
    name: 'alias',
    description: 'Create command aliases',
    category: 'system',
    usage: 'alias [name=value]',
    examples: ['alias', 'alias ll="ls -la"', 'alias grep="grep --color"']
  },
  'unalias': {
    name: 'unalias',
    description: 'Remove aliases',
    category: 'system',
    usage: 'unalias name',
    examples: ['unalias ll', 'unalias -a']
  },
  'type': {
    name: 'type',
    description: 'Display command type',
    category: 'system',
    usage: 'type command',
    examples: ['type ls', 'type cd']
  },
  'file': {
    name: 'file',
    description: 'Determine file type',
    category: 'file',
    usage: 'file [options] file',
    examples: ['file document.pdf', 'file *']
  },
  'stat': {
    name: 'stat',
    description: 'Display file statistics',
    category: 'file',
    usage: 'stat [options] file',
    examples: ['stat file.txt', 'stat -c "%n %s" *']
  },
  'touch': {
    name: 'touch',
    description: 'Create empty files or update timestamps',
    category: 'file',
    usage: 'touch [options] file',
    examples: ['touch newfile.txt', 'touch -t 202401011200 file.txt']
  },
  'basename': {
    name: 'basename',
    description: 'Extract filename from path',
    category: 'text',
    usage: 'basename path [suffix]',
    examples: ['basename /path/to/file.txt', 'basename /path/to/file.txt .txt']
  },
  'dirname': {
    name: 'dirname',
    description: 'Extract directory from path',
    category: 'text',
    usage: 'dirname path',
    examples: ['dirname /path/to/file.txt']
  },
  'xargs': {
    name: 'xargs',
    description: 'Build and execute commands from input',
    category: 'text',
    usage: 'xargs [options] command',
    examples: ['find . -name "*.txt" | xargs grep "pattern"', 'echo "file1 file2" | xargs rm']
  },
  'tee': {
    name: 'tee',
    description: 'Write output to both file and stdout',
    category: 'text',
    usage: 'tee [options] file',
    examples: ['command | tee output.txt', 'command | tee -a log.txt']
  },
  'watch': {
    name: 'watch',
    description: 'Execute command repeatedly',
    category: 'system',
    usage: 'watch [options] command',
    examples: ['watch "ps aux"', 'watch -n 5 "df -h"']
  },
  'screen': {
    name: 'screen',
    description: 'Terminal multiplexer',
    category: 'system',
    usage: 'screen [options] [command]',
    examples: ['screen', 'screen -S session_name', 'screen -r session_name']
  },
  'tmux': {
    name: 'tmux',
    description: 'Terminal multiplexer',
    category: 'system',
    usage: 'tmux [command]',
    examples: ['tmux', 'tmux new -s session', 'tmux attach -t session']
  }
}

// Pipe operators and redirection
export const PIPE_OPERATORS = {
  '|': 'Pipe output to next command',
  '||': 'Execute next command if previous fails',
  '&&': 'Execute next command if previous succeeds',
  '>': 'Redirect output to file (overwrite)',
  '>>': 'Redirect output to file (append)',
  '<': 'Redirect input from file',
  '2>': 'Redirect stderr to file',
  '2>&1': 'Redirect stderr to stdout',
  '&>': 'Redirect both stdout and stderr',
  '|&': 'Pipe both stdout and stderr'
}

// Common command combinations
export const COMMAND_COMBINATIONS = [
  'ps aux | grep process_name',
  'find . -name "*.log" | xargs grep "error"',
  'ls -la | grep "^d"',
  'netstat -tuln | grep :80',
  'df -h | grep -v tmpfs',
  'du -sh * | sort -hr',
  'cat file.txt | grep pattern | wc -l',
  'tail -f /var/log/syslog | grep error',
  'lsof -i | grep LISTEN',
  'ps aux | sort -k3 -nr | head -10'
]

export const getCommandsByCategory = (category: string) => {
  return Object.values(LINUX_COMMANDS).filter(cmd => cmd.category === category)
}

export const searchCommands = (query: string) => {
  const lowerQuery = query.toLowerCase()
  return Object.values(LINUX_COMMANDS).filter(cmd => 
    cmd.name.includes(lowerQuery) || 
    cmd.description.toLowerCase().includes(lowerQuery)
  )
}

export const getCommandInfo = (commandName: string): CommandInfo | undefined => {
  return LINUX_COMMANDS[commandName]
}