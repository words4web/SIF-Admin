import { AlertCircle } from "lucide-react";
import { ErrorViewProps } from "@/types/common.types";

export function ErrorView({
  message,
  onRetry,
  className = "",
}: ErrorViewProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center bg-destructive/5 rounded-2xl border border-destructive/10 ${className}`}
      role="alert">
      <AlertCircle className="size-10 text-destructive mb-3" />
      <h3 className="font-semibold text-lg text-foreground">
        Something went wrong
      </h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 px-4 py-2 text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/95 rounded-xl transition-colors cursor-pointer">
          Try Again
        </button>
      )}
    </div>
  );
}
export default ErrorView;
