import { useState, useCallback } from "react";
import html2canvas from "html2canvas";

interface ScreenshotOptions {
  elementId?: string;
  filename?: string;
  scale?: number;
  backgroundColor?: string;
}

export const useScreenshot = () => {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureElement = useCallback(
    async (options: ScreenshotOptions = {}) => {
      const {
        elementId = "screenShot_3x3",
        filename = `mandala-chart-${new Date().toISOString().slice(0, 10)}.png`,
        scale = window.devicePixelRatio || 1,
        backgroundColor = "#ffffff",
      } = options;

      try {
        setIsCapturing(true);

        const targetElement = document.getElementById(elementId);

        if (!targetElement) {
          throw new Error(`找不到截圖目標元素 #${elementId}`);
        }

        // 確保元素在視窗中可見
        targetElement.scrollIntoView({
          behavior: "instant",
          block: "center",
          inline: "center",
        });

        // 等待滾動完成
        await new Promise((resolve) => setTimeout(resolve, 100));

        const canvas = await html2canvas(targetElement, {
          useCORS: true,
          allowTaint: false,
          scale,
          backgroundColor,
          width: targetElement.offsetWidth,
          height: targetElement.offsetHeight,
        });

        // 下載圖片
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, "image/png");
      } catch (error) {
        console.error("截圖失敗:", error);
        throw error;
      } finally {
        setIsCapturing(false);
      }
    },
    []
  );

  const captureGridView = useCallback(
    (backgroundColor: string, elementId: string, filename?: string) => {
      const defaultFilename =
        filename || `screenshot-${new Date().toISOString().slice(0, 10)}.png`;

      console.log("backgroundColor", backgroundColor);
      console.log("capturing elementId", elementId);

      return captureElement({
        elementId,
        filename: defaultFilename,
        backgroundColor,
      });
    },
    [captureElement]
  );

  return {
    isCapturing,
    captureElement,
    captureGridView,
  };
};
