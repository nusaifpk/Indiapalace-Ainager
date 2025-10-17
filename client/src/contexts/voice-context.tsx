import { createContext, useContext, useState, ReactNode } from 'react';

interface VoiceContextType {
  isMuted: boolean;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Stop any current speech when muting
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  const setMuted = (muted: boolean) => {
    setIsMuted(muted);
    if (muted && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  return (
    <VoiceContext.Provider value={{ isMuted, toggleMute, setMuted }}>
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
}
