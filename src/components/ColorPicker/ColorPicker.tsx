import { useCallback, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import useClickOutside from "@/hooks/useClickOutside";

interface PopoverPickerProps {
  color: string;
  onChange: (newColor: string) => void;
  position?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
}

const ColorPicker: React.FC<PopoverPickerProps> = ({
  color,
  onChange,
  position,
}) => {
  const popover = useRef<HTMLDivElement>(null);
  const [isOpen, toggle] = useState<boolean>(false);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  return (
    <div className="relative flex items-center">
      <div
        className="w-7 h-7 rounded-lg border-[3px] border-white shadow-[0_0_0_1px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(0,0,0,0.1)] cursor-pointer"
        style={{ backgroundColor: color }}
        onClick={() => toggle(true)}
      />
      {isOpen && (
        <div
          className="absolute rounded-[9px] shadow-[0_6px_12px_rgba(0,0,0,0.15)]"
          style={{
            top: position?.top ?? undefined,
            left: position?.left ?? undefined,
            right: position?.right ?? undefined,
            bottom: position?.bottom ?? undefined,
          }}
          ref={popover}
        >
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
