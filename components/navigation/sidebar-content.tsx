import { getMenuItems } from "./menu-items"
import { MenuItem } from "@/lib/generate-menu"

export async function SidebarContent() {
  const menuItems = await getMenuItems()
  return { menuItems }
}
