# 🐌 Gestión de Productos — API + Frontend (versión inoptimizada)

> **⚠️ Propósito educativo**: Este proyecto ha sido creado **intencionalmente con malas prácticas de rendimiento y optimización**. Úsalo para aprender a identificar y corregir estos problemas ejecutando Lighthouse y otras herramientas de auditoría.

## 🏗️ Estructura del proyecto

```
/
├── backend/                  # API FastAPI (intencionalmente lenta)
│   ├── main.py              # Endpoints sin paginación, sin caché
│   └── requirements.txt     # Dependencias sin versionar
├── frontend/                 # React + TypeScript + Tailwind
│   ├── public/
│   │   └── robots.txt       # ⚠️ Mal configurado
│   ├── src/
│   │   ├── components/
│   │   │   └── ProductCard.tsx
│   │   ├── pages/
│   │   │   ├── ProductList.tsx
│   │   │   └── StatsPage.tsx
│   │   ├── styles/
│   │   │   └── global.css   # ⚠️ CSS enorme sin purgar
│   │   ├── App.tsx
│   │   ├── index.js
│   │   └── vite-env.d.ts
│   ├── index.html            # ⚠️ Sin metaetiquetas SEO
│   ├── vite.config.ts        # ⚠️ Build sin optimización
│   ├── tailwind.config.js    # ⚠️ Sin purge
│   ├── postcss.config.js     # ⚠️ Sin plugins
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── package.json
├── server.py                 # Servidor Flask legacy (no usado)
└── README.md
```

## 🚀 Cómo ejecutar

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
python main.py
# Servidor en: http://localhost:8000
# Documentación: http://localhost:8000/docs
```

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
# Servidor en: http://localhost:5173
```

## 🔍 Problemas de rendimiento incluidos

| #  | Problema | Ubicación |
|----|----------|-----------|
| 1  | Endpoint sin paginación (10 000 registros) | `backend/main.py` → `/api/products` |
| 2  | Sin cabeceras de caché | `backend/main.py` |
| 3  | Sin búsqueda por índice (O(n) lineal) | `backend/main.py` → `/api/products/search` |
| 4  | Simulación de N+1 queries | `backend/main.py` → `/api/products/{id}/details` |
| 5  | Cálculos pesados sin caché | `backend/main.py` → `/api/stats` |
| 6  | CORS abierto sin restricciones | `backend/main.py` |
| 7  | Build sin minificar, sin chunk splitting | `frontend/vite.config.ts` |
| 8  | Sin metaetiquetas SEO | `frontend/index.html` |
| 9  | Sin lazy loading de imágenes | `frontend/src/components/ProductCard.tsx` |
| 10 | Sin paginación en frontend | `frontend/src/pages/ProductList.tsx` |
| 11 | Sin React.memo / useMemo / useCallback | Todos los componentes |
| 12 | Sin virtualización (10 000 DOM nodes) | `frontend/src/pages/ProductList.tsx` |
| 13 | CSS global enorme sin purgar | `frontend/src/styles/global.css` |
| 14 | Animaciones continuas (GPU + CPU) | `frontend/src/styles/global.css` |
| 15 | Tailwind config sin purge | `frontend/tailwind.config.js` |
| 16 | PostCSS sin plugins | `frontend/postcss.config.js` |
| 17 | robots.txt mal configurado | `frontend/public/robots.txt` |
| 18 | Imágenes sin lazy loading, sin alt, sin sizes | Múltiples archivos |
| 19 | Google Fonts síncronas (bloquean render) | `frontend/index.html` |
| 20 | iframe oculto de página externa | `frontend/index.html` |
| 21 | Imágenes decorativas en fixed con opacidad baja | `frontend/index.html` |
| 22 | Sin ErrorBoundary, sin Suspense | `frontend/src/App.tsx` |
| 23 | Fetch sin AbortController | `frontend/src/pages/ProductList.tsx` |
| 24 | Filter en frontend (debía ser en backend) | `frontend/src/pages/ProductList.tsx` |

## 📊 Ejecuta Lighthouse

1. Abre la app en Chrome
2. Abre DevTools → Lighthouse
3. Ejecuta auditoría y observa la puntuación baja
4. ¡Intenta corregir todos los problemas de rendimiento!

This template was built as part of the [Full Stack Developer course](https://4geeksacademy.com/us/coding-bootcamps/part-time-full-stack-developer) at [4Geeks Academy Coding Bootcamp](https://4geeksacademy.com/us/coding-bootcamp) by [Alejandro Sanchez](https://twitter.com/alesanchezr) and [many other contributors](https://github.com/4GeeksAcademy/html-hello/graphs/contributors).

You can find other templates and resources like this at the [school's GitHub page](https://github.com/4geeksacademy/).
