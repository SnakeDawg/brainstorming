import { useState, useRef, useEffect } from 'react';
import { Send, Plus, MessageSquare, Brain, Trash2, PanelLeftClose, PanelLeft, Maximize2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import mockConversationsData from '../data/mockConversations.json';
import mockMemoryData from '../data/mockMemory.json';
import mockAssistantsData from '../data/mockAssistants.json';

const PersonalAssistant = () => {
  const [conversations, setConversations] = useState(mockConversationsData);
  const [activeConversationId, setActiveConversationId] = useState(conversations[0]?.id);
  const [inputMessage, setInputMessage] = useState('');
  const [memory, setMemory] = useState(mockMemoryData);
  const [showMemoryPanel, setShowMemoryPanel] = useState(true);
  const [showConversationsPanel, setShowConversationsPanel] = useState(true);
  const [canvasMode, setCanvasMode] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState(mockAssistantsData[0]);
  const messagesEndRef = useRef(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: `m${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: inputMessage,
              timestamp: new Date().toISOString()
            }
          : conv
      )
    );

    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: `m${Date.now()}`,
        role: 'assistant',
        content: `I understand you're asking about "${inputMessage}". Let me help you with that. This is a simulated response in the prototype.`,
        timestamp: new Date().toISOString()
      };

      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversationId
            ? {
                ...conv,
                messages: [...conv.messages, aiResponse],
                lastMessage: aiResponse.content,
                timestamp: new Date().toISOString()
              }
            : conv
        )
      );
    }, 1000);
  };

  const handleNewConversation = () => {
    const newConv = {
      id: `${Date.now()}`,
      title: 'New Conversation',
      workspace: 'Personal',
      lastMessage: '',
      timestamp: new Date().toISOString(),
      unread: false,
      messages: []
    };
    setConversations([newConv, ...conversations]);
    setActiveConversationId(newConv.id);
  };

  const deleteMemoryItem = (id) => {
    setMemory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] -mx-6 -my-6">
      {/* Conversations Sidebar */}
      {showConversationsPanel && (
        <div className="w-64 border-r border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 flex flex-col">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-600">
            <Button onClick={handleNewConversation} className="w-full" size="small" icon={Plus}>
              New Chat
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                  conv.id === activeConversationId
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{conv.title}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                  {conv.unread && (
                    <div className="w-2 h-2 rounded-full bg-primary-600 mt-1 ml-2"></div>
                  )}
                </div>
                <Badge variant="default" size="small" className="mt-2">
                  {conv.workspace}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-neutral-50 dark:bg-neutral-900">
        {/* Chat Header */}
        <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!showConversationsPanel && (
              <button
                onClick={() => setShowConversationsPanel(true)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
              >
                <PanelLeft className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              </button>
            )}
            {showConversationsPanel && (
              <button
                onClick={() => setShowConversationsPanel(false)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
              >
                <PanelLeftClose className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              </button>
            )}
            <div>
              <h2 className="font-semibold text-neutral-900 dark:text-white">{activeConversation?.title}</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{selectedAssistant.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCanvasMode(!canvasMode)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                canvasMode
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
              }`}
            >
              <Maximize2 className="w-4 h-4 inline mr-1" />
              Canvas Mode
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeConversation?.messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-700 dark:text-white mb-2">How can I help you today?</h3>
              <p className="text-neutral-600 dark:text-neutral-400">Start a conversation or try one of the suggestions above</p>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {activeConversation?.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.attachments && (
                      <div className="mt-2 pt-2 border-t border-neutral-300 dark:border-neutral-600">
                        {msg.attachments.map((file, idx) => (
                          <div key={idx} className="text-xs opacity-80">📎 {file}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-600 p-4">
          <div className="max-w-4xl mx-auto flex items-end gap-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message... (Shift+Enter for new line)"
              rows={3}
              className="flex-1 px-4 py-3 border border-neutral-200 dark:border-neutral-600 rounded-lg resize-none bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Button onClick={handleSendMessage} icon={Send}>
              Send
            </Button>
          </div>
        </div>
      </div>

      {/* Memory Panel */}
      {showMemoryPanel && (
        <div className="w-80 border-l border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 flex flex-col">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-neutral-900 dark:text-white">Memory</h3>
            </div>
            <button onClick={() => setShowMemoryPanel(false)} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded">
              <PanelLeftClose className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              Information the AI has saved about you and your preferences
            </p>
            <div className="space-y-3">
              {memory.map(item => (
                <Card key={item.id} padding="small">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="primary" size="small">
                      {item.category}
                    </Badge>
                    <button
                      onClick={() => deleteMemoryItem(item.id)}
                      className="p-1 hover:bg-error-50 rounded text-error-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">{item.content}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.source}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {!showMemoryPanel && (
        <button
          onClick={() => setShowMemoryPanel(true)}
          className="absolute right-0 top-20 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 rounded-l-lg p-2 shadow-md hover:bg-neutral-50 dark:hover:bg-neutral-700"
        >
          <Brain className="w-5 h-5 text-primary-600" />
        </button>
      )}
    </div>
  );
};

export default PersonalAssistant;
