import React, { useState } from "react";
import Editor from "@/components/Editor/Editor";
import ColorPicker from "@/components/ColorPicker/ColorPicker";
import type { CardData } from "@/components/GridContainer/GridContainer.types";

interface CardModalProps {
  card: CardData;
  onSave: (updatedCard: CardData, syncBgColors: boolean) => void;
  onCancel: () => void;
}

const CardModal: React.FC<CardModalProps> = ({ card, onSave, onCancel }) => {
  const [title, setTitle] = useState(card.title);
  const [content, setContent] = useState(card.content);
  const [bgColor, setBgColor] = useState(card.bgColor || "#ffffff");
  const [syncBgColor, setSyncBgColor] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...card, title, content, bgColor }, syncBgColor);
  };

  const handleColorChange = (color: string) => {
    setBgColor(color);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-[520px]">
      <h2 className="text-xl font-semibold mb-4">編輯卡片</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">標題</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">內容</label>
          <div className="w-full h-[250px] overflow-auto p-2 border rounded bg-white resize-none cursor-text focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-500">
            <Editor
              content={content}
              onSave={(content: string) => setContent(content)}
            />
          </div>
        </div>

        <div className="mb-6 flex justify-between">
          <div>
            <label className="block text-sm font-medium mr-1">顏色</label>
            <ColorPicker
              color={bgColor}
              onChange={handleColorChange}
              position={{
                left: "3.5rem",
                bottom: "0",
              }}
            />
          </div>

          <div className=" flex items-center">
            <input
              id="syncBgColor"
              type="checkbox"
              onClick={() => setSyncBgColor(!syncBgColor)}
            />
            <label
              className="block text-sm font-medium ml-1"
              htmlFor="syncBgColor"
            >
              將顏色套用於周邊 8 張卡片
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
};

export default CardModal;
