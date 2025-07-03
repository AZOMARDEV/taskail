import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';

// Define the context type
interface TabBarContextType {
  isTabBarVisible: boolean;
  setIsTabBarVisible: Dispatch<SetStateAction<boolean>>;
}

// Create the context with proper typing
const TabBarContext = createContext<TabBarContextType>({
  isTabBarVisible: true,
  setIsTabBarVisible: () => {}, // This is a placeholder function that will be replaced
});

// Provider component with proper typing
export function TabBarProvider({ children }: { children: React.ReactNode }) {
  const [isTabBarVisible, setIsTabBarVisible] = useState<boolean>(true);

  return (
    <TabBarContext.Provider value={{ isTabBarVisible, setIsTabBarVisible }}>
      {children}
    </TabBarContext.Provider>
  );
}

// Hook to use the context
export function useTabBar(): TabBarContextType {
  return useContext(TabBarContext);
}