import { CartItem } from './cartItem';
import { MenuItem } from './menuItem';

export interface Order {
  id: number;
  user_id: number;
  status: string;
  total_value: number;
  created_at: Date;
  items: any[];
}

export interface NewOrder {
  user_id: number;
  items: NewOrderItem[];
}

export interface NewOrderItem {
  item_id: number;
  quantity: number;
  observation?: string;
}
