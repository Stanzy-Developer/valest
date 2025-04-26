import { StateCreator } from 'zustand';

// Define UI stages
export type PaymentStage = 'form' | 'qrcode' | 'success';

// Define the UI state slice
export interface UiSlice {
  // UI state
  stage: PaymentStage;
  loading: boolean;
  error: string | null;
  
  // Navigation history
  navigationHistory: PaymentStage[];
  
  // Actions
  setStage: (stage: PaymentStage) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  goBack: () => boolean; // Returns true if successful, false if no history
  resetUi: () => void;
}

// Create the UI slice
export const createUiSlice: StateCreator<UiSlice> = (set, get) => ({
  // State
  stage: 'form',
  loading: false,
  error: null,
  navigationHistory: [],
  
  // Actions
  setStage: (stage) => {
    const currentStage = get().stage;
    
    // Only add to history if changing to a different stage
    if (currentStage !== stage) {
      set((state) => ({
        stage,
        navigationHistory: [...state.navigationHistory, currentStage],
      }));
    } else {
      set({ stage });
    }
  },
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  goBack: () => {
    const { navigationHistory } = get();
    
    if (navigationHistory.length === 0) {
      return false;
    }
    
    const previousStage = navigationHistory[navigationHistory.length - 1];
    const newHistory = navigationHistory.slice(0, -1);
    
    set({
      stage: previousStage,
      navigationHistory: newHistory,
    });
    
    return true;
  },
  
  resetUi: () => {
    set({
      stage: 'form',
      loading: false,
      error: null,
      navigationHistory: [],
    });
  },
}); 
