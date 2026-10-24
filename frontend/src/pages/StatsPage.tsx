import { Banknote, Boxes, CircleDollarSign, Package } from "lucide-react";
import MetricCard from "../components/MetricCard";
import Spinner from "../components/Spinner";
import Feedback from "../components/Feedback";
import { loadStats, moneyFormat, numberFormat, useResource } from "../api";

export default function StatsPage() {
  const { data: stats, loading, error, retry } = useResource("stats", loadStats);

  return (
    <>
      <div className="mb-8"><p className="mb-2 text-xs font-semibold uppercase text-brand-700">Gestión de inventario</p><h1 className="text-3xl font-bold">Estadísticas</h1><p className="mt-2 text-sm text-gray-600">Resumen del inventario</p></div>
      {loading ? <Spinner label="Cargando estadísticas" /> : error || !stats ? <Feedback message="No pudimos cargar las estadísticas. Comprueba tu conexión y vuelve a intentarlo." onRetry={retry} /> : (
        <>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total de productos" value={numberFormat.format(stats.total_products)} icon={Package} />
            <MetricCard label="Valor del inventario" value={moneyFormat.format(stats.total_inventory_value)} icon={Banknote} accent />
            <MetricCard label="Precio promedio" value={moneyFormat.format(stats.average_price)} icon={CircleDollarSign} />
            <MetricCard label="Unidades en stock" value={numberFormat.format(stats.total_stock)} icon={Boxes} />
          </dl>
          <section aria-labelledby="inventory-detail" className="mt-10 border-t border-gray-200 pt-7">
            <h2 id="inventory-detail" className="section-heading mb-5">Detalle del inventario</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <caption className="sr-only">Métricas agregadas del inventario actual</caption>
                <thead className="border-b border-gray-300 bg-gray-100 text-gray-600"><tr><th scope="col" className="p-4 font-medium">Indicador</th><th scope="col" className="p-4 text-right font-medium">Valor</th></tr></thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    ["Referencias de producto", numberFormat.format(stats.total_products)],
                    ["Unidades disponibles", numberFormat.format(stats.total_stock)],
                    ["Unidades por producto (promedio)", numberFormat.format(stats.total_products ? Math.round(stats.total_stock / stats.total_products) : 0)],
                    ["Valor total (USD)", moneyFormat.format(stats.total_inventory_value)],
                    ["Precio promedio (USD)", moneyFormat.format(stats.average_price)],
                  ].map(([label, value]) => <tr key={label}><th scope="row" className="p-4 font-medium">{label}</th><td className="p-4 text-right tabular-nums">{value}</td></tr>)}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
}