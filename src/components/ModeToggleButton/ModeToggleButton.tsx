import React from "react";
import type { Mode } from "@/App";

interface ModeToggleButtonProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  className?: string;
}

const ModeToggleButton: React.FC<ModeToggleButtonProps> = ({
  mode,
  onModeChange,
  className = "",
}) => {
  const handleToggle = () => {
    const newMode: Mode = mode === "3x3" ? "9x9" : "3x3";
    onModeChange(newMode);
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        px-4 py-2 
        bg-green-500 hover:bg-green-600 
        text-white font-medium
        rounded-lg
        cursor-pointer
        ${className}
      `}
    >
      {mode === "3x3" ? "切換至 9x9" : "切換至 3x3"}
    </button>
  );
};

export default ModeToggleButton;
