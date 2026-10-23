// ──────────────────────────────────────────────────────────────
//  ANTI-PATRÓN 9: Lista de productos SIN paginación en el frontend
//   - Carga TODOS los productos (10 000 registros) de golpe
//   - Sin virtualización (muestra TODO en el DOM)
//   - Sin lazy loading de imágenes
//   - Renderiza 10 000 elementos DOM al mismo tiempo
//   - Sin React.memo
//   - Sin useMemo ni useCallback
//   - Fetch sin abort controller
//   - Sin manejo de errores
//   - Sin estado de carga
// ──────────────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

const API_URL = "http://localhost:8000";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ANTI-PATRÓN: fetch sin manejo de errores, sin abort, sin caché
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      // Sin catch — si falla, la app se queda en blanco
      .catch(() => {
        // Sin manejo de error visible
        setLoading(false);
      });
  }, []);

  // ANTI-PATRÓN: Filtro en frontend (debería ser en backend)
  // Recorre 10 000 productos en cada render
  const filteredProducts = products.filter((p) => {
    if (!searchTerm) return true;
    return (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: "400px" }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* ANTI-PATRÓN: Input de búsqueda sin debounce ni throttle */}
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Buscar productos (filtra en frontend — ineficiente)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "600px",
            padding: "16px 20px",
            fontSize: "18px",
            border: "2px solid #667eea",
            borderRadius: "12px",
            outline: "none",
          }}
        />
        <p style={{ marginTop: "8px", color: "#666", fontSize: "14px" }}>
          Mostrando {filteredProducts.length} de {products.length} productos
          (sin paginación, sin virtualización)
        </p>
      </div>

      {/* ANTI-PATRÓN: Lista completa sin paginación — 10 000 tarjetas en el DOM */}
      <div
        className="flex flex-wrap justify-center gap-4"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* ANTI-PATRÓN: Imágenes decorativas adicionales en medio de la página */}
      <div style={{ textAlign: "center", marginTop: "48px", opacity: 0.5 }}>
        <h3>✨ Patrocinadores ✨</h3>
        <img src="https://picsum.photos/1200/400?random=sponsor1" style={{ width: "100%", maxWidth: "800px", margin: "16px" }} />
        <img src="https://picsum.photos/1200/400?random=sponsor2" style={{ width: "100%", maxWidth: "800px", margin: "16px" }} />
        <img src="https://picsum.photos/1200/400?random=sponsor3" style={{ width: "100%", maxWidth: "800px", margin: "16px" }} />
      </div>
    </div>
  );
}