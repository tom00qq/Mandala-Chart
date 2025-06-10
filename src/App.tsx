import { useState } from "react";
import GridContainer from "@/components/GridContainer/GridContainer";
import ResetButton from "@/components/ResetButton/ResetButton";
import ScreenshotButton from "@/components/ScreenshotButton/ScreenshotButton";

export type Mode = "3x3" | "9x9";

function App() {
  const [mode, setMode] = useState<Mode>("3x3");

  console.log(setMode);

  return (
    <main className="flex">
      <div className="fixed top-4 right-4 z-10 flex gap-2">
        <ScreenshotButton />
        <ResetButton />
      </div>

      <GridContainer mode={mode} />
    </main>
  );
}

export default App;
