import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPTS } from '@/lib/ai-prompts';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  isConfigured: boolean;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini-api-key') || '');

  const isConfigured = Boolean(apiKey);

  const sendMessage = async (text: string) => {
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: SYSTEM_PROMPTS.INITIAL_CONTEXT }],
          },
          {
            role: 'model',
            parts: [{ text: `Hello! I'm Suraksha AI, your disaster preparedness assistant. I'm here to help you with emergency procedures, safety protocols, and disaster response guidance.

${SYSTEM_PROMPTS.EMERGENCY_DISCLAIMER}

How can I assist you today?` }],
          },
        ],
      });

      const result = await chat.sendMessage(text);
      const response = await result.response;
      const responseText = response.text();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I apologize, but I encountered an error. Please check your API key and try again. 

${SYSTEM_PROMPTS.EMERGENCY_DISCLAIMER}`,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleSetApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini-api-key', key);
  };

  return (
    <AIContext.Provider
      value={{
        messages,
        isLoading,
        sendMessage,
        clearChat,
        apiKey,
        setApiKey: handleSetApiKey,
        isConfigured,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};