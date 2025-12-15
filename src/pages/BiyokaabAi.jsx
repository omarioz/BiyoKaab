import { useState, useRef, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { sendChatMessage } from '../api/aiApi';
import { useDeviceStore } from '../store/deviceStore';

const quickPrompts = [
  'Summarize todays water usage',
  'Suggest irrigation plan for maize',
  'Create livestock watering checklist',
];

// Default user_id - in production, this should come from authentication
const DEFAULT_USER_ID = '1';

const formatTime = (date = new Date()) => {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

export const BiyokaabAi = () => {
  const { currentDeviceId } = useDeviceStore();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hi, Im Biyokaab AI. Ask me about water plans, schedules, or sensor insights.',
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text) return;
    
    const userMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text,
      time: formatTime(),
    };
    
    // Update state with user message and build messages array for API
    let openaiMessages = [];
    setMessages((prev) => {
      const updatedMessages = [...prev, userMessage];
      
      // Convert messages to OpenAI format (role/content) using the updated array
      openaiMessages = updatedMessages
        .filter(msg => msg.id !== 'welcome') // Exclude welcome message
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        }));
      
      return updatedMessages;
    });
    
    // Clear input and show typing indicator
    setInput('');
    setError(null);
    setIsTyping(true);

    try {
      const result = await sendChatMessage(DEFAULT_USER_ID, openaiMessages);
      
      if (result.success) {
        const aiMessage = {
          id: crypto.randomUUID(),
          sender: 'ai',
          text: result.data.message,
          time: formatTime(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(result.error || 'Failed to get AI response');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while sending your message');
      const errorMessage = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: `Sorry, I encountered an error: ${err.message}. Please try again.`,
        time: formatTime(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearThread = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: 'Hi, Im Biyokaab AI. Ask me about water plans, schedules, or sensor insights.',
        time: 'Just now',
      },
    ]);
    setError(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-biyokaab-blue">
            Biyokaab AI
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-biyokaab-navy">
            Conversational assistant for water intelligence
          </h1>
          <p className="text-biyokaab-gray mt-2 max-w-3xl">
            Chat in natural language, ask for plans, or request summaries. Modern chat
            features include quick prompts, typing indicator, and multi-turn context.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={clearThread}>
            Clear thread
          </Button>
          <Button size="sm" onClick={() => {
            const conversation = messages.map(m => `${m.sender}: ${m.text}`).join('\n\n');
            const blob = new Blob([conversation], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `biyokaab-ai-conversation-${new Date().toISOString().split('T')[0]}.txt`;
            a.click();
            URL.revokeObjectURL(url);
          }}>
            Export conversation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <Card className="xl:col-span-3 flex flex-col h-[70vh]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🤖</span>
              <div>
                <p className="text-sm font-semibold text-biyokaab-navy">Biyokaab AI</p>
                <p className="text-xs text-green-600">Online · Context aware</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs bg-biyokaab-blue/10 text-biyokaab-blue">
                Streaming
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
                Safe mode on
              </span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap mb-3">
            {quickPrompts.map((prompt) => (
              <Button
                key={prompt}
                variant="secondary"
                size="sm"
                onClick={() => sendMessage(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto rounded-2xl bg-biyokaab-background border border-gray-100 p-4 space-y-3">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[80%] rounded-2xl px-4 py-3 whitespace-pre-line text-sm
                    ${msg.sender === 'user'
                      ? 'bg-biyokaab-blue text-white rounded-br-sm'
                      : 'bg-white border border-gray-100 text-biyokaab-navy rounded-bl-sm'}
                  `}
                >
                  <p>{msg.text}</p>
                  <span className="block text-[10px] mt-1 opacity-70">{msg.time}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-sm text-biyokaab-gray">
                <span className="text-lg">🤖</span>
                <span className="animate-pulse">Biyokaab AI is typing…</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex gap-2 flex-wrap text-xs text-biyokaab-gray">
              <span className="px-3 py-1 bg-white border border-gray-100 rounded-full">
                Attach files (PDF, CSV)
              </span>
              <span className="px-3 py-1 bg-white border border-gray-100 rounded-full">
                Voice note
              </span>
              <span className="px-3 py-1 bg-white border border-gray-100 rounded-full">
                Context: current device
              </span>
            </div>
            <div className="flex items-start gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Biyokaab AI anything about water usage, schedules, or sensors..."
                className="w-full min-h-[72px] rounded-2xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-biyokaab-blue"
              />
              <Button onClick={sendMessage} className="h-[72px] px-4">
                Send
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="space-y-3">
            <h3 className="font-semibold text-biyokaab-navy">Capabilities</h3>
            <ul className="text-sm text-biyokaab-gray space-y-2">
              <li>• Summaries of water usage, schedules, and anomalies</li>
              <li>• Generates step-by-step plans for crops or livestock</li>
              <li>• Can draft notifications and action checklists</li>
              <li>• Aware of current device context and mock sensor data</li>
            </ul>
          </Card>
          <Card className="space-y-3">
            <h3 className="font-semibold text-biyokaab-navy">Session settings</h3>
            <div className="text-sm text-biyokaab-gray space-y-2">
              <div className="flex items-center justify-between">
                <span>Stream responses</span>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                  On
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Safety &amp; tone</span>
                <span className="text-xs px-2 py-1 rounded-full bg-biyokaab-blue/10 text-biyokaab-blue">
                  Balanced
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Context window</span>
                <span className="text-xs px-2 py-1 rounded-full bg-white border border-gray-100">
                  15 turns
                </span>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="w-full">
              Manage preferences
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};


