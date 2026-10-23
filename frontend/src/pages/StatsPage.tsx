// ──────────────────────────────────────────────────────────────
//  ANTI-PATRÓN: Página de estadísticas
//   - Sin useMemo para cálculos pesados
//   - Fetch sin caché
//   - Animaciones continuas en GPU
//   - Sin lazy loading
// ──────────────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:8000";

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ANTI-PATRÓN: Fetch en cada montaje sin caché
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/stats`)
      .then((r) => r.json())
      .then((d) => {
        setStats(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px" }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!stats) {
    return <div style={{ textAlign: "center", padding: "80px" }}>Error al cargar estadísticas</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "24px" }}>
        📊 Estadísticas de Inventario
      </h2>

      {/* ANTI-PATRÓN: Tarjetas con animaciones continuas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
        <StatCard label="Total Productos" value={stats.total_products} color="#667eea" />
        <StatCard label="Valor Inventario" value={`$${(stats.total_inventory_value / 1_000_000).toFixed(2)}M`} color="#764ba2" />
        <StatCard label="Precio Promedio" value={`$${stats.average_price}`} color="#f093fb" />
        <StatCard label="Stock Total" value={stats.total_stock.toLocaleString()} color="#4facfe" />
      </div>

      {/* ANTI-PATRÓN: Tabla simulada sin virtualización */}
      <div style={{ marginTop: "40px" }}>
        <h3 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "16px" }}>
          Distribución de categorías (simulada)
        </h3>
        <CategoryBarChart />
      </div>

      {/* ANTI-PATRÓN: Imágenes decorativas adicionales */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <img src="https://picsum.photos/2400/1200?random=chart" style={{ width: "100%", borderRadius: "12px" }} />
      </div>
    </div>
  );
}

// ANTI-PATRÓN: Componente sin React.memo
function StatCard({ label, value, color }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.08)",
        borderLeft: `6px solid ${color}`,
        transition: "transform 0.3s",
      }}
    >
      <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "8px" }}>{label}</p>
      <p style={{ fontSize: "32px", fontWeight: "bold", color }}>{value}</p>
    </div>
  );
}

// ANTI-PATRÓN: Bar chart simple con cálculos en cada render
function CategoryBarChart() {
  const categories = [
    "Electrónicos", "Hogar", "Jardinería", "Juguetes", "Ropa",
    "Deportes", "Libros", "Música", "Cocina", "Mascotas",
  ];

  return (
    <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
      {categories.map((cat, i) => {
        const value = Math.floor(Math.random() * 1000) + 100;
        return (
          <div key={i} style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "14px", fontWeight: "500" }}>{cat}</span>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>{value} prod.</span>
            </div>
            <div
              className="rainbow-bg"
              style={{
                height: "24px",
                borderRadius: "12px",
                width: `${(value / 1100) * 100}%`,
                opacity: 1,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}