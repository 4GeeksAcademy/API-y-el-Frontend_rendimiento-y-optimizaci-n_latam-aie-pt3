import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { moneyFormat, numberFormat, type Product } from "../api";

export default function ProductDetails({ product, onClose }: { product: Product; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog ref={dialog} aria-labelledby="product-title" onClose={() => { if (!dialog.current?.open) onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-lg bg-white p-6 text-gray-900 shadow-xl backdrop:bg-black/40">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div><p className="mb-2 text-sm text-brand-700">Ficha de producto · #{product.id}</p><h2 id="product-title" className="text-xl font-semibold">{product.name}</h2></div>
        <button autoFocus type="button" onClick={onClose} aria-label="Cerrar detalles" title="Cerrar detalles" className="control h-11 w-11 shrink-0 px-0"><X aria-hidden="true" size={20} /></button>
      </div>
      <dl className="grid grid-cols-2 gap-x-5 gap-y-6 text-sm">
        {[
          ["Categoría", product.category], ["Precio (USD)", moneyFormat.format(product.price)],
          ["Stock", `${numberFormat.format(product.stock)} unidades`], ["Valoración", `${product.rating} de 5`],
          ["Color", product.color || "No disponible"], ["Material", product.material || "No disponible"],
        ].map(([label, value]) => <div key={label}><dt className="mb-1 text-gray-600">{label}</dt><dd className="font-semibold">{value}</dd></div>)}
      </dl>
    </dialog>
  );
}