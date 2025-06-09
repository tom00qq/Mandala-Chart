import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface GridContextType {
  resetGrid: () => void;
  resetTrigger: number;
}

const GridContext = createContext<GridContextType | null>(null);

export const useGridContext = () => {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error("useGridContext must be used within GridProvider");
  }
  return context;
};

interface GridProviderProps {
  children: ReactNode;
}

export const GridProvider: React.FC<GridProviderProps> = ({ children }) => {
  const [resetTrigger, setResetTrigger] = useState(0);

  const resetGrid = () => {
    setResetTrigger((prev) => prev + 1);
  };

  return (
    <GridContext.Provider value={{ resetGrid, resetTrigger }}>
      {children}
    </GridContext.Provider>
  );
};
