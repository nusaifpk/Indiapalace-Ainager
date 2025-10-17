import { useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { Message } from "@/hooks/use-chat";

interface ChatContainerProps {
  messages: Message[];
  sendMessage: (message: string) => void;
  isLoading: boolean;
  initializeChat: () => void;
}

export function ChatContainer({ messages, sendMessage, isLoading, initializeChat }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50" style={{background: 'linear-gradient(135deg, #fffbeb 0%, #fff7ed 50%, #fef2f2 100%)'}}>
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-red-900 to-orange-900 border-b-4 border-gold-400 px-4 py-6 shadow-xl" style={{borderBottomColor: '#d4af37'}}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <i className="fas fa-robot text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-100">🤖 AI Culinary Assistant</h1>
              <p className="text-sm text-amber-200 flex items-center justify-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Ask me about our menu, ingredients, or dietary preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div 
        ref={chatContainerRef}
        className="min-h-[60vh] overflow-y-auto pb-24 scroll-smooth"
      >
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          {messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              onLinkClick={(topic) => sendMessage(topic)}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Chat Input */}
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}
