import { useState, useRef, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Search, BookOpen, MessageCircle, Wrench, Phone, Mail, ExternalLink, Send, Sparkles, X } from 'lucide-react';

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', content: 'Hello! I\'m your Support AI assistant. I can help you with troubleshooting, finding help articles, and answering questions about your system. How can I assist you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const commonIssues = [
    { id: 1, title: 'PC is running slow', icon: Wrench, category: 'Performance' },
    { id: 2, title: 'Wi-Fi connection problems', icon: Wrench, category: 'Network' },
    { id: 3, title: 'Battery draining quickly', icon: Wrench, category: 'Power' },
    { id: 4, title: 'Update installation failed', icon: Wrench, category: 'Updates' },
    { id: 5, title: 'Security scan not working', icon: Wrench, category: 'Security' },
    { id: 6, title: 'App crashes frequently', icon: Wrench, category: 'Apps' },
  ];

  const helpArticles = [
    { id: 1, title: 'Getting Started with AI Assistant', views: '12.5K' },
    { id: 2, title: 'Optimizing PC Performance', views: '8.2K' },
    { id: 3, title: 'Understanding Security Features', views: '6.7K' },
    { id: 4, title: 'Managing System Updates', views: '5.3K' },
  ];

  const contactOptions = [
    {
      id: 1,
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      availability: 'Available 24/7',
      action: 'Start Chat'
    },
    {
      id: 2,
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak with a specialist',
      availability: 'Mon-Fri, 9AM-5PM',
      action: 'Call Now'
    },
    {
      id: 3,
      icon: Mail,
      title: 'Email Support',
      description: 'Send us your question',
      availability: 'Response within 24 hours',
      action: 'Send Email'
    }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      content: chatInput
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        'Let me help you troubleshoot that issue. Have you tried restarting your device?',
        'I found a few help articles that might be relevant to your question. Would you like me to share them?',
        'Based on your question, I recommend running the System Diagnostics tool to identify the issue.',
        'That sounds like it could be related to a recent update. Let me check the update history for you.',
        'I can help you with that. First, let\'s verify your system settings are configured correctly.'
      ];

      const aiMessage = {
        id: chatMessages.length + 2,
        sender: 'ai',
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)]
      };

      setChatMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Support</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">Get help and troubleshoot issues</p>
      </div>

      {/* Support AI Assistant */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Support AI Assistant</h2>
          </div>
          {!showChat && (
            <Button
              variant="primary"
              icon={MessageCircle}
              onClick={() => setShowChat(true)}
            >
              Start Chat
            </Button>
          )}
          {showChat && (
            <button
              onClick={() => setShowChat(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {!showChat && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Get instant help from Support AI</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Ask questions about troubleshooting, system issues, or help articles
            </p>
            <Button
              variant="primary"
              icon={MessageCircle}
              onClick={() => setShowChat(true)}
            >
              Start Conversation
            </Button>
          </div>
        )}

        {showChat && (
          <div className="space-y-4">
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto border border-neutral-200 dark:border-neutral-600 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-800">
              <div className="space-y-4">
                {chatMessages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white'
                      }`}
                    >
                      {message.sender === 'ai' && (
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-3 h-3 text-primary-600" />
                          <span className="text-xs font-semibold text-primary-600">Support AI</span>
                        </div>
                      )}
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-primary-600" />
                        <span className="text-xs font-semibold text-primary-600">Support AI</span>
                      </div>
                      <div className="flex gap-1 mt-1">
                        <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about troubleshooting, system issues..."
                className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isTyping}
                icon={Send}
              >
                Send
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search for help articles, FAQs, or troubleshooting guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-neutral-200 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* Common Issues */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Common Issues</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {commonIssues.map(issue => (
            <button
              key={issue.id}
              className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 rounded-lg text-left transition-colors"
            >
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <issue.icon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-white text-sm">{issue.title}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{issue.category}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Help Articles */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Popular Help Articles</h2>
          </div>
          <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            View All
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="space-y-3">
          {helpArticles.map(article => (
            <button
              key={article.id}
              className="w-full flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 rounded-lg text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-neutral-400" />
                <p className="font-medium text-neutral-900 dark:text-white">{article.title}</p>
              </div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{article.views} views</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Contact Support */}
      <Card>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">Contact Support</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contactOptions.map(option => (
            <div
              key={option.id}
              className="p-6 bg-neutral-50 dark:bg-neutral-700 rounded-lg text-center"
            >
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <option.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">{option.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">{option.description}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">{option.availability}</p>
              <Button size="small" variant="secondary" className="w-full">
                {option.action}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* System Diagnostics */}
      <Card>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">System Diagnostics</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Run automated diagnostics to identify and fix common issues
        </p>

        <div className="flex gap-3">
          <Button variant="secondary">
            Run Diagnostics
          </Button>
          <Button variant="ghost">
            View Report History
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Support;
