
export interface Buff {
  statType: string;
  value: number;
  expiresAt: Date;
  timerId: number;
  itemName?: string;
  itemId?: string;
  buffKey?: string;
}
