import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useVoice } from "@/contexts/voice-context";
import type { ChatRequest, ChatResponse } from "@shared/schema";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  htmlContent?: string;
  timestamp: Date;
  isLoading?: boolean;
}

export function useChat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const queryClient = useQueryClient();
  const { isMuted } = useVoice();

  // Get welcome message
  const { data: welcomeData } = useQuery<{ htmlContent: string }>({
    queryKey: ["/api/welcome"],
    staleTime: Infinity,
  });

  // Initialize with welcome message
  const initializeChat = useCallback(() => {
    if (welcomeData?.htmlContent && messages.length === 0) {
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: "Welcome to TechCorp!",
        htmlContent: welcomeData.htmlContent,
        timestamp: new Date(),
      }]);
    }
  }, [welcomeData, messages.length]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (request: ChatRequest): Promise<ChatResponse> => {
      const response = await apiRequest("POST", "/api/chat", request);
      return response.json();
    },
    onSuccess: (data) => {
      // Remove loading message and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: data.id.toString(),
          role: data.role,
          content: data.content,
          htmlContent: data.htmlContent,
          timestamp: new Date(data.createdAt),
        }];
      });
      
      // Update session ID if it's new
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }
    },
    onError: (error) => {
      // Remove loading message and show error
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "I apologize, but I'm having trouble responding right now. Please try again.",
          htmlContent: `<div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center">
              <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
              <p class="text-red-800 text-sm">
                <strong>Error:</strong> ${error instanceof Error ? error.message : "Failed to send message"}
              </p>
            </div>
          </div>`,
          timestamp: new Date(),
        }];
      });
    },
  });

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    // Add loading message
    const loadingMessage: ChatMessage = {
      id: `loading-${Date.now()}`,
      role: "assistant",
      content: "Chef is typing....",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);

    // Send to API
    sendMessageMutation.mutate({
      message: content.trim(),
      sessionId: sessionId || undefined,
    });
  }, [sessionId, sendMessageMutation]);

  // Function to handle food card clicks with voice response
  const sendFoodMessage = useCallback(async (foodName: string, foodImage?: string) => {
    if (!foodName.trim()) return;

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: `Tell me about ${foodName}`,
      timestamp: new Date(),
    };

    // Add loading message
    const loadingMessage: ChatMessage = {
      id: `loading-${Date.now()}`,
      role: "assistant",
      content: "AI is preparing a detailed description...",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);

    try {
      // Call the food voice API
      const response = await apiRequest("POST", "/api/food-voice", { 
        foodName, 
        foodImage: foodImage || null 
      });
      const data = await response.json();

      // Remove loading message and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: `food-${Date.now()}`,
          role: "assistant",
          content: data.text,
          htmlContent: data.html,
          timestamp: new Date(),
        }];
      });

      // Speak the response using Web Speech API (only if not muted)
      if ('speechSynthesis' in window && !isMuted) {
        const utterance = new SpeechSynthesisUtterance(data.text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        
        // Try to use a more natural voice if available
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Google') || 
          voice.name.includes('Microsoft') || 
          voice.name.includes('Natural')
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error("Food voice response error:", error);
      
      // Remove loading message and show error
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "I apologize, but I'm having trouble describing that dish right now. Please try again.",
          htmlContent: `<div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center">
              <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
              <p class="text-red-800 text-sm">
                <strong>Error:</strong> Failed to get food description
              </p>
            </div>
          </div>`,
          timestamp: new Date(),
        }];
      });
    }
  }, []);

  return {
    messages,
    sendMessage,
    sendFoodMessage,
    isLoading: sendMessageMutation.isPending,
    initializeChat,
    sessionId,
  };
}
