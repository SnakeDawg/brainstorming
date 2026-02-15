import { Message } from '../types/setup';

export const getMockConversation = (userName: string = 'Alex'): Message[] => {
  return [
    {
      id: 'msg-1',
      role: 'assistant',
      content: `Nice to meet you, ${userName}! I'm here to help set up your new PC perfectly for you. To get started, tell me a bit about how you'll be using this computer. What do you mainly plan to do with it?`,
      timestamp: new Date(Date.now() - 180000), // 3 minutes ago
    },
    {
      id: 'msg-2',
      role: 'user',
      content: 'I mainly need it for work. I do a lot of coding and software development, plus video calls and project management.',
      timestamp: new Date(Date.now() - 150000),
    },
    {
      id: 'msg-3',
      role: 'assistant',
      content: 'Great! Software development sounds exciting. What programming languages or tools do you work with most often?',
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: 'msg-4',
      role: 'user',
      content: 'I work primarily with JavaScript, TypeScript, React, and Node.js. I also use Docker and Git regularly.',
      timestamp: new Date(Date.now() - 90000),
    },
    {
      id: 'msg-5',
      role: 'assistant',
      content: 'Perfect! And do you do any creative work like design, photo editing, or video editing on this machine?',
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: 'msg-6',
      role: 'user',
      content: 'Not really, mostly just development work and communication tools for team collaboration.',
      timestamp: new Date(Date.now() - 30000),
    },
  ];
};

export const getMockGamingConversation = (userName: string = 'Alex'): Message[] => {
  return [
    {
      id: 'msg-1',
      role: 'assistant',
      content: `Nice to meet you, ${userName}! I'm here to help set up your new PC perfectly for you. To get started, tell me a bit about how you'll be using this computer. What do you mainly plan to do with it?`,
      timestamp: new Date(Date.now() - 180000),
    },
    {
      id: 'msg-2',
      role: 'user',
      content: 'Gaming is my main focus! I play a lot of competitive FPS games and some AAA titles.',
      timestamp: new Date(Date.now() - 150000),
    },
    {
      id: 'msg-3',
      role: 'assistant',
      content: 'Awesome! What games do you play the most?',
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: 'msg-4',
      role: 'user',
      content: 'Mainly Valorant, CS:GO, and some Call of Duty. I also stream occasionally on Twitch.',
      timestamp: new Date(Date.now() - 90000),
    },
  ];
};
