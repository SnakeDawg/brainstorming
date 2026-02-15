import { useState, useCallback } from 'react';
import { useSetup } from '../contexts/SetupContext';
import { Message } from '../types/setup';

interface UseAIChatReturn {
  isTyping: boolean;
  sendMessage: (userMessage: string) => Promise<Message>;
  getCurrentSuggestions: () => string[];
}

// Get suggestions based on conversation state
function getSuggestionsForCurrentState(
  messageCount: number,
  _userName: string | null
): string[] {
  // First message is asking for name - no suggestions
  if (messageCount === 0) {
    return [];
  }

  // Second message - main use case suggestions
  if (messageCount === 1) {
    return ['Gaming', 'Work & Productivity', 'School & Learning', 'Creative Work', 'General Use'];
  }

  // Third message - depends on what they said, but provide general options
  if (messageCount === 2) {
    return ['Video Editing', 'Programming', 'Office Suite', 'Web Browsing', 'Tell me more...'];
  }

  // No more suggestions after third message (we're wrapping up)
  return [];
}

// Simulated AI response with intelligent recommendations
function generateAIResponse(
  userMessage: string,
  conversationHistory: Message[],
  userName: string | null
): string {
  const userMessageLower = userMessage.toLowerCase();
  const messageCount = conversationHistory.filter(m => m.role === 'user').length;

  // First message should be the user's name
  if (messageCount === 1 && !userName) {
    // Extract potential name from the first message
    const name = userMessage.trim().split(' ')[0];
    return `Nice to meet you, ${name}! I'm excited to help you set up your new PC. 😊\n\nTell me, how will you mainly be using this machine?`;
  }

  // Second message - detect main use case
  if (messageCount === 2) {
    const keywords = userMessageLower.split(/\s+/);

    if (keywords.some(k => ['gaming', 'game', 'play', 'fps', 'steam', 'competitive', 'casual', 'gamer'].includes(k))) {
      return `Great, ${userName}! I can tell you're a gamer. 🎮\n\nWhat types of games are you into? This helps me recommend the right software and optimize your settings.`;
    }

    if (keywords.some(k => ['work', 'office', 'productivity', 'business', 'professional'].includes(k))) {
      return `Perfect, ${userName}! Productivity is key. 💼\n\nWhat tools do you primarily use for work?`;
    }

    if (keywords.some(k => ['school', 'college', 'university', 'student', 'study', 'learning'].includes(k))) {
      return `Awesome, ${userName}! Education is important. 📚\n\nWhat will you need for school? Note-taking, video calls, programming?`;
    }

    if (keywords.some(k => ['video', 'photo', 'editing', 'creative', 'design', 'art', 'content'].includes(k))) {
      return `Exciting, ${userName}! Creativity needs power. 🎨\n\nWhat type of content do you create?`;
    }

    // Default for casual/general use
    return `Got it, ${userName}! Sounds like you'll need a well-rounded setup. 🏠\n\nAre there any specific apps or activities you do regularly?`;
  }

  // Third message - wrap up (skip migration since we assume Windows)
  if (messageCount >= 3) {
    return `Excellent, ${userName}! I have everything I need to personalize your setup. 🎉\n\nGive me just a moment to analyze your preferences and recommend the perfect apps for you...`;
  }

  // Fallback intelligent responses
  const fallbackResponses = [
    `That's really helpful, ${userName}! Tell me a bit more about that.`,
    `Interesting, ${userName}! Can you elaborate on what you'll need for that?`,
    `Got it! Any specific tools or apps you know you'll want installed?`,
  ];

  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
}

export function useAIChat(): UseAIChatReturn {
  const { state, dispatch } = useSetup();
  const [isTyping, setIsTyping] = useState(false);

  const getCurrentSuggestions = useCallback((): string[] => {
    const userMessages = state.messages.filter(m => m.role === 'user');
    return getSuggestionsForCurrentState(userMessages.length, state.userName);
  }, [state.messages, state.userName]);

  const sendMessage = useCallback(
    async (userMessage: string): Promise<Message> => {
      setIsTyping(true);

      // Check if this is the first message (user's name)
      const userMessages = state.messages.filter(m => m.role === 'user');
      if (userMessages.length === 0 && !state.userName) {
        // Extract name from first message
        const name = userMessage.trim().split(' ')[0];
        dispatch({ type: 'SET_USER_NAME', payload: name });
      }

      // Update user interview task progress
      const interviewTask = state.activeTasks.find(t => t.id === 'task-user-interview');
      if (interviewTask) {
        const progress = Math.min(90, (userMessages.length + 1) * 25);
        dispatch({
          type: 'UPDATE_TASK_PROGRESS',
          payload: {
            id: 'task-user-interview',
            progress,
            currentAction: `${userMessages.length + 1} questions answered`,
          },
        });
      }

      // Simulate typing delay (700-1200ms for realism)
      const delay = 700 + Math.random() * 500;
      await new Promise(resolve => setTimeout(resolve, delay));

      const aiResponse = generateAIResponse(userMessage, state.messages, state.userName);

      const message: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setIsTyping(false);
      return message;
    },
    [state.messages, state.userName, state.activeTasks, dispatch]
  );

  return {
    isTyping,
    sendMessage,
    getCurrentSuggestions,
  };
}
