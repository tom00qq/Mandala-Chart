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

  const screenshotElementId =
    mode === "3x3" ? "screenShot_3x3" : "screenShot_9x9";

  const screenshotFilename = `mandala-chart-${mode}-${new Date()
    .toISOString()
    .slice(0, 10)}.png`;

  return (
    <main className="flex" style={{ backgroundColor: bgColor }}>
      <div className="fixed top-4 right-4 z-10 flex gap-2">
        <ModeToggleButton mode={mode} onModeChange={setMode} />
        <ScreenshotButton
          backgroundColor={bgColor}
          elementId={screenshotElementId}
          filename={screenshotFilename}
        />
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
