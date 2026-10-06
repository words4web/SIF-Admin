import { Loader2 } from "lucide-react";
import { LoaderProps } from "@/types/common.types";

export function Loader({ className = "", size = "md", text }: LoaderProps) {
  const sizeClasses = {
    sm: "size-4",
    md: "size-6",
    lg: "size-8",
  };

  return (
    <div
      className={`flex items-center justify-center gap-2 ${className}`}
      role="status">
      <Loader2 className={`animate-spin text-current ${sizeClasses[size]}`} />
      {text ? (
        <span className="text-sm font-semibold animate-pulse">{text}</span>
      ) : (
        <span className="sr-only">Loading...</span>
      )}
    </div>
  );
}
export default Loader;
