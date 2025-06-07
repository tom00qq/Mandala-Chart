export interface CardData {
  id: string;
  title: string;
  content: string;
  bgColor: string;
}

export interface GridSection {
  id: string;
  sectionIndex: number;
  cards: CardData[];
}
