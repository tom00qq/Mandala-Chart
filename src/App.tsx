import { useState } from "react";
import GridContainer from "@/components/GridContainer/GridContainer";

export type Mode = "3x3" | "9x9";

function App() {
  const [mode, setMode] = useState<Mode>("3x3");

  console.log(setMode);

  return (
    <main className="flex">
      <GridContainer mode={mode} />
    </main>
  );
}

export default App;
