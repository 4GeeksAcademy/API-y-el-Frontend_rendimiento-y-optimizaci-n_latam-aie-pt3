import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const products = Array.from({ length: 26 }, (_, index) => ({
  id: index,
  name: `Producto ${index + 1} de prueba`,
  category: index % 2 ? "Hogar" : "Electrónicos",
  price: 100 + index,
  stock: index % 3 ? 50 : 0,
  rating: 4.5,
  image_url: "/missing-test-image.jpg",
  reviews: [],
  metadata: { color: "Negro", material: "Metal" },
}));

const stats = { total_products: 10000, total_inventory_value: 125000000000, average_price: 5000, total_stock: 25000000 };

async function mockApi(page: Page) {
  await page.route("**/api/products", (route) => route.fulfill({ json: products }));
  await page.route("**/api/stats", (route) => route.fulfill({ json: stats }));
  await page.route("**/missing-test-image.jpg", (route) => route.fulfill({ status: 404, body: "" }));
}

async function expectAccessible(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

test("catálogo: paginación, filtros, orden y diálogo accesible", async ({ page }) => {
  await mockApi(page);
  await page.goto("/");
  await expect(page.getByRole("article")).toHaveCount(12);
  const card = page.getByRole("article").first();
  await expect(card.getByRole("img", { name: "Imagen ilustrativa del catálogo" })).toHaveJSProperty("naturalWidth", 640);
  expect(await card.evaluate((element) => element.getBoundingClientRect().height)).toBe(412);
  await expectAccessible(page);

  await page.getByRole("button", { name: "Siguiente" }).click();
  await expect(page.getByRole("heading", { name: "Catálogo", exact: true })).toBeFocused();
  await expect(page.getByRole("heading", { name: "Producto 13 de prueba", exact: true })).toBeVisible();
  await page.getByLabel("Buscar productos", { exact: true }).fill("Producto 26");
  await expect(page.getByRole("article")).toHaveCount(1);
  await page.getByRole("button", { name: "Ver detalles de Producto 26 de prueba" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("button", { name: "Cerrar detalles" })).toBeFocused();
  await expectAccessible(page);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Ver detalles de Producto 26 de prueba" })).toBeFocused();

  await page.getByRole("button", { name: "Limpiar filtros" }).click();
  await page.getByLabel("Categoría", { exact: true }).selectOption("Hogar");
  await page.getByLabel("Solo con stock").check();
  await page.getByLabel("Ordenar por").selectOption("price-desc");
  await expect(page.getByRole("article")).toHaveCount(9);
  await expect(page.getByRole("article").first()).toContainText("Producto 26 de prueba");
  await page.getByLabel("Buscar productos", { exact: true }).fill("sin coincidencias");
  await expect(page.getByText("No hay productos que coincidan con los filtros seleccionados.")).toBeVisible();
});

test("navegación diferida, caché y estadísticas reales", async ({ page }) => {
  await mockApi(page);
  let productRequests = 0;
  page.on("request", (request) => { if (request.url().endsWith("/api/products")) productRequests += 1; });
  await page.goto("/");
  await expect(page.getByRole("article")).toHaveCount(12);
  const initialRequests = productRequests;
  await page.getByRole("link", { name: "Estadísticas", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Estadísticas", exact: true })).toBeVisible();
  await expect(page.getByRole("table")).toBeVisible();
  await expect(page).toHaveTitle("Inventario | Estadísticas");
  await expectAccessible(page);
  await page.getByRole("link", { name: "Productos", exact: true }).click();
  await expect(page.getByRole("article")).toHaveCount(12);
  expect(productRequests).toBe(initialRequests);
  await page.goBack();
  await expect(page.getByRole("table")).toBeVisible();
});

test("errores de API y reintento", async ({ page }) => {
  let failed = true;
  await page.route("**/api/products", (route) => failed ? route.fulfill({ status: 503, body: "" }) : route.fulfill({ json: [] }));
  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText("No pudimos cargar los productos");
  await expectAccessible(page);
  failed = false;
  await page.getByRole("button", { name: "Reintentar" }).click();
  await expect(page.getByRole("status").filter({ hasText: "0 productos" })).toBeVisible();
});

test("móvil: dimensiones, foco, movimiento reducido y accesibilidad", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await mockApi(page);
  await page.goto("/");
  await expect(page.getByRole("article")).toHaveCount(12);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Saltar al contenido" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await expectAccessible(page);
  await page.screenshot({ path: "test-results/products-mobile.png", fullPage: true });
  await page.getByRole("link", { name: "Estadísticas", exact: true }).click();
  await expect(page.getByRole("table")).toBeVisible();
  await expectAccessible(page);
  await page.screenshot({ path: "test-results/stats-mobile.png", fullPage: true });
});