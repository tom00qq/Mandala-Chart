import React from "react";

const ResetButton: React.FC = () => {
  const handleReset = () => {
    window.dispatchEvent(new CustomEvent("gridReset"));
  };

  return (
    <button
      onClick={handleReset}
      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors cursor-pointer"
    >
      重置
    </button>
  );
};

export default ResetButton;
