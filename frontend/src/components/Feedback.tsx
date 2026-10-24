import { CircleAlert, RotateCcw } from "lucide-react";

export default function Feedback({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 px-4 text-center">
      <CircleAlert aria-hidden="true" width={28} height={28} className="text-gray-500" />
      <p role={onRetry ? "alert" : "status"} className="max-w-md text-sm text-gray-700">{message}</p>
      {onRetry && <button type="button" onClick={onRetry} className="control"><RotateCcw aria-hidden="true" size={16} />Reintentar</button>}
    </div>
  );
}