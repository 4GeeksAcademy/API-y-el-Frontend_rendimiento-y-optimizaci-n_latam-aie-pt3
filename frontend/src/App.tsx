// ──────────────────────────────────────────────────────────────
//  ANTI-PATRÓN: Sin React.memo, sin useCallback, sin useMemo
//  Sin lazy loading de rutas
//  Sin lazy loading de componentes
//  Sin Suspense
//  Sin ErrorBoundary
// ──────────────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";

import ProductList from "./pages/ProductList";
import StatsPage from "./pages/StatsPage";

export default function App() {
  const [page, setPage] = useState("products");

  return (
    <div>
      {/* ANTI-PATRÓN: Navegación recargando todo el estado cada vez */}
      <nav style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <h1 style={{
          color: "white",
          fontSize: "28px",
          margin: 0,
          fontFamily: "Impact, sans-serif",
        }}>
          🏪 Gestión de Productos (sin optimizar)
        </h1>
        <div style={{ marginTop: "12px", display: "flex", gap: "12px" }}>
          <button
            onClick={() => setPage("products")}
            style={{
              padding: "10px 24px",
              background: page === "products" ? "#fff" : "transparent",
              color: page === "products" ? "#667eea" : "#fff",
              border: "2px solid #fff",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            📦 Productos
          </button>
          <button
            onClick={() => setPage("stats")}
            style={{
              padding: "10px 24px",
              background: page === "stats" ? "#fff" : "transparent",
              color: page === "stats" ? "#667eea" : "#fff",
              border: "2px solid #fff",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            📊 Estadísticas
          </button>
        </div>
      </nav>

      <main style={{ padding: "24px", minHeight: "100vh" }}>
        {page === "products" && <ProductList />}
        {page === "stats" && <StatsPage />}
      </main>

      {/* ANTI-PATRÓN: Footer con imágenes sin lazy loading */}
      <footer style={{
        background: "#1a1a2e",
        color: "#fff",
        padding: "40px 24px",
        textAlign: "center",
        marginTop: "40px",
      }}>
        <p>© 2026 Product Manager — Sin derechos reservados</p>
        <div style={{ marginTop: "20px" }}>
          <img src="https://picsum.photos/800/200?random=footer1" style={{ width: "100%", maxWidth: "300px", margin: "8px" }} />
          <img src="https://picsum.photos/800/200?random=footer2" style={{ width: "100%", maxWidth: "300px", margin: "8px" }} />
          <img src="https://picsum.photos/800/200?random=footer3" style={{ width: "100%", maxWidth: "300px", margin: "8px" }} />
        </div>
      </footer>
    </div>
  );
}