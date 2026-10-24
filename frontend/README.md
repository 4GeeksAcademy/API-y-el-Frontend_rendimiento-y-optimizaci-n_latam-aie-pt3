# Frontend de inventario

## Ejecutar

```sh
npm install
npm run dev
```

La API se busca en el mismo host del navegador, puerto 8000. Para otros
entornos, define `VITE_API_URL=https://tu-api.example` en `.env.local` y reinicia
Vite. En Codespaces, configura la URL HTTPS reenviada del puerto 8000 si el
frontend se abre mediante una URL reenviada.

## Vistas y componentes

- Productos: búsqueda diferida, categoría, stock, orden y páginas de 12 tarjetas.
- Estadísticas: métricas reales del endpoint `/api/stats`, sin datos simulados.
- Navbar, Spinner, ProductCard, MetricCard, Feedback y ProductDetails son reutilizables.
- Las dos vistas y el diálogo usan `React.lazy` y `Suspense`; un límite de errores
  permite recuperar fallos de carga de módulos.
- ProductCard usa `React.memo` y recibe una función estable con `useCallback`.
  Los filtros y la ordenación del catálogo usan `useMemo` y `useDeferredValue`.
- Peticiones con comprobación HTTP, cancelación al desmontar, reintento y caché
  en memoria de 60 segundos. Se conservan solo los campos usados por la interfaz.

## Dimensiones

- ProductCard: ancho del track responsive de la cuadrícula, altura fija de 412 px.
- Imagen: atributos intrínsecos de 640 x 368; caja visible de ancho 100% y
  altura fija de 184 px, con `object-fit: cover`, carga diferida y alternativa
  si falla. Si la URL de la API está vacía o falla, se utiliza una fotografía
  local identificada como ilustrativa, sin atribuirla al producto real.
- MetricCard: ancho 100% del track y altura fija de 160 px.
- Diálogo: ancho `calc(100% - 2rem)`, máximo 512 px y altura máxima de 90dvh.
- Controles: altura mínima de 44 px; iconos e indicadores con dimensiones explícitas.

## Accesibilidad y validación

```sh
npm run typecheck
npm run build
npx playwright install --with-deps chromium
npm test
```

Playwright inicia Vite en el puerto 5174 (o reutiliza ese servidor en local).
Las pruebas usan una API simulada y cubren filtros, paginación, errores y
reintentos, historial, caché, foco y cierre del diálogo, escritorio y móvil.
axe revisa reglas WCAG 2 A/AA y 2.1 A/AA en los estados evaluados.

La interfaz incluye landmarks, enlace de salto, encabezados, etiquetas,
estados anunciados, foco visible y soporte para movimiento reducido. El diálogo
nativo mantiene el foco y admite Escape. Una auditoría automática no sustituye
la evaluación manual completa con lectores de pantalla.

## Limitación de la API actual

El backend devuelve todos los productos y sus imágenes de referencia originales.
El proveedor de imágenes actual puede devolver HTTP 403. El respaldo local
`src/assets/catalog-reference.jpg` procede de
[Unsplash](https://images.unsplash.com/photo-1498049794561-7780e7231661) y es solo ilustrativo.
La paginación local limita el DOM, pero no reduce el tamaño de la respuesta
inicial ni el de los archivos de imagen. Para optimizar la red hace falta
paginación, filtros y miniaturas reales en el backend, que no se modifica aquí.