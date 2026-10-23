// ANTI-PATRÓN: Importación de React sin tree-shaking
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

// ANTI-PATRÓN: Sin StrictMode
const root = ReactDOM.createRoot(document.getElementById("app"));

// ANTI-PATRÓN: Render directo sin Suspense, sin ErrorBoundary, sin lazy
root.render(<App />);

// ANTI-PATRÓN: Sin Service Worker, sin PWA manifest, sin nada