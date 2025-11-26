import { MenuItem } from "./menuItem";

export interface Order {
    id: number;
    userId: number;
    status: string;
    total_value: number;
    items: MenuItem[];
}