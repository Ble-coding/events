import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  features?: string[]; // ✅ Tu avais déjà ça, parfait !
}

const ServiceCard = ({ title, description, icon, className, features }: ServiceCardProps) => {
    return (
        <Card
          className={cn(
            "overflow-hidden border dark:border-none border-border/40 bg-card/70  dark:bg-white backdrop-blur-sm hover:shadow-md transition-all duration-300 group h-full",
            className
          )}
        >
          <CardHeader className="pb-3">
            {icon && (
              <div className="mb-3 w-12 h-12 flex items-center justify-center rounded-md transition-colors duration-300 bg-accent/10 group-hover:bg-accent/20
              dark:group-hover:bg-accent/20
              text-accent dark:bg-accent/10 dark:text-accent">
                {icon}
              </div>
            )}
            <Badge
              variant="outline"
              className="w-fit mb-2 border border-border text-primary dark:text-primary dark:border"
            >
              Service
            </Badge>

            <CardTitle className="text-xl md:text-2xl font-playfair text-black dark:text-black">
              {title}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <CardDescription className="text-base mb-4 text-gray-600 dark:text-gray-600">
              {description}
            </CardDescription>

            {features && features.length > 0 && (
              <ul className="space-y-1 text-sm text-muted-foreground dark:text-white">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-guilo-orange dark:text-white mr-2 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      );

};

export default ServiceCard;
