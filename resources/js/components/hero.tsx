import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface HeroProps {
  title: string;
  description: string;
  image?: string;
  actionLabel?: string;
  actionLink?: string;
  className?: string;
}

export default function Hero({
  title,
  description,
    //   image = 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=2070',
    image = '/images/slide.avif',
  actionLabel = 'Découvrir nos services',
  actionLink = '/services',
  className,
}: HeroProps) {
  return (
    <div
      className={cn(
        "relative min-h-[90vh] flex items-center justify-center overflow-hidden",
        className
      )}
    >
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        <img
          src={image}
          alt="Background"
          className={cn("w-full h-full object-cover object-center", "animate-scale-in")}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      </div>

      {/* Contenu */}
      <div className={cn("container relative z-10 text-center px-4 py-20", "animate-fade-in")}>
        <div className="max-w-3xl mx-auto">
            <h1 className="text-white text-4xl md:text-6xl font-bold mb-6 leading-tight font-playfair">
                {title}
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              {description}
            </p>

            <Button
            asChild
            size="lg"
            className={cn(
                "rounded-full px-8 py-6 text-white font-medium",
                "bg-[#EA7A0B] hover:opacity-90"
            )}
            >
            <Link href={actionLink}>{actionLabel}</Link>
            </Button>

        </div>
      </div>
    </div>
  );
}
