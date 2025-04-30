import { useState } from 'react';
import { Calendar, Film, ChevronRight } from "lucide-react";
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  id: number;
  title: string;
  excerpt: string;
  url: string;
  type: 'image' | 'video';
  date: string;
  categoryName?: string;
}

const BlogCard = ({
  id,
  title,
  excerpt,
  url,
  type,
  date,
  categoryName
}: BlogCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => setIsLoaded(true);
  const handleImageError = () => {
    setIsLoaded(true);
    setHasError(true);
  };

  return (
    <div className="bg-white dark:bg-black rounded-xl overflow-hidden shadow-lg card-hover">
      {/* Media (Image ou Vidéo) */}
      <div className="relative h-48">
        {type === 'image' ? (
          <img
            src={url}
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
              src={url}
              className={cn(
                "object-cover w-full h-full",
                isLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoadedData={handleImageLoad}
              onError={handleImageError}
              muted
              playsInline
              autoPlay
              loop
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Film className="w-10 h-10 text-white opacity-50" />
            </div>
          </div>
        )}

        {/* Badge Date */}
        <div className="absolute top-4 left-4 bg-white dark:bg-black text-black dark:text-white rounded-lg px-3 py-1.5 text-sm font-medium flex items-center">
          <Calendar className="h-4 w-4 mr-1 text-primary" />
          <span>{new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date))}</span>
        </div>
      </div>

      {/* Informations */}
      <div className="p-5 space-y-2 text-black dark:text-white">
        <h3 className="font-bold text-xl">{title}</h3>
        {categoryName && <p className="paragraph text-sm">{categoryName}</p>}
        <p className="paragraph line-clamp-3" dangerouslySetInnerHTML={{ __html: excerpt }}></p>

        {/* Bouton Voir plus */}
        <div className="pt-4">
          <Link
            href={`/blogs/${id}`}
            className="button-orange font-medium flex items-center text-sm"
          >
            Lire l'article
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );

};

export default BlogCard;
