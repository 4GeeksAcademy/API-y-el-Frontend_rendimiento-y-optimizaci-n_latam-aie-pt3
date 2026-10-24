import { memo } from "react";
import { ArrowUpRight, ImageOff, Star } from "lucide-react";
import { moneyFormat, numberFormat, type Product } from "../api";
import referenceImage from "../assets/catalog-reference.jpg";

function getImageSource(source: string) {
  if (!source) return referenceImage;
  try {
    const url = new URL(source, window.location.href);
    return url.hostname === "placedog.net" ? referenceImage : url.href;
  } catch {
    return referenceImage;
  }
}

function ProductCard({ product, onSelect, priority = false }: { product: Product; onSelect: (product: Product) => void; priority?: boolean }) {
  const imageSource = getImageSource(product.image_url);
  return (
    <article aria-labelledby={`product-${product.id}`} className="flex h-[412px] w-full min-w-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
      <div className="relative h-[184px] w-full shrink-0 bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-gray-600"><ImageOff aria-hidden="true" size={20} /><span>Sin imagen</span></div>
        <img src={imageSource} alt={imageSource === referenceImage ? "Imagen ilustrativa del catálogo" : `Imagen de referencia de ${product.name}`} width={640} height={368}
          loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" referrerPolicy="no-referrer"
          onError={(event) => {
            const image = event.currentTarget;
            if (image.getAttribute("src") === referenceImage) {
              image.hidden = true;
              return;
            }
            image.src = referenceImage;
            image.alt = "Imagen ilustrativa del catálogo";
          }}
          className="relative h-[184px] w-full object-cover" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-2 text-xs">
          <p className="truncate font-medium text-brand-700">{product.category}</p>
          <span className="flex shrink-0 items-center gap-1 text-gray-700" aria-label={`${product.rating} de 5, ${product.reviewCount} reseñas`}>
            <Star aria-hidden="true" size={13} className="fill-amber-400 text-amber-700" />{product.rating.toFixed(1)}
          </span>
        </div>
        <h2 id={`product-${product.id}`} className="line-clamp-2 h-12 text-base font-semibold leading-6" title={product.name}>{product.name}</h2>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
          <p className="text-xl font-semibold tabular-nums">{moneyFormat.format(product.price)}</p>
          <p className={`text-xs ${product.stock > 0 ? "text-gray-600" : "font-semibold text-red-700"}`}>
            {product.stock > 0 ? `${numberFormat.format(product.stock)} en stock` : "Agotado"}
          </p>
        </div>
        <button type="button" onClick={() => onSelect(product)} aria-label={`Ver detalles de ${product.name}`} aria-haspopup="dialog" className="control mt-auto w-full justify-between">
          Ver detalles<ArrowUpRight aria-hidden="true" width={17} height={17} />
        </button>
      </div>
    </article>
  );
}

export default memo(ProductCard);