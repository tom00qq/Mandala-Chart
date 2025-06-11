import { useState } from "react";
import GridContainer from "@/components/GridContainer/GridContainer";
import ResetButton from "@/components/ResetButton/ResetButton";
import ScreenshotButton from "@/components/ScreenshotButton/ScreenshotButton";
import ColorPicker from "@/components/ColorPicker/ColorPicker";
import ModeToggleButton from "@/components/ModeToggleButton/ModeToggleButton";

export type Mode = "3x3" | "9x9";

function App() {
  const [mode, setMode] = useState<Mode>("3x3");
  const [bgColor, setBgColor] = useState<string>("#a33b3b");

  return (
    <main className="flex" style={{ backgroundColor: bgColor }}>
      <div className="fixed top-4 right-4 z-10 flex gap-2">
        <ModeToggleButton mode={mode} onModeChange={setMode} />
        <ScreenshotButton backgroundColor={bgColor} />
        <ResetButton />
        <ColorPicker
          color={bgColor}
          onChange={setBgColor}
          position={{ top: "50px", right: "0px" }}
        />
      </div>

      <GridContainer mode={mode} />
    </main>
  );
}

export default App;
