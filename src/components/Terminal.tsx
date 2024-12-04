import { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import WindowControls from './WindowControls';

interface TerminalProps {
  onClose: () => void;
  isMinimized: boolean;
  onMinimize: () => void;
}

interface Command {
  input: string;
  output: string;
}

const Terminal = ({ onClose, onMinimize }: TerminalProps) => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const x = (window.innerWidth - 800) / 2;
    const y = (window.innerHeight - 500) / 2;
    setPosition({ x, y });
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  const handleCommand = (input: string) => {
    const command: Command = { input, output: '' };

    switch (input.toLowerCase()) {
      case 'help':
        command.output = `Kullanılabilir komutlar:
- help: Komut listesini gösterir
- clear: Terminal ekranını temizler
- date: Güncel tarihi gösterir
- echo [metin]: Metni ekrana yazdırır
- whoami: Kullanıcı adını gösterir`;
        break;
      case 'clear':
        setCommands([]);
        return;
      case 'date':
        command.output = new Date().toLocaleString();
        break;
      case 'whoami':
        command.output = 'user@windows';
        break;
      default:
        if (input.startsWith('echo ')) {
          command.output = input.slice(5);
        } else if (input.trim() !== '') {
          command.output = `'${input}' komutu bulunamadı. Kullanılabilir komutları görmek için 'help' yazın.`;
        }
    }

    setCommands(prev => [...prev, command]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
      setCurrentInput('');
    }
  };

  return (
    <Draggable
      disabled={isMaximized}
      handle=".window-header"
      position={isMaximized ? { x: 0, y: 0 } : position}
      onStop={(e, data) => !isMaximized && setPosition({ x: data.x, y: data.y })}
      bounds="parent"
    >
      <div
        className={`absolute bg-[#1E1E1E] rounded-lg shadow-lg overflow-hidden`}
        style={{
          width: isMaximized ? '100%' : 800,
          height: isMaximized ? '100%' : 500,
          ...(isMaximized ? { top: 0, left: 0 } : {}),
          zIndex: 1000,
        }}
      >
        <div className="window-header bg-[#2D2D2D] text-white p-2 flex justify-between items-center">
          <span>Terminal</span>
          <WindowControls
            isMaximized={isMaximized}
            onMinimize={onMinimize}
            onMaximize={() => setIsMaximized(!isMaximized)}
            onClose={onClose}
          />
        </div>

        <div 
          ref={terminalRef}
          className="p-4 text-green-400 font-mono text-sm h-[calc(100%-40px)] overflow-auto"
          onClick={() => inputRef.current?.focus()}
        >
          {commands.map((cmd, i) => (
            <div key={i} className="mb-2">
              <div className="flex">
                <span className="text-blue-400">user@windows</span>
                <span className="text-gray-400 mx-1">:</span>
                <span className="text-purple-400">~</span>
                <span className="text-gray-400 mx-1">$</span>
                <span>{cmd.input}</span>
              </div>
              {cmd.output && (
                <div className="whitespace-pre-wrap">{cmd.output}</div>
              )}
            </div>
          ))}
          <div className="flex items-center">
            <span className="text-blue-400">user@windows</span>
            <span className="text-gray-400 mx-1">:</span>
            <span className="text-purple-400">~</span>
            <span className="text-gray-400 mx-1">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none ml-1"
              autoFocus
            />
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default Terminal; 