import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer relative overflow-hidden rounded-md bg-secondary/80 ${className}`}
      {...props}
    />
  );
}

export default Skeleton;
