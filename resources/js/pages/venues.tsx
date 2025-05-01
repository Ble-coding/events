import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Head, usePage, router
    // , Link
} from '@inertiajs/react';
import VenueCard from '@/components/venue-card';
// import { ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppMenuTemplate from '@/layouts/app/app-menu-layout';
import { Button } from '@/components/ui/button';
import CallToActionWithButton from '@/components/call-to-action';

interface Venue {
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

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PageProps {
  venues: {
    data: Venue[];
    links: PaginationLink[];
  };
  [key: string]: unknown;
}

export default function Venues() {
  const { venues } = usePage<PageProps>().props;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [minCapacity, setMinCapacity] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');

  const filteredVenues = venues.data
    .filter(venue => {
      if (statusFilter === 'active') return venue.is_active;
      if (statusFilter === 'inactive') return !venue.is_active;
      return true;
    })
    .filter(venue => {
      if (!search) return true;
      return (
        venue.name.toLowerCase().includes(search.toLowerCase()) ||
        venue.location.toLowerCase().includes(search.toLowerCase())
      );
    })
    .filter(venue => {
      if (!minCapacity && !maxCapacity) return true;

      const min = minCapacity ? parseInt(minCapacity) : 0;
      const max = maxCapacity ? parseInt(maxCapacity) : Infinity;

      return venue.capacity >= min && venue.capacity <= max;
    });



  const handlePageChange = (url: string | null) => {
    if (url) router.visit(url, { preserveScroll: true });
  };

  return (
    <AppMenuTemplate>
      <Head title="Nos Salles" />

      {/* Hero Section */}
      <section className="py-20 md:py-28 text-white">
        <div className="bg-orange-gk container mt-3 p-6">
          <div className="max-w-2xl animate-slide-in">
            <h1 className="text-playfair text-[60px] leading-tight mb-6">Nos Espaces & Salles</h1>
            <p className="text-white/90 text-[20px] mb-8">
              Découvrez nos lieux uniques pour vos événements, réceptions et séminaires.
            </p>
          </div>
        </div>
      </section>

      {/* Section Salles */}
      <section className="py-20 bg-white dark:bg-accent/10">
        <div className="container">

          {/* Barre de Filtres */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Recherche par nom ou lieu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-1/3"
            />

            <Input
              type="number"
              placeholder="Capacité min"
              value={minCapacity}
              onChange={(e) => setMinCapacity(e.target.value)}
              className="w-full md:w-1/6"
            />

            <Input
              type="number"
              placeholder="Capacité max"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value)}
              className="w-full md:w-1/6"
            />

            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as 'all' | 'active' | 'inactive')}
            >
              <SelectTrigger className="w-full md:w-1/4">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="active">Disponibles</SelectItem>
                <SelectItem value="inactive">Indisponibles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Résultat des salles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVenues.length > 0 ? (
              filteredVenues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  id={venue.id}
                  name={venue.name}
                  location={venue.location}
                  capacity={venue.capacity}
                  url={venue.url}
                  type={venue.type}
                  description={venue.description}
                  is_active={venue.is_active}
                />
              ))
            ) : (
              <div className="text-center col-span-full py-12">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">Aucune salle trouvée</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Essayez d'ajuster votre recherche ou vos filtres.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-12">
            {venues.links.map((link, idx) => (
              <Button
                key={idx}
                variant={link.active ? 'default' : 'outline'}
                disabled={!link.url}
                dangerouslySetInnerHTML={{ __html: link.label }}
                onClick={() => handlePageChange(link.url)}
              />
            ))}
          </div>

        </div>
      </section>



      <CallToActionWithButton
        title="Besoin d'aide pour choisir le lieu idéal ?"
        description="Notre équipe d'experts vous accompagne dans la sélection de la salle parfaite pour votre événement."
        buttonText="Prendre rendez-vous"
        buttonLink="/contact"
        bgColorClass="bg-dark-gk"  // Utilisez la couleur de fond que vous souhaitez
        textColorClass="text-white"
        buttonVariant="outline"  // Vous pouvez changer le style du bouton ici
      />
    </AppMenuTemplate>
  );
}
