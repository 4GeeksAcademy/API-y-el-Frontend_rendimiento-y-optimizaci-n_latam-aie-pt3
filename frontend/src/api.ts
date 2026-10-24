import { useEffect, useState } from "react";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  image_url: string;
  reviewCount: number;
  color?: string;
  material?: string;
}

export interface Stats {
  total_products: number;
  total_inventory_value: number;
  average_price: number;
  total_stock: number;
}

const API_URL = (import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:8000`).replace(/\/$/, "");
const cache = new Map<string, { data: unknown; expires: number }>();
export const numberFormat = new Intl.NumberFormat("es");
export const moneyFormat = new Intl.NumberFormat("es", { style: "currency", currency: "USD" });

async function request(path: string, signal: AbortSignal) {
  const response = await fetch(`${API_URL}${path}`, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function loadProducts(signal: AbortSignal): Promise<Product[]> {
  const data = await request("/api/products", signal);
  if (!Array.isArray(data)) throw new Error("Respuesta de catálogo no válida");
  return data.map((product) => ({
    id: product.id, name: product.name, category: product.category,
    price: product.price, stock: product.stock, rating: product.rating,
    image_url: product.image_url, reviewCount: product.reviews?.length || 0,
    color: product.metadata?.color, material: product.metadata?.material,
  }));
}

export async function loadStats(signal: AbortSignal): Promise<Stats> {
  const data = await request("/api/stats", signal);
  if (![data.total_products, data.total_inventory_value, data.average_price, data.total_stock].every(Number.isFinite)) {
    throw new Error("Respuesta de estadísticas no válida");
  }
  return data;
}

export function useResource<Data>(key: string, load: (signal: AbortSignal) => Promise<Data>) {
  const [state, setState] = useState<{ data: Data | null; loading: boolean; error: boolean }>({ data: null, loading: true, error: false });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const cached = cache.get(key);
    if (cached && cached.expires > Date.now()) {
      setState({ data: cached.data as Data, loading: false, error: false });
      return;
    }
    const controller = new AbortController();
    setState({ data: null, loading: true, error: false });
    load(controller.signal).then((data) => {
      if (controller.signal.aborted) return;
      cache.set(key, { data, expires: Date.now() + 60_000 });
      setState({ data, loading: false, error: false });
    }).catch(() => {
      if (!controller.signal.aborted) setState({ data: null, loading: false, error: true });
    });
    return () => controller.abort();
  }, [key, load, attempt]);

  return { ...state, retry: () => setAttempt((previous) => previous + 1) };
}