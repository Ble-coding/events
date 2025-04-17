import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

const SectionHeading = ({
  title,
  subtitle,
  description,
  centered = false,
  className,
}: SectionHeadingProps) => {
  return (
    <div
      className={cn(
        "mb-12 max-w-3xl",
        centered && "mx-auto text-center",
        className
      )}
    >
      {subtitle && (
        <div className="inline-block px-4 py-1 bg-banner">
          <p className="text-accent font-medium text-sm uppercase tracking-wider">
            {subtitle}
          </p>
          <div className="bar-bottom" />
        </div>
      )}
      <h2 className="text-primary text-3xl md:text-4xl font-playfair mb-4 mt-4">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-lg">{description}</p>
      )}
    </div>
  );
};

export default SectionHeading;
