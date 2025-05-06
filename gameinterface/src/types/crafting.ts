import { Item } from "./items";


export interface Recipe {
  id: string;
  name: string;
  description: string;
  required: {
    itemId: string;
    name: string;
    quantity: number;
    icon: string;
    tier?: number;
  }[];
  output: Item;
  craftingTime?: number; // in seconds
  skillRequired?: string;
  skillLevel?: number;
}
