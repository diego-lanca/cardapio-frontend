import { MenuItem } from "./menuItem";

export interface MenuSection {
  name: string;
  icon: any;
  color: string;
  items: MenuItem[];
}