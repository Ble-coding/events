
import React, { useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { X, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GalleryItemProps {
  image: string;
  title: string;
  category: string;
  className?: string;
  type?: 'image' | 'video';
}

const GalleryItem = ({ image, title, category, className, type = 'image' }: GalleryItemProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoaded(true);
    setHasError(true);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={cn(
            "cursor-pointer group relative overflow-hidden rounded-lg",
            className
          )}
        >
          <AspectRatio ratio={4/3} className="bg-muted">
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="w-8 h-8 rounded-full border-2 border-accent/80 border-t-transparent animate-spin" />
              </div>
            )}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <p className="text-sm text-muted-foreground">Image indisponible</p>
              </div>
            )}
            {type === 'image' ? (
  <img
    src={image}
    alt={title}
    className={cn(
      "object-cover w-full h-full transition-all duration-500",
      isLoaded && !hasError ? "opacity-100" : "opacity-0",
      "group-hover:scale-105 transition-transform duration-700"
    )}
    onLoad={handleImageLoad}
    onError={handleImageError}
  />
            ) : (
            <div className="relative w-full h-full">
                <video
                src={image}
                className={cn(
                    "object-cover w-full h-full",
                    isLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoadedData={() => setIsLoaded(true)}
                onError={handleImageError}
                muted
                playsInline
                autoPlay // ✅ pour s’assurer qu’elle se lance (silencieusement)
                loop // ✅ optionnel mais souvent utile
                />
                {/* Retirer l’icône si elle gêne ou mettre un play clair */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Film className="w-10 h-10 text-white opacity-50" />
                </div>
            </div>
            )}
          </AspectRatio>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <span className="text-xs text-white/80 font-medium uppercase tracking-wider">
              {category}
            </span>
            <h3 className="text-white font-medium text-lg">{title}</h3>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent
        className="w-full max-w-[90vw] max-h-[90vh] p-0 border-none overflow-hidden"
        >
        <div className="relative w-full flex justify-center items-center">
            {type === 'image' ? (
            <img
                src={image}
                alt={title}
                className="w-full max-w-[80vw] max-h-[85vh] object-contain rounded-lg"
                onError={handleImageError}
            />
            ) : (
            <video
                src={image}
                controls
                autoPlay
                className="w-full max-w-[80vw] max-h-[85vh] object-contain rounded-lg"
                onError={handleImageError}
            />
            )}

            <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 rounded-full bg-black/40 hover:bg-black/60 text-white border-none"
            aria-label="Fermer"
            >
            <X className="h-5 w-5" />
            </Button>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
            <div className="text-xs font-medium uppercase tracking-wider text-white/80">
                {category}
            </div>
            <h3 className="text-xl font-medium mt-1">{title}</h3>
            </div>
        </div>
    </DialogContent>


    </Dialog>
  );
};

export default GalleryItem;
