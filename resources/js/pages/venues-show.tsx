import { useState } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import { Calendar, Building } from 'lucide-react';
import AppMenuTemplate from '@/layouts/app/app-menu-layout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VenueType {
  id: number;
  name: string;
  location: string;
  capacity: number;
  url: string;
  type: 'image' | 'video';
  description: string;
  features?: string[];
  availables?: string[];
  is_active: boolean;
}

interface PageProps {
  venue: VenueType;
  [key: string]: unknown;
}

export default function VenueDetails() {
  const { venue } = usePage<PageProps>().props;
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => setIsLoaded(true);
  const handleImageError = () => {
    setIsLoaded(true);
    setHasError(true);
  };

  return (
    <AppMenuTemplate>
      <Head title={venue.name} />

      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Image ou Vidéo */}
            <div className="rounded-xl overflow-hidden h-[400px]">
              {venue.type === 'image' ? (
                <img
                  src={venue.url}
                  alt={venue.name}
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
                    src={venue.url}
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
                </div>
              )}
            </div>

            {/* Détails de la salle */}
            <div className="space-y-6">
              <h1 className="text-4xl font-bold">{venue.name}</h1>

              {/* Badge Disponible / Indisponible */}
              {venue.is_active ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Disponible
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Indisponible
                </span>
              )}

              {/* Infos principales */}
              <div className="flex flex-wrap items-center gap-4 paragraph mt-4">
                <span className="inline-flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  {venue.capacity} personnes
                </span>
                <span>{venue.location}</span>
              </div>

              {/* Description */}
              <p className="paragraph text-lg">{venue.description}</p>

              {/* Bouton Réserver (si disponible) */}
              {venue.is_active && (
                <Button asChild variant="outline" className="bg-orange-gk text-white mt-4">
                  <Link href="/contact">
                    <Calendar className="mr-2 h-4 w-4" />
                    Réserver cette salle
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Caractéristiques & Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">

            {/* Caractéristiques */}
            {venue.features && venue.features.length > 0 && (
              <div className="bg-white dark:bg-accent/10 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6">Caractéristiques</h2>
                <ul className="space-y-4">
                  {venue.features.map((feature, index) => (
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
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Services Disponibles */}
            {venue.availables && venue.availables.length > 0 && (
              <div className="bg-white dark:bg-accent/10 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-6">Services Disponibles</h2>
                <ul className="space-y-4">
                  {venue.availables.map((service, index) => (
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
                      {service}
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
