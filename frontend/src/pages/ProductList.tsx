import { lazy, Suspense, useCallback, useDeferredValue, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Package, Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import Feedback from "../components/Feedback";
import { loadProducts, numberFormat, useResource, type Product } from "../api";

const ProductDetails = lazy(() => import("../components/ProductDetails"));
const PAGE_SIZE = 12;
const EMPTY_PRODUCTS: Product[] = [];
const productNameCollator = new Intl.Collator("es", { numeric: true });

export default function ProductList() {
  const { data, loading, error, retry } = useResource("products", loadProducts);
  const products = data || EMPTY_PRODUCTS;
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("name");
  const [inStock, setInStock] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Product | null>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const selectProduct = useCallback((product: Product) => setSelected(product), []);
  const closeDetails = useCallback(() => setSelected(null), []);

  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category))).sort((first, second) => first.localeCompare(second, "es")), [products]);
  const filtered = useMemo(() => {
    const query = deferredSearch.trim().toLocaleLowerCase("es");
    const result = products.filter((product) =>
      (!query || `${product.name} ${product.category}`.toLocaleLowerCase("es").includes(query)) &&
      (!category || product.category === category) && (!inStock || product.stock > 0));
    return result.sort((first, second) => sort === "price-asc" ? first.price - second.price : sort === "price-desc" ? second.price - first.price : sort === "rating" ? second.rating - first.rating : productNameCollator.compare(first.name, second.name));
  }, [products, deferredSearch, category, inStock, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleProducts = filtered.slice(start, start + PAGE_SIZE);
  const hasFilters = Boolean(search || category || inStock);
  const changePage = (next: number) => {
    setPage(next);
    resultsHeading.current?.focus({ preventScroll: true });
    resultsHeading.current?.scrollIntoView({ block: "start" });
  };
  const clearFilters = () => { setSearch(""); setCategory(""); setInStock(false); setPage(1); };

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="mb-2 text-xs font-semibold uppercase text-brand-700">Gestión de inventario</p><h1 className="text-3xl font-bold">Productos</h1><p className="mt-2 text-sm text-gray-600">Catálogo y disponibilidad</p></div>
        {data && <p className="flex items-center gap-2 text-sm text-gray-600"><Package aria-hidden="true" size={18} /><span className="font-semibold text-gray-900">{numberFormat.format(products.length)}</span> productos</p>}
      </div>

      <form role="search" aria-label="Buscar y filtrar productos" onSubmit={(event) => event.preventDefault()} className="mb-7 grid gap-4 border-y border-gray-200 py-5 md:grid-cols-[minmax(0,1fr)_200px_200px]">
        <div><label htmlFor="search" className="mb-2 block text-xs font-semibold text-gray-700">Buscar productos</label><div className="relative"><Search aria-hidden="true" size={18} className="pointer-events-none absolute left-3 top-3 text-gray-500" /><input id="search" type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Nombre o categoría" className="field pl-10" /></div></div>
        <div><label htmlFor="category" className="mb-2 block text-xs font-semibold text-gray-700">Categoría</label><select id="category" value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} className="field"><option value="">Todas las categorías</option>{categories.map((name) => <option key={name}>{name}</option>)}</select></div>
        <div><label htmlFor="sort" className="mb-2 block text-xs font-semibold text-gray-700">Ordenar por</label><select id="sort" value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} className="field"><option value="name">Nombre</option><option value="price-asc">Precio: menor a mayor</option><option value="price-desc">Precio: mayor a menor</option><option value="rating">Mejor valoración</option></select></div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 md:col-span-3">
          <SlidersHorizontal aria-hidden="true" size={16} className="text-gray-500" />
          <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={inStock} onChange={(event) => { setInStock(event.target.checked); setPage(1); }} className="h-4 w-4 accent-brand-600" />Solo con stock</label>
          {hasFilters && <button type="button" onClick={clearFilters} className="control"><X aria-hidden="true" size={16} />Limpiar filtros</button>}
        </div>
      </form>

      {loading ? <Spinner label="Cargando productos" /> : error ? <Feedback message="No pudimos cargar los productos. Comprueba tu conexión y vuelve a intentarlo." onRetry={retry} /> : (
        <section aria-labelledby="results-title" aria-busy={search !== deferredSearch}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id="results-title" ref={resultsHeading} tabIndex={-1} className="scroll-mt-6 text-sm font-semibold">Catálogo</h2>
            <p role="status" aria-atomic="true" className="text-xs text-gray-600">{filtered.length ? `${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} de ${numberFormat.format(filtered.length)} productos` : "0 productos"}</p>
          </div>
          {filtered.length ? <div className="grid auto-rows-[412px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visibleProducts.map((product, index) => <ProductCard key={product.id} product={product} onSelect={selectProduct} priority={index === 0} />)}</div> : <Feedback message="No hay productos que coincidan con los filtros seleccionados." />}
          <nav aria-label="Paginación de productos" className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-5">
            <button type="button" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1} className="control"><ArrowLeft aria-hidden="true" size={16} />Anterior</button>
            <span className="text-sm text-gray-600">Página <span className="font-semibold text-gray-900">{currentPage}</span> de {numberFormat.format(pageCount)}</span>
            <button type="button" onClick={() => changePage(currentPage + 1)} disabled={currentPage === pageCount} className="control">Siguiente<ArrowRight aria-hidden="true" size={16} /></button>
          </nav>
        </section>
      )}
      {selected && <Suspense fallback={<Spinner label="Abriendo detalles" />}><ProductDetails product={selected} onClose={closeDetails} /></Suspense>}
    </>
  );
}