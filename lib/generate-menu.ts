// Mapeo de rutas a nombres de iconos
const routeIconMap: Record<string, string> = {
  dashboard: "Home",
  projects: "FolderClosed",
  analytics: "BarChart3",
  reports: "FileText",
  extensions: "LayoutGrid",
  companies: "Building2",
  people: "Users",
  help: "HelpCircle",
  notifications: "Bell",
}

// Rutas que no deberían aparecer en el menú
const excludedRoutes = new Set([
  "sign-in",
  "sign-up",
  "api",
  "_next",
  "favicon.ico",
  "page",
])

export interface MenuItem {
  iconName: string
  label: string
  href: string
  badge?: string
  badgeVariant?: "default" | "destructive"
}

// Función para formatear el label (convertir "my-route" a "My Route")
function formatLabel(route: string): string {
  return route
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Función para generar el menú basado en las rutas disponibles
export function generateMenu(routes: string[]): MenuItem[] {
  const menuItems: MenuItem[] = []

  routes.forEach(route => {
    // Ignorar rutas excluidas y archivos que no son páginas
    if (excludedRoutes.has(route) || route.includes(".")) {
      return
    }

    // Limpiar la ruta
    const cleanRoute = route.replace(/\/page$/, "")
    const label = formatLabel(cleanRoute)
    
    menuItems.push({
      iconName: routeIconMap[cleanRoute] || "FolderClosed", // Usar FolderClosed como icono por defecto
      label,
      href: `/${cleanRoute}`,
    })
  })

  // Ordenar el menú (dashboard siempre primero, luego alfabéticamente)
  return menuItems.sort((a, b) => {
    if (a.href === "/dashboard") return -1
    if (b.href === "/dashboard") return 1
    return a.label.localeCompare(b.label)
  })
}
