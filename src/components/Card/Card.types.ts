import { CardData } from "@/app/GridStateProvider/GridStateProvider.types";

export interface CardProps {
  card: CardData;
  index: number;
  isEditable: boolean;
  isDraggable: boolean;
  isCenter?: boolean;
  onDragStart: (index: number) => void;
  onDrop: (index: number) => void;
  onEdit: (index: number) => void;
}
