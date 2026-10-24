import { LoaderCircle } from "lucide-react";

export default function Spinner({ label = "Cargando contenido" }: { label?: string }) {
  return (
    <div role="status" className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-gray-600">
      <LoaderCircle aria-hidden="true" width={28} height={28} className="animate-spin text-brand-600 motion-reduce:animate-none" />
      <span className="text-sm">{label}</span>
    </div>
  );
}