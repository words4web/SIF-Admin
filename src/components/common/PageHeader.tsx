import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/Loader";

interface PageHeaderAction {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  id?: string;
  type?: "button" | "submit";
  form?: string;
  disabled?: boolean;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost";
  size?: "default" | "sm" | "lg";
  isLoading?: boolean;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  onBackClick?: () => void;
  showBack?: boolean;
  action?: PageHeaderAction;
}

export function PageHeader({
  title,
  subtitle,
  backHref,
  onBackClick,
  showBack,
  action,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between gap-4 py-4 mb-6 w-full bg-background/95 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {(backHref || onBackClick || showBack) && (
          <Button
            id="page-header-back-btn"
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="text-muted-foreground hover:bg-muted">
            <ArrowLeft className="size-5" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && (
        <div className="flex items-center gap-2 flex-shrink-0 pt-1">
          <Button
            id={action?.id}
            type={action?.type || "button"}
            form={action?.form}
            onClick={action?.onClick}
            disabled={action?.disabled || action?.isLoading}
            variant={action?.variant || "outline"}
            size={action?.size || "default"}>
            {action?.isLoading ? (
              <Loader size="sm" text="Saving..." className="animate-pulse" />
            ) : (
              <>
                {action?.icon}
                {action?.label}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default PageHeader;
