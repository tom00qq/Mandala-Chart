import { useState, useEffect } from "react";
import { centeredCardModal } from "@/utils/grid/gridUtils";

interface UseCardEditorProps {
  offset?: { x: number; y: number };
  modalSize?: { width: number; height: number };
}

export const useCardEditor = ({
  offset = { x: 0, y: 0 },
  modalSize = { width: 520, height: 576 },
}: UseCardEditorProps = {}) => {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const handleEdit = (index: number) => {
    setEditIndex(index);
  };

  const handleCancel = () => {
    setEditIndex(null);
  };

  const closeEditor = () => {
    setEditIndex(null);
  };

  // 計算 modal 位置
  useEffect(() => {
    if (editIndex !== null) {
      const center = centeredCardModal(offset, modalSize);
      setModalPosition(center);
    }
  }, [editIndex, offset]);

  return {
    editIndex,
    modalPosition,
    handleEdit,
    handleCancel,
    closeEditor,
    isEditing: editIndex !== null,
  };
};
