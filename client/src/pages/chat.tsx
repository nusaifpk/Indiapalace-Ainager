import { ChatContainer } from "@/components/chat/chat-container";
import { RestaurantLanding } from "@/components/restaurant/restaurant-landing";
import { useChat } from "@/hooks/use-chat";
import { useEffect } from "react";

export default function Chat() {
  const { messages, sendMessage, sendFoodMessage, isLoading, initializeChat } = useChat();

  // Ensure page starts at the top when component mounts
  useEffect(() => {
    // Small delay to ensure this happens after any other automatic scrolling
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <RestaurantLanding onFoodClick={(foodName, foodImage) => sendFoodMessage(foodName, foodImage)} />
      <div id="chat-section">
        <ChatContainer 
          messages={messages}
          sendMessage={sendMessage}
          isLoading={isLoading}
          initializeChat={initializeChat}
        />
      </div>
      
      {/* Floating Call Button */}
      <div className="fixed top-4 right-4 z-50">
        <a 
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 animate-"
          title="Call India Palace Restaurant"
        >
          <i className="fas fa-phone text-xl"></i>
        </a>
      </div>
    </div>
  );
}
