import { createContext } from "react";

export const CARDS = Array(10)
  .fill(1)
  .map((_, i) => ({
    id: i,
    front: `Sint est quidem id ut eligendi. Minus veritatis dolorum porro velit unde consequatur enim voluptates. Dolorum laudantium laborum fugit nam consequatur quia.`,
    back: `Ipsum reiciendis pariatur blanditiis non reiciendis labore. Sed error ducimus natus mollitia consequatur ut voluptatem aut. Dolorem porro voluptates perspiciatis. Esse adipisci enim voluptate vel facilis et voluptas.

    Ad ullam dicta libero. Voluptas quo et molestiae ipsam. Adipisci quaerat velit officiis doloribus eligendi.
    
    `,
  }));

export const CardContext = createContext<{
  cards: Card[];
  updateCards: (cards: Card[]) => unknown;
}>({ cards: CARDS, updateCards: () => {} });

export type Card = {
  id: number | string;
  front: React.ReactNode | string;
  back: React.ReactNode | string;
};
