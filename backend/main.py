"""
API de Gestión de Productos — versión intencionalmente INOPTIMIZADA

Propósitos didácticos: esta API viola deliberadamente las mejores prácticas de
rendimiento para que puedas identificar y corregir los problemas.
"""

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import time
import random
import string

# ──────────────────────────────────────────────────────────────
#  ANTI-PATRÓN 1: CORS abierto sin restricciones
#  (permite cualquier origen, método y cabecera)
# ──────────────────────────────────────────────────────────────
app = FastAPI(
    title="Product API (Unoptimized)",
    description="API sin paginación, sin caché, sin compresión, sin límites.",
    version="0.0.1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────────────────────
#  ANTI-PATRÓN 2: Generación masiva de datos simulados
#  (sin base de datos, sin índices, datos en memoria que crecen)
# ──────────────────────────────────────────────────────────────
PRODUCT_COUNT = 10_000  # 10 mil productos — todo se devuelve de golpe

def generate_product(i: int) -> dict:
    """Genera un producto con campos hinchados y descripciones enormes."""
    return {
        "id": i,
        "name": f"Producto {i} - {''.join(random.choices(string.ascii_uppercase, k=12))}",
        "description": (
            "✨ LOREM IPSUM DOLOR SIT AMET.\n" * 50 +
            f"\n[INFO ADICIONAL — Producto #{i}]\n" +
            "CONSECTETUR ADIPISCING ELIT. SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE MAGNA ALIQUA.\n" * 30 +
            "— Este campo de texto es deliberadamente enorme para aumentar el payload."
        ),
        "price": round(random.uniform(1.00, 9999.99), 2),
        "category": random.choice([
            "Electrónicos", "Hogar", "Jardinería", "Juguetes", "Ropa",
            "Deportes", "Libros", "Música", "Cocina", "Mascotas",
        ]),
        "stock": random.randint(0, 5000),
        "rating": round(random.uniform(1.0, 5.0), 1),
        "image_url": f"https://placedog.net/1200/800/random?id={i}",
        "thumbnail_url": f"https://placedog.net/1200/800/random?id={i}",
        "tags": [f"etiqueta-{random.randint(1,200)}" for _ in range(30)],
        "metadata": {
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-12-31T23:59:59Z",
            "views": random.randint(0, 1_000_000),
            "sales": random.randint(0, 50_000),
            "weight_kg": round(random.uniform(0.1, 50.0), 2),
            "dimensions_cm": {
                "width": round(random.uniform(5, 200), 1),
                "height": round(random.uniform(5, 200), 1),
                "depth": round(random.uniform(1, 100), 1),
            },
            "color": random.choice(["Rojo", "Azul", "Verde", "Negro", "Blanco", "Gris"]),
            "material": random.choice(["Plástico", "Metal", "Madera", "Vidrio", "Textil"]),
        },
        "reviews": [
            {
                "user": f"usuario_{random.randint(1, 1000)}",
                "score": random.randint(1, 5),
                "comment": "Muy buen producto, totalmente recomendado.\n" * 10,
            }
            for _ in range(random.randint(5, 15))
        ],
    }

# Pre-generamos los productos al arrancar (consume mucha memoria)
PRODUCTS = [generate_product(i) for i in range(PRODUCT_COUNT)]


# ──────────────────────────────────────────────────────────────
#  ANTI-PATRÓN 3: Endpoint SIN paginación
#  Devuelve TODOS los registros de golpe → payload enorme.
#  Sin cabeceras de caché, sin compresión, sin streaming.
# ──────────────────────────────────────────────────────────────
@app.get("/api/products")
def get_all_products():
    """
    Devuelve todos los productos sin paginación.

    Errores:
      - Sin límite de resultados (10 000 registros de una sola vez)
      - Sin cabeceras Cache-Control / ETag / Last-Modified
      - Sin compresión a nivel de aplicación
      - Sin filtros ni búsqueda eficiente
    """
    time.sleep(0.5)  # Simula una consulta lenta a base de datos
    return PRODUCTS


# ──────────────────────────────────────────────────────────────
#  ANTI-PATRÓN 4: Endpoint de búsqueda ineficiente
#  Recorre toda la lista con expresiones regulares sin índice.
# ──────────────────────────────────────────────────────────────
@app.get("/api/products/search")
def search_products(q: str = Query("", min_length=0)):
    """
    Búsqueda textual ineficiente — recorre TODOS los productos
    usando búsqueda lineal con 'in' (O(n) sin índice).
    """
    import re

    results = []
    # Expresión regular costosa
    pattern = re.compile(re.escape(q), re.IGNORECASE)

    for p in PRODUCTS:
        if pattern.search(p["name"]) or pattern.search(p["description"]):
            results.append(p)

    return {"query": q, "total": len(results), "results": results}


# ──────────────────────────────────────────────────────────────
#  ANTI-PATRÓN 5: Endpoint que ejecuta N+1 consultas
#  Simula el clásico problema de N+1 en APIs.
# ──────────────────────────────────────────────────────────────
@app.get("/api/products/{product_id}/details")
def get_product_details(product_id: int):
    """
    Obtiene detalles de un producto con simulación de N+1 queries.
    """
    product = None
    for p in PRODUCTS:
        if p["id"] == product_id:
            product = p
            break

    if not product:
        return {"error": "Product not found"}

    # Simulamos queries adicionales ineficientes (N+1)
    time.sleep(0.1)
    related = [p for p in PRODUCTS[:50]]  # Cargar relacionados sin necesidad

    return {"product": product, "related_products": related}


# ──────────────────────────────────────────────────────────────
#  ANTI-PATRÓN 6: Endpoint que consume mucha CPU
#  Sin caché, calcula todo cada vez.
# ──────────────────────────────────────────────────────────────
@app.get("/api/stats")
def get_stats():
    """Calcula estadísticas recorriendo toda la lista cada vez."""
    total_value = sum(p["price"] * p["stock"] for p in PRODUCTS)
    avg_price = sum(p["price"] for p in PRODUCTS) / len(PRODUCTS)
    total_stock = sum(p["stock"] for p in PRODUCTS)
    return {
        "total_products": len(PRODUCTS),
        "total_inventory_value": total_value,
        "average_price": round(avg_price, 2),
        "total_stock": total_stock,
    }


# ──────────────────────────────────────────────────────────────
#  Punto de entrada — ejecuta con uvicorn sin optimizaciones
# ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        # Sin workers extra (un solo proceso)
        workers=1,
        # Sin timeout de keepalive agresivo
        timeout_keep_alive=0,
        # Sin logs de acceso (no se puede auditar rendimiento)
        access_log=False,
    )