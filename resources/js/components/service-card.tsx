
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

const ServiceCard = ({ title, description, icon, className }: ServiceCardProps) => {
  return (
    <Card
      className={cn(
        "overflow-hidden border border-border/40 bg-card/70 backdrop-blur-sm hover:shadow-md transition-all duration-300 group h-full",
        className
      )}
    >
      <CardHeader className="pb-3">
        {icon && (
          <div className="mb-3 text-accent w-12 h-12 flex items-center justify-center rounded-md bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
            {icon}
          </div>
        )}
        <Badge variant="outline" className="w-fit mb-2">Service</Badge>
        {/* <Badge variant="outline" className="w-fit mb-2 badge-outline">Service</Badge> */}

        <CardTitle className="text-xl md:text-2xl text-card-title font-playfair">{title}</CardTitle>
      </CardHeader>
      <CardContent>
      <CardDescription className="text-muted-foreground text-base">
        {description}
        </CardDescription>

      </CardContent>
    </Card>
  );
};

export default ServiceCard;
