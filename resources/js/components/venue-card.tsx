import React from 'react';
import { Link } from '@inertiajs/react';
import { Building, CheckCircle, XCircle } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
interface VenueCardProps {
  id: number;
  name: string;
  location: string;
  capacity: number;
  url: string;
  description: string;
  type: 'image' | 'video';
  features?: string[];
  availables?: string[]; // ✅ correction ici
  is_active: boolean;
}

const VenueCard = ({
  id,
  name,
  location,
  capacity,
  url,
  description,
  type,
  features = [],             // ✅ valeur par défaut tableau vide
  availables = [],   // ✅ correction + valeur par défaut
  is_active
}: VenueCardProps) => {
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white rounded-xl overflow-hidden shadow-lg card-hover h-full flex flex-col transition-all">
    <div className="relative h-48">
      {type === 'image' ? (
        <img
          src={url}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <video
          src={url}
          controls
          className="w-full h-full object-cover"
        />
      )}

      {/* Badge Disponibilité */}
      <div className="absolute top-4 right-4">
        {is_active ? (
          <div className="flex items-center gap-1 text-green-600 bg-white dark:bg-black dark:text-white rounded-full px-2 py-1 text-xs">
            <CheckCircle className="h-4 w-4" /> Disponible
          </div>
        ) : (
          <div className="flex items-center gap-1 text-red-600 bg-white dark:bg-black dark:text-white rounded-full px-2 py-1 text-xs">
            <XCircle className="h-4 w-4" /> Indisponible
          </div>
        )}
      </div>

      {/* Badge Capacité */}
      <div className="absolute top-4 left-4 bg-white dark:bg-black dark:text-white text-black rounded-lg px-3 py-1.5 text-sm font-medium flex items-center">
        <Building className="h-4 w-4 mr-1 text-primary" />
        <span>Capacité: {capacity} personnes</span>
      </div>
    </div>

    <div className="p-5 flex flex-col flex-grow">
      <h3 className="font-bold text-xl mb-2 text-black dark:text-white">{name}</h3>
      <p className="paragraph text-sm mb-3">{location}</p>
      <p className="paragraph mb-4 flex-grow line-clamp-3">{description}</p>

      {features.length > 0 && (
        <div className="pt-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Caractéristiques :</h4>
          <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-1">
            {features.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {availables.length > 0 && (
        <div className="pt-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Services disponibles :</h4>
          <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 space-y-1">
            {availables.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-4">
        <Link
          href={`/venues/${id}`}
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

export default VenueCard;
