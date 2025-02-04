import { Sidebar } from "@/components/sidebar"
import { SidebarContent } from "@/components/navigation/sidebar-content"

export async function SidebarContainer() {
  const { menuItems } = await SidebarContent()
  return <Sidebar menuItems={menuItems} />
}
