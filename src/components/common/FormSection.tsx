import { FormSectionProps } from "@/types/common.types";

export function FormSection({
  title,
  description,
  children,
  className = "",
}: FormSectionProps) {
  return (
    <section className={`space-y-5 ${className}`}>
      <div>
        <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export default FormSection;
