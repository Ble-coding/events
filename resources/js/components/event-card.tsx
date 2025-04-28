import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

import { useState } from 'react';
import { Film } from 'lucide-react';
import { cn } from '@/lib/utils';


interface EventCardProps {
  id: number;
  title: string;
  date: string;
  location: string;
  url: string;
  type: 'image' | 'video';
  description: string;
  schedule?: string[];
  highlights?: string[];
  isActive: boolean;
}

const EventCard = ({
  id,
  title,
  date,
  location,
  url,
  type,
  description,
  schedule = [],
  highlights = [],
  isActive
}: EventCardProps) => {

    const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => setIsLoaded(true);
  const handleImageError = () => {
    setIsLoaded(true); // permet de terminer l'animation même si erreur
    setHasError(true);
  };

  return (
    <div className="bg-white dark:bg-guilo-black/60 rounded-xl overflow-hidden shadow-lg card-hover">
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
            onLoadedData={() => setIsLoaded(true)}
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

        {/* Date affichée sur l'image */}
        <div className="absolute top-4 left-4 bg-white dark:bg-guilo-black text-guilo-black dark:text-white rounded-lg px-3 py-1.5 text-sm font-medium flex items-center">
          <Calendar className="h-4 w-4 mr-1 text-primary" />
          <span>{date}</span>
        </div>
        {/* Badge Actif/Inactif */}
        <div className="absolute top-4 right-4">
          {isActive ? (
            <div className="flex items-center gap-1 text-green-600 bg-white dark:bg-guilo-black rounded-full px-2 py-1 text-xs">
              <CheckCircle className="h-4 w-4" /> Actif
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600 bg-white dark:bg-guilo-black rounded-full px-2 py-1 text-xs">
              <XCircle className="h-4 w-4" /> Inactif
            </div>
          )}
        </div>
      </div>

      {/* Informations principales */}
      <div className="p-5 space-y-2">
        <h3 className="font-bold text-xl">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{location}</p>
        <p className="text-gray-600 dark:text-gray-300 line-clamp-2">{description}</p>

        {/* Programme (schedule) */}
        {schedule.length > 0 && (
          <div className="pt-2">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Programme :</h4>
            <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-1">
              {schedule.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Points forts (highlights) */}
        {highlights.length > 0 && (
          <div className="pt-2">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Points forts :</h4>
            <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-1">
              {highlights.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Lien Voir plus */}



        <div className="pt-4">
          <Link
            href={`/events/${id}`}
            className="button-orange font-medium flex items-center text-sm"
          >
            En savoir plus
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
