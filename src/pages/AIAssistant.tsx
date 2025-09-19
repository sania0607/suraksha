import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '@/contexts/AIContext';
import { QUICK_ACTIONS, CONVERSATION_STARTERS } from '@/lib/ai-prompts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Bot, 
  User, 
  Trash2, 
  Settings, 
  AlertTriangle,
  MessageSquare,
  Lightbulb,
  Shield
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const AIAssistant: React.FC = () => {
  const { messages, isLoading, sendMessage, clearChat, apiKey, setApiKey, isConfigured } = useAI();
  const [inputText, setInputText] = useState('');
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    try {
      await sendMessage(inputText);
      setInputText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const saveApiKey = () => {
    setApiKey(tempApiKey);
    setIsSettingsOpen(false);
  };

  // Use improved quick actions from prompts library
  const quickPrompts = CONVERSATION_STARTERS.slice(0, 4).map((prompt, index) => ({
    icon: [<AlertTriangle className="h-4 w-4" />, <Shield className="h-4 w-4" />, <Lightbulb className="h-4 w-4" />, <MessageSquare className="h-4 w-4" />][index],
    text: prompt,
    category: ["Emergency", "Planning", "Preparation", "Communication"][index]
  }));

  if (!isConfigured) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="text-4xl mb-4">🤖</div>
            <CardTitle>Setup Suraksha AI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                To use the AI assistant, you need to configure your Gemini API key.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="apiKey">Gemini API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
              />
            </div>
            
            <Button onClick={saveApiKey} className="w-full" disabled={!tempApiKey.trim()}>
              Save API Key
            </Button>
            
            <div className="text-sm text-muted-foreground text-center">
              <p>Get your API key from:</p>
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google AI Studio
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">🤖 Suraksha AI Assistant</h1>
          <p className="text-muted-foreground">Your disaster preparedness expert</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>AI Assistant Settings</DialogTitle>
                <DialogDescription>
                  Configure your Gemini API key and preferences.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKeySettings">Gemini API Key</Label>
                  <Input
                    id="apiKeySettings"
                    type="password"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key"
                  />
                </div>
                <Button onClick={saveApiKey} className="w-full">
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm" onClick={clearChat}>
            <Trash2 className="h-4 w-4" />
            Clear Chat
          </Button>
        </div>
      </div>

      {/* Quick Prompts */}
      {messages.length === 0 && (
        <div className="space-y-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Quick Start - Emergency Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {QUICK_ACTIONS.map((category, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <CardTitle className="text-sm">{category.title}</CardTitle>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {category.prompts.slice(0, 2).map((prompt, pIndex) => (
                          <Button
                            key={pIndex}
                            variant="ghost"
                            size="sm"
                            className="h-auto p-2 justify-start text-left w-full"
                            onClick={() => setInputText(prompt.prompt)}
                          >
                            <div className="text-xs">{prompt.title}</div>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-3 justify-start text-left"
                    onClick={() => setInputText(prompt.text)}
                  >
                    <div className="flex items-start gap-3">
                      {prompt.icon}
                      <div>
                        <div className="font-medium text-sm">{prompt.text}</div>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {prompt.category}
                        </Badge>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Start a conversation with Suraksha AI</p>
                  <p className="text-sm">Ask about emergency procedures, safety protocols, or disaster preparedness</p>
                </div>
              )}
              
              {messages.map((message, index) => (
                <div key={message.id}>
                  <div className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.isUser 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-secondary-foreground'
                      }`}>
                        {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      
                      <div className={`rounded-lg p-3 ${
                        message.isUser 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary'
                      }`}>
                        <div className="whitespace-pre-wrap">{message.text}</div>
                        <div className={`text-xs mt-2 opacity-70`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {index < messages.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-secondary rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="animate-pulse">Thinking...</div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Input Area */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about emergency procedures, safety protocols, or disaster preparedness..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputText.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            💡 Tip: In real emergencies, always call emergency services (911) first
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;