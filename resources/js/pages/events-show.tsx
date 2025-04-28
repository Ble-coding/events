import { Head, usePage, Link } from '@inertiajs/react';
import { Calendar, Film } from 'lucide-react';
import AppMenuTemplate from '@/layouts/app/app-menu-layout';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface EventType {
  id: number;
  title: string;
  date: string;
  category_id: number;
  location: string;
  url: string;
  type: 'image' | 'video';
  description: string;
  schedule?: string[];
  highlights?: string[];
  isActive: boolean;
  category?: { id: number; name: string }; // ? pour éviter erreur si jamais absent
}

interface PageProps {
  event: EventType;
  [key: string]: unknown;
}

export default function EventDetails() {
  const { event } = usePage<PageProps>().props;
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => setIsLoaded(true);
  const handleImageError = () => {
    setIsLoaded(true);
    setHasError(true);
  };

  const isEventCurrentlyActive = (event: EventType) => {
    const today = new Date();
    const eventDate = new Date(event.date);
    return event.isActive && eventDate >= today;
  };

  return (
    <AppMenuTemplate>
      <Head title={event.title} />

      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Image ou Vidéo */}
            <div className="rounded-xl overflow-hidden h-[400px]">
              {event.type === 'image' ? (
                <img
                  src={event.url}
                  alt={event.title}
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
                    src={event.url}
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
            </div>

            {/* Détails de l'événement */}
            <div className="space-y-6">
              <h1 className="text-4xl font-bold">{event.title}</h1>

              {/* Badge Actif/Inactif */}
              {isEventCurrentlyActive(event) ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Actif
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Inactif
                </span>
              )}

              {/* Infos : Date - Lieu - Catégorie */}
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300 mt-4">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  {event.date}
                </span>
                <span>{event.location}</span>
                {event.category && (
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    {event.category.name}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 text-lg">{event.description}</p>

              {/* Bouton Réserver (si actif uniquement) */}
              {isEventCurrentlyActive(event) && (
                <Button asChild variant="outline" className="bg-orange-gk text-white mt-4">
                  <Link href="/contact">
                    <Calendar className="mr-2 h-4 w-4" />
                    Réserver ma place
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Programme et Points forts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">

            {/* Programme */}
            {event.schedule && event.schedule.length > 0 && (
              <div className="bg-white dark:bg-guilo-black/60 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6">Programme</h2>
                <ul className="space-y-4">
                  {event.schedule.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
                      <span className="h-2 w-2 rounded-full bg-guilo-orange"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Points forts */}
            {event.highlights && event.highlights.length > 0 && (
              <div className="bg-white dark:bg-guilo-black/60 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6">Points forts</h2>
                <ul className="space-y-4">
                  {event.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
                      <span className="h-2 w-2 rounded-full bg-guilo-orange"></span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>
      </div>
    </AppMenuTemplate>
  );
}
