import { useScreenshot } from "@/hooks/useScreenshot";

interface ScreenshotButtonProps {
  className?: string;
  children?: React.ReactNode;
  backgroundColor?: string;
  elementId: string;
  filename?: string;
}

const ScreenshotButton = ({
  className = "",
  children = "下載",
  backgroundColor = "#ffffff",
  elementId,
  filename,
}: ScreenshotButtonProps) => {
  const { isCapturing, captureGridView } = useScreenshot();

  const handleScreenshot = async () => {
    try {
      await captureGridView(backgroundColor, elementId, filename);
    } catch (error) {
      console.error("截圖失敗:", error);
      alert("截圖失敗，請重試");
    }
  };

  return (
    <button
      onClick={handleScreenshot}
      disabled={isCapturing}
      className={`
        inline-flex items-center justify-center
        px-4 py-2 
        bg-blue-500 hover:bg-blue-600 
        disabled:bg-gray-400 
        text-white font-medium
        rounded-lg
        transition-colors duration-200
        ${className}
      `}
    >
      {isCapturing ? (
        <>
          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
          截圖中...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default ScreenshotButton;
