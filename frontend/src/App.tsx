import React, { Suspense, useEffect, useRef, useState } from "react";
import Navbar, { type Page } from "./components/Navbar";
import Spinner from "./components/Spinner";

const ProductList = React.lazy(() => import("./pages/ProductList"));
const StatsPage = React.lazy(() => import("./pages/StatsPage"));
const getPage = (): Page => window.location.hash === "#stats" ? "stats" : "products";

class ViewBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return (
      <div role="alert" className="py-16 text-center">
        <h1 className="mb-4 text-xl font-semibold">No se pudo abrir esta vista</h1>
        <button type="button" className="control mx-auto" onClick={() => window.location.reload()}>Volver a cargar</button>
      </div>
    );
    return this.props.children;
  }
}

export default function App() {
  const [page, setPage] = useState<Page>(getPage);
  const main = useRef<HTMLElement>(null);
  const previousPage = useRef(page);

  useEffect(() => {
    const handleNavigation = () => {
      if (window.location.hash === "#main-content") {
        main.current?.focus();
        return;
      }
      setPage(getPage());
    };
    window.addEventListener("hashchange", handleNavigation);
    return () => window.removeEventListener("hashchange", handleNavigation);
  }, []);

  useEffect(() => {
    document.title = `Inventario | ${page === "products" ? "Productos" : "Estadísticas"}`;
    if (previousPage.current !== page) main.current?.focus({ preventScroll: true });
    previousPage.current = page;
  }, [page]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar page={page} />
      <main id="main-content" ref={main} tabIndex={-1} aria-label={page === "products" ? "Productos" : "Estadísticas"} className="page-shell flex-1 py-8 sm:py-10 focus-visible:outline-none">
        <ViewBoundary key={page}>
          <Suspense fallback={<Spinner label="Cargando vista" />}>
            {page === "products" ? <ProductList /> : <StatsPage />}
          </Suspense>
        </ViewBoundary>
      </main>
      <footer className="mt-10 border-t border-gray-200 bg-white py-5 text-xs text-gray-600">
        <div className="page-shell flex flex-wrap justify-between gap-3"><p>Inventario · Gestión de productos</p><p>Precios expresados en USD</p></div>
      </footer>
    </div>
  );
}