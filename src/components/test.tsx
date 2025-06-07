import React from "react";

interface TestProps {
  message?: string;
}

const Test: React.FC<TestProps> = ({ message = "Default Message" }) => {
  return (
    <div className="test-component">
      <h2>Test Component</h2>
      <p>{message}</p>
    </div>
  );
};

export default Test;
