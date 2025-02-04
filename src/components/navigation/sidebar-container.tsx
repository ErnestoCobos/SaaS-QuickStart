import { Sidebar } from "./sidebar"
import { SidebarContent } from "./sidebar-content"

export async function SidebarContainer() {
  const { menuItems } = await SidebarContent()
  return <Sidebar menuItems={menuItems} />
}
