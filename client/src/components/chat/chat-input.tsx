import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Rotating suggestion questions
  const suggestionQuestions = [
    "What are today's special dishes?",
    "Do you have any vegetarian options?",
    "What spices are used in your biryani?",
    "Can you recommend something spicy?",
    "What's the difference between your curries?",
    "Do you have gluten-free options?",
    "What's your most popular dish?",
    "Can you tell me about your tandoori items?",
    "What desserts do you recommend?",
    "Do you have any vegan dishes?",
    "What's in your butter chicken?",
    "Can you suggest a mild curry?",
    "What makes your biryani special?",
    "Do you have any healthy options?",
    "What's your signature dish?"
  ];

  const autoResize = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 128) + "px";
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setMessage(transcript);
          setIsListening(false);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  useEffect(() => {
    autoResize();
  }, [message, autoResize]);

  // Rotate placeholder text every 3 seconds with fade animation
  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setIsAnimating(true);
      
      // After fade out completes, change text and fade in
      setTimeout(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % suggestionQuestions.length);
        // Small delay before fading back in for smoother transition
        setTimeout(() => {
          setIsAnimating(false);
        }, 50);
      }, 300); // Fade out duration
    }, 3000);

    return () => clearInterval(interval);
  }, [suggestionQuestions.length]);

  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading) {
      onSendMessage(trimmedMessage);
      setMessage("");
    }
  }, [message, onSendMessage, isLoading]);

  const handleMicClick = useCallback(() => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      // Start listening
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    }
  }, [speechSupported, isListening]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const characterCount = message.length;
  const isOverLimit = characterCount > 2000;
  const canSend = message.trim() && !isLoading && !isOverLimit;
  const hasText = message.trim().length > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-amber-100 to-orange-100 border-t-4 border-gold-400 shadow-2xl z-50" style={{borderTopColor: '#d4af37'}}>
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder=""
                className="resize-none min-h-[48px] max-h-32 pr-12 w-full"
                rows={1}
                disabled={isLoading}
              />
              {/* Animated placeholder overlay */}
              <div 
                className={`absolute inset-0 flex items-center px-3 pointer-events-none transition-opacity duration-500 ease-in-out ${
                  message ? 'opacity-0' : isAnimating ? 'opacity-20' : 'opacity-40'
                }`}
                style={{
                  color: '#9CA3AF', // gray-400
                  fontSize: '14px',
                  lineHeight: '20px'
                }}
              >
                <span className="truncate">
                  {suggestionQuestions[currentPlaceholder]}
                </span>
              </div>
            </div>
            <Button
              onClick={hasText ? handleSend : handleMicClick}
              disabled={hasText ? !canSend : isLoading}
              size="sm"
              className={`absolute right-2 bottom-2 w-8 h-8 p-0 rounded-full transition-all duration-200 ${
                hasText 
                  ? "bg-blue-500 hover:bg-blue-600 text-white" 
                  : isListening
                    ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                    : speechSupported
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-gray-500 hover:bg-gray-600 text-white"
              }`}
            >
              <i className={`fas ${
                hasText 
                  ? "fa-paper-plane" 
                  : isListening 
                    ? "fa-stop" 
                    : "fa-microphone"
              } text-sm`}></i>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send • Shift+Enter for new line</span>
          <span className={isOverLimit ? "text-red-500" : ""}>
            {characterCount}/2000
          </span>
        </div>
      </div>
    </div>
  );
}
