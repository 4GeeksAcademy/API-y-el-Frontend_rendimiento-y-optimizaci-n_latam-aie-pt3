import type { LucideIcon } from "lucide-react";

export default function MetricCard({ label, value, icon: Icon, accent = false }: { label: string; value: string; icon: LucideIcon; accent?: boolean }) {
  return (
    <div className={`flex h-[160px] w-full min-w-0 flex-col justify-between rounded-lg border p-5 ${accent ? "border-brand-700 bg-brand-700 text-white" : "border-gray-200 bg-white"}`}>
      <dt className={`flex items-center justify-between gap-3 text-sm font-medium ${accent ? "text-white" : "text-gray-600"}`}>
        <span>{label}</span>
        <Icon aria-hidden="true" width={20} height={20} className="shrink-0" />
      </dt>
      <dd className={`${value.length > 16 ? "text-xl" : "text-2xl"} font-semibold tabular-nums`}>{value}</dd>
    </div>
  );
}