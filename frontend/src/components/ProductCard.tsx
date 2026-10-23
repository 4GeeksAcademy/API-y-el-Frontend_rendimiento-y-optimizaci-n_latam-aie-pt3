// ──────────────────────────────────────────────────────────────
//  ANTI-PATRÓN: Tarjeta de producto individual
//   - Sin React.memo
//   - Sin optimización de imágenes (src sin lazy loading, sin sizes)
//   - Sin formato WebP/AVIF
//   - Sin lazy loading
//   - Renderiza todo en cada re-render del padre
// ──────────────────────────────────────────────────────────────
import React from "react";

// ANTI-PATRÓN: Sin interface/type props definidos

export default function ProductCard({ product }) {
  // ANTI-PATRÓN: Cálculos repetidos en cada render
  const discount = Math.random() * 0.5;
  const originalPrice = (product.price / (1 - discount)).toFixed(2);
  const formattedDate = new Date(product.metadata?.created_at).toLocaleDateString();

  return (
    <div
      className="card-shadow"
      style={{
        width: "320px",
        background: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        transition: "all 0.3s ease",
        border: "1px solid #e5e7eb",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* ANTI-PATRÓN: Imagen sin lazy loading, sin alt, sin sizes, jpg pesado */}
      <img
        src={product.image_url}
        style={{ width: "320px", height: "240px", objectFit: "cover" }}
      />

      <div style={{ padding: "16px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>
          {product.name}
        </h3>

        <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "4px" }}>
          {product.category}
        </p>

        {/* ANTI-PATRÓN: Precio tachado + descuento falso */}
        <div style={{ marginBottom: "8px" }}>
          <span style={{ textDecoration: "line-through", color: "#9ca3af", fontSize: "14px" }}>
            ${originalPrice}
          </span>
          <span style={{ color: "#ef4444", fontSize: "22px", fontWeight: "bold", marginLeft: "8px" }}>
            ${product.price.toFixed(2)}
          </span>
          <span style={{ color: "#22c55e", fontSize: "12px", marginLeft: "6px" }}>
            -{(discount * 100).toFixed(0)}%
          </span>
        </div>

        {/* ANTI-PATRÓN: Rating con estrellitas generadas con un loop */}
        <div style={{ marginBottom: "8px" }}>
          {(() => {
            const stars = [];
            for (let i = 0; i < 5; i++) {
              stars.push(
                <span key={i} style={{ color: i < Math.round(product.rating) ? "#f59e0b" : "#d1d5db", fontSize: "18px" }}>
                  ★
                </span>
              );
            }
            return stars;
          })()}
          <span style={{ fontSize: "12px", color: "#6b7280", marginLeft: "6px" }}>
            ({product.reviews?.length || 0} reseñas)
          </span>
        </div>

        {/* ANTI-PATRÓN: Mostrar demasiada información en la tarjeta */}
        <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>
          <p>Stock: {product.stock} unidades</p>
          <p>Peso: {product.metadata?.weight_kg} kg</p>
          <p>Dimensiones: {product.metadata?.dimensions_cm?.width} x {product.metadata?.dimensions_cm?.height} x {product.metadata?.dimensions_cm?.depth} cm</p>
          <p>Color: {product.metadata?.color}</p>
          <p>Material: {product.metadata?.material}</p>
        </div>

        {/* ANTI-PATRÓN: Tags como <span> sin key estable, renderizando todo */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "12px" }}>
          {product.tags?.slice(0, 8).map((tag, idx) => (
            <span
              key={idx}
              style={{
                background: "#f3f4f6",
                padding: "2px 8px",
                borderRadius: "9999px",
                fontSize: "11px",
                color: "#374151",
              }}
            >
              #{tag}
            </span>
          ))}
          {product.tags?.length > 8 && (
            <span style={{ fontSize: "11px", color: "#9ca3af" }}>
              +{product.tags.length - 8} más
            </span>
          )}
        </div>

        {/* ANTI-PATRÓN: Botón que hace un fetch extra cada vez */}
        <button
          onClick={() => {
            fetch(`http://localhost:8000/api/products/${product.id}/details`)
              .then((r) => r.json())
              .then((data) => alert(`Producto: ${data.product.name}\nRelacionados: ${data.related_products.length}`))
              .catch(() => {});
          }}
          style={{
            width: "100%",
            padding: "12px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
}