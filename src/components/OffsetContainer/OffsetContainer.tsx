import { useState, useEffect, type ReactNode } from "react";

export interface Offset {
  x: number;
  y: number;
}

interface childrenSize {
  width: number;
  height: number;
}

interface OffsetContainerProps {
  children: ReactNode;
  childrenSize: childrenSize;
  boundary?: number;
  onOffsetChange?: (offset: Offset) => void;
}

const OffsetContainer: React.FC<OffsetContainerProps> = ({
  children,
  childrenSize,
  boundary = 100,
  onOffsetChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [isWindowReady, setIsWindowReady] = useState(false);

  // 計算 平移範圍
  const getBounds = () => {
    return {
      maxX: boundary,
      minX: window.innerWidth - childrenSize.width - boundary,
      maxY: boundary,
      minY: window.innerHeight - childrenSize.height - boundary,
    };
  };

  // 計算 子元件置中偏移量
  const getCenteredChildOffset = (childrenSize: childrenSize) => {
    return {
      x: window.innerWidth / 2 - childrenSize.width / 2,
      y: window.innerHeight / 2 - childrenSize.height / 2,
    };
  };

  // 更新 偏移量
  const updateOffset = (newX: number, newY: number) => {
    const { minX, maxX, minY, maxY } = getBounds();

    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));

    setOffset({ x: newX, y: newY });
    onOffsetChange?.({ x: newX, y: newY });
  };

  // 拖曳
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 1) return; // 僅中鍵拖曳

    setIsDragging(true);
    setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const newX = e.clientX - startPos.x;
      const newY = e.clientY - startPos.y;
      updateOffset(newX, newY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mac 觸控板雙指滑動處理
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // 檢測是否為觸控板的雙指滑動手勢
    if (e.shiftKey || Math.abs(e.deltaX) > 0) {
      e.preventDefault();

      const sensitivity = 1; // 調整靈敏度
      const newX = offset.x - e.deltaX * sensitivity;
      const newY = offset.y - e.deltaY * sensitivity;

      updateOffset(newX, newY);
    }
  };

  useEffect(() => {
    const centeredOffset = getCenteredChildOffset(childrenSize);

    setOffset(centeredOffset);
    onOffsetChange?.(centeredOffset);
    setIsWindowReady(true);

    const handleResize = () => {
      const { minX, maxX, minY, maxY } = getBounds();
      setOffset((prev) => ({
        x: Math.max(minX, Math.min(maxX, prev.x)),
        y: Math.max(minY, Math.min(maxY, prev.y)),
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="relative w-full h-full"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{
        // 防止觸控板滾動時頁面跟著滾動
        overscrollBehavior: "none",
      }}
    >
      {isWindowReady && (
        <div
          className="absolute"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default OffsetContainer;
