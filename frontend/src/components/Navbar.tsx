import { BarChart3, Boxes, Package } from "lucide-react";

export type Page = "products" | "stats";

export default function Navbar({ page }: { page: Page }) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <a href="#main-content" className="sr-only rounded-md bg-white font-semibold shadow focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:p-3">
        Saltar al contenido
      </a>
      <div className="page-shell flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-4">
        <a href="#products" aria-label="Inventario, inicio" className="flex min-h-11 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-600 text-white">
            <Boxes aria-hidden="true" width={23} height={23} />
          </span>
          <span className="text-xl font-bold">Inventario<span className="text-brand-600">.</span></span>
        </a>
        <nav aria-label="Navegación principal" className="flex flex-wrap gap-2">
          {([
            { id: "products", label: "Productos", icon: Package },
            { id: "stats", label: "Estadísticas", icon: BarChart3 },
          ] as const).map(({ id, label, icon: Icon }) => (
            <a key={id} href={`#${id}`} aria-current={page === id ? "page" : undefined}
              className={`flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold ${page === id ? "bg-brand-50 text-brand-700" : "text-gray-600 hover:bg-gray-100"}`}>
              <Icon aria-hidden="true" width={18} height={18} />{label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}