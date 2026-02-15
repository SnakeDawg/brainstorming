import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import '../styles/markdown.css';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  File,
  Mic,
  Video,
  Download,
  Pin,
  PinOff,
  MoreVertical,
  FileText,
  Code,
  Sparkles,
  Copy,
  Check,
  History,
  RotateCcw,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit3,
  List,
  Table,
  MoreHorizontal,
  Trash2
} from 'lucide-react';

const PersonalAssistant = () => {
  const location = useLocation();
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const canvasRef = useRef(null);

  // Conversations state
  const [conversations, setConversations] = useState([
    { id: 1, title: 'General Questions', description: 'Asking about system performance and optimization', lastMessage: '2 hours ago', pinned: false, messages: [], messageCount: 8, dateCreated: '2025-06-20 06:23:31' },
    { id: 2, title: 'Code Review', description: 'Reviewing React components and TypeScript types', lastMessage: 'Yesterday', pinned: true, messages: [], messageCount: 15, dateCreated: '2025-07-16 06:24:12' },
    { id: 3, title: 'Resume Writing', description: 'Help updating resume for software engineer position', lastMessage: '3 days ago', pinned: false, messages: [], messageCount: 12, dateCreated: '2025-06-30 01:07:41' },
  ]);
  const [activeConversation, setActiveConversation] = useState(1);
  const [conversationViewMode, setConversationViewMode] = useState('list'); // 'list' or 'table'

  // Canvas state
  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasContent, setCanvasContent] = useState('');
  const [canvasType, setCanvasType] = useState('markdown'); // markdown, code, document
  const [canvasVersions, setCanvasVersions] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(0);
  const [canvasViewMode, setCanvasViewMode] = useState('preview'); // 'preview' or 'edit'

  // Chat state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  // Recommendation tiles
  const [recommendations] = useState([
    { id: 1, icon: FileText, title: 'Create exam questions', description: 'Generate practice questions' },
    { id: 2, icon: Mic, title: 'Transcribe audio', description: 'Convert speech to text' },
    { id: 3, icon: File, title: 'Revise resume', description: 'Update and polish your CV' },
    { id: 4, icon: Sparkles, title: 'Design a logo', description: 'Create brand visuals' },
    { id: 5, icon: Code, title: 'Debug code', description: 'Find and fix errors' },
  ]);
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle initial query from navigation
  const hasHandledInitialQuery = useRef(false);
  useEffect(() => {
    if (location.state?.initialQuery && !hasHandledInitialQuery.current) {
      hasHandledInitialQuery.current = true;
      handleSendMessage(location.state.initialQuery);
    }
  }, [location.state]);

  const handleSendMessage = (customMessage = null) => {
    const messageText = customMessage || input;
    if (!messageText.trim() && attachedFiles.length === 0) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: messageText,
      files: attachedFiles,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachedFiles([]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'I can help you with that. Let me create a draft for you.',
        'I\'ve analyzed your request. Here\'s what I found...',
        'Let me help you understand this better.',
        'I\'ll create that for you in the canvas view.',
      ];

      const aiMessage = {
        id: Date.now(),
        sender: 'ai',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Randomly show canvas for some responses
      if (Math.random() > 0.5 && !showCanvas) {
        openCanvas('# Sample Document\n\nThis is a markdown document created by the AI assistant.');
      }
    }, 1500);
  };

  const handleFileAttach = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    setAttachedFiles(prev => [...prev, ...newFiles]);
  };

  const handlePaste = (e) => {
    const clipboardData = e.clipboardData;
    const text = clipboardData.getData('text');
    const files = clipboardData.files;

    if (files.length > 0) {
      e.preventDefault();
      const newFiles = Array.from(files).map(file => ({
        id: Date.now() + Math.random(),
        name: file.name || 'Pasted content',
        size: file.size,
        type: file.type,
        file: file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      }));
      setAttachedFiles(prev => [...prev, ...newFiles]);
    } else if (text.length > 200) {
      e.preventDefault();
      // Treat long pasted content as a file attachment
      const textFile = {
        id: Date.now(),
        name: 'Pasted text',
        size: text.length,
        type: 'text/plain',
        content: text,
        isPasted: true
      };
      setAttachedFiles(prev => [...prev, textFile]);
    }
  };

  const removeAttachment = (id) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handlePinConversation = (id) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === id ? { ...conv, pinned: !conv.pinned } : conv
      )
    );
  };

  const openCanvas = (content, type = 'markdown') => {
    setCanvasContent(content);
    setCanvasType(type);
    setShowCanvas(true);
    setCanvasVersions([{ id: 1, content, timestamp: new Date(), messageId: messages.length }]);
    setCurrentVersion(0);
  };

  const updateCanvas = (newContent) => {
    setCanvasContent(newContent);
    // Save version
    setCanvasVersions(prev => [...prev, {
      id: prev.length + 1,
      content: newContent,
      timestamp: new Date(),
      messageId: messages.length
    }]);
    setCurrentVersion(canvasVersions.length);
  };

  const revertToVersion = (versionIndex) => {
    const version = canvasVersions[versionIndex];
    setCanvasContent(version.content);
    setCurrentVersion(versionIndex);
    // Also revert chat messages to that point
    setMessages(prev => prev.slice(0, version.messageId));
  };

  const exportCanvas = (format) => {
    if (format === 'markdown') {
      const blob = new Blob([canvasContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.md';
      a.click();
    } else if (format === 'pdf') {
      // In a real app, you'd use a library like jsPDF or html2pdf
      alert('PDF export would be implemented with a library like jsPDF');
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Recommendation Tiles */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Suggested for you</h2>
          <button
            onClick={() => setShowAllRecommendations(!showAllRecommendations)}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            {showAllRecommendations ? 'Show Less' : 'View All'}
            {showAllRecommendations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {recommendations.slice(0, showAllRecommendations ? recommendations.length : 5).map(rec => {
            const Icon = rec.icon;
            return (
              <button
                key={rec.id}
                onClick={() => handleSendMessage(`Help me ${rec.title.toLowerCase()}`)}
                className="p-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-left transition-all hover:shadow-md group"
              >
                <Icon className="w-6 h-6 text-primary-600 mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">{rec.title}</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{rec.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Conversations Sidebar */}
        <div className={`${conversationViewMode === 'table' ? 'w-full' : 'w-64'} flex-shrink-0 flex flex-col`}>
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => {
                const newConv = {
                  id: conversations.length + 1,
                  title: 'New Chat',
                  description: 'New conversation',
                  lastMessage: 'Just now',
                  pinned: false,
                  messages: [],
                  messageCount: 0,
                  dateCreated: new Date().toISOString().slice(0, 19).replace('T', ' ')
                };
                setConversations(prev => [...prev, newConv]);
                setActiveConversation(newConv.id);
                setMessages([]);
              }}
            >
              New
            </Button>
            <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
              <button
                onClick={() => setConversationViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  conversationViewMode === 'list'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setConversationViewMode('table')}
                className={`p-1.5 rounded transition-colors ${
                  conversationViewMode === 'table'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title="Table view"
              >
                <Table className="w-4 h-4" />
              </button>
            </div>
          </div>

          {conversationViewMode === 'list' ? (
            <div className="flex-1 overflow-y-auto space-y-2">
              {conversations.sort((a, b) => b.pinned - a.pinned).map(conv => (
                <div
                  key={conv.id}
                  onClick={() => {
                    setActiveConversation(conv.id);
                    setMessages(conv.messages);
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition-all group border-2 ${
                    activeConversation === conv.id
                      ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500'
                      : 'bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border-neutral-200 dark:border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{conv.title}</h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{conv.lastMessage}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePinConversation(conv.id);
                      }}
                      className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {conv.pinned ? (
                        <PinOff className="w-4 h-4 text-primary-600" />
                      ) : (
                        <Pin className="w-4 h-4 text-neutral-400 hover:text-primary-600" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-600 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300 w-8">
                      <input type="checkbox" className="rounded border-neutral-300 dark:border-neutral-600" />
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300">Description</th>
                    <th className="text-left px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300 text-center">Messages</th>
                    <th className="text-left px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300">Date created</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {conversations.sort((a, b) => b.pinned - a.pinned).map(conv => (
                    <tr
                      key={conv.id}
                      onClick={() => {
                        setActiveConversation(conv.id);
                        setMessages(conv.messages);
                        setConversationViewMode('list');
                      }}
                      className={`border-b border-neutral-100 dark:border-neutral-700 cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700 ${
                        activeConversation === conv.id ? 'bg-primary-50 dark:bg-primary-900/30' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-neutral-300 dark:border-neutral-600"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {conv.pinned && <Pin className="w-3 h-3 text-primary-600" />}
                          <span className="font-medium text-neutral-900 dark:text-white">{conv.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{conv.description}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center min-w-[24px] px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full text-xs font-medium">
                          {conv.messageCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{conv.dateCreated}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Show context menu
                          }}
                          className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Chat Area */}
        {conversationViewMode === 'list' && (
          <div className="flex-1 flex flex-col min-w-0">
            <Card className="flex-1 flex flex-col min-h-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <Sparkles className="w-16 h-16 mx-auto text-primary-600 mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-700 dark:text-white mb-2">How can I help you today?</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Start a conversation or try one of the suggestions above</p>
                </div>
              )}

              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.sender === 'user' ? '' : 'group'}`}>
                    {message.sender === 'ai' && (
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-3 h-3 text-primary-600" />
                        <span className="text-xs font-semibold text-primary-600">AI Assistant</span>
                      </div>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-neutral-100 text-neutral-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.files && message.files.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.files.map(file => (
                            <div key={file.id} className="flex items-center gap-2 p-2 bg-black/10 rounded text-xs">
                              <File className="w-4 h-4" />
                              <span className="flex-1 truncate">{file.name}</span>
                              {file.preview && <img src={file.preview} alt="" className="w-8 h-8 rounded object-cover" />}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {message.sender === 'ai' && (
                      <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="text-xs text-neutral-500 hover:text-primary-600 flex items-center gap-1"
                        >
                          {copiedId === message.id ? (
                            <>
                              <Check className="w-3 h-3" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy
                            </>
                          )}
                        </button>
                        <span className="text-xs text-neutral-400">{message.timestamp}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-neutral-100 rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Attached Files Preview */}
            {attachedFiles.length > 0 && (
              <div className="px-4 py-2 border-t border-neutral-200">
                <div className="flex flex-wrap gap-2">
                  {attachedFiles.map(file => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm group"
                    >
                      {file.preview ? (
                        <img src={file.preview} alt="" className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <File className="w-4 h-4 text-neutral-600" />
                      )}
                      <span className="text-neutral-700 truncate max-w-[150px]">{file.name}</span>
                      <button
                        onClick={() => removeAttachment(file.id)}
                        className="ml-1 p-0.5 text-neutral-400 hover:text-error-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-600">
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileAttach}
                  multiple
                  accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                  title="Attach files"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onPaste={handlePaste}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Type a message... (paste long text to attach as file)"
                  className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() && attachedFiles.length === 0}
                  icon={Send}
                >
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </div>
        )}

        {/* Canvas Panel */}
        {conversationViewMode === 'list' && showCanvas && (
          <div className="w-[500px] flex-shrink-0 flex flex-col">
            <Card className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-neutral-900">Canvas</h3>
                  <Badge variant="info" size="small">{canvasType}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
                    <button
                      onClick={() => setCanvasViewMode('preview')}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        canvasViewMode === 'preview'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <Eye className="w-3 h-3 inline mr-1" />
                      Preview
                    </button>
                    <button
                      onClick={() => setCanvasViewMode('edit')}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        canvasViewMode === 'edit'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <Edit3 className="w-3 h-3 inline mr-1" />
                      Edit
                    </button>
                  </div>

                  {canvasVersions.length > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => revertToVersion(Math.max(0, currentVersion - 1))}
                        disabled={currentVersion === 0}
                        className="p-1 text-neutral-600 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Previous version"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-neutral-500">
                        v{currentVersion + 1}/{canvasVersions.length}
                      </span>
                      <button
                        onClick={() => revertToVersion(Math.min(canvasVersions.length - 1, currentVersion + 1))}
                        disabled={currentVersion === canvasVersions.length - 1}
                        className="p-1 text-neutral-600 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Next version"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => exportCanvas('markdown')}
                    className="p-1 text-neutral-600 hover:text-primary-600"
                    title="Export as Markdown"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowCanvas(false)}
                    className="p-1 text-neutral-600 hover:text-neutral-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {canvasViewMode === 'edit' ? (
                  <textarea
                    ref={canvasRef}
                    value={canvasContent}
                    onChange={(e) => updateCanvas(e.target.value)}
                    className="w-full h-full min-h-[400px] p-4 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm resize-none"
                    placeholder="Start typing or ask AI to generate content..."
                  />
                ) : (
                  <div className="prose prose-sm max-w-none p-4">
                    {canvasType === 'markdown' ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        className="markdown-body"
                      >
                        {canvasContent || '*No content yet. Switch to Edit mode to start writing.*'}
                      </ReactMarkdown>
                    ) : canvasType === 'code' ? (
                      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
                        <code>{canvasContent || '// No code yet'}</code>
                      </pre>
                    ) : (
                      <div className="whitespace-pre-wrap">{canvasContent || 'No content yet'}</div>
                    )}
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-neutral-200 flex gap-2">
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => exportCanvas('markdown')}
                >
                  Export MD
                </Button>
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => exportCanvas('pdf')}
                >
                  Export PDF
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalAssistant;
