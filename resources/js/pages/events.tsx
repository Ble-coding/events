import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Head, usePage, router } from '@inertiajs/react';
import EventCard from '@/components/event-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppMenuTemplate from '@/layouts/app/app-menu-layout';
import { Button } from '@/components/ui/button';
// import SectionHeading from '@/components/section-heading';
import CallToActionWithButton from '@/components/call-to-action';
interface Event {
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

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}


interface PageProps {
  events: {
    data: Event[];
    links: PaginationLink[];
  };
//   contact: ContactInfo | null;
//   servicesFooter: any;
  [key: string]: unknown;
}



export default function Events() {
  const { events } = usePage<PageProps>().props;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedDate, setSelectedDate] = useState('');

  const isEventCurrentlyActive = (event: Event) => {
    const eventDate = new Date(event.date);
    const today = new Date();

    // Si la date de l'événement est dans le futur ET que l'événement est actif
    return event.isActive && eventDate >= today;
  };


  const filteredEvents = events.data
  .filter(event => {
    if (statusFilter === 'active') return isEventCurrentlyActive(event);
    if (statusFilter === 'inactive') return !isEventCurrentlyActive(event);
    return true;
  })
    .filter(event => {
      if (!search) return true;
      return (
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase())
      );
    })
    .filter(event => {
        if (!selectedDate) return true;
        return event.date.startsWith(selectedDate);
      })

  const handlePageChange = (url: string | null) => {
    if (url) router.visit(url, { preserveScroll: true });
  };



  return (

        <AppMenuTemplate>
          <Head title="Événements" />

            {/* Hero Section */}
      <section className="py-20 md:py-28 text-white">
        <div className="bg-orange-gk container mt-3 p-6">
          <div className="max-w-2xl animate-slide-in">
            <h1 className="text-playfair text-[60px] leading-tight mb-6">Calendrier d'Événements</h1>
            <p className="text-white/90 text-[20px] mb-8">
            Découvrez nos événements à venir et restez informé de nos actualités.
            </p>
          </div>
        </div>
      </section>


           <section  className="py-20 bg-white  dark:bg-accent/10">
        <div className="container">
          {/* Barre de filtres */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Recherche par titre ou lieu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-1/3"
            />
<Input
  type="month"
  value={selectedDate}
  onChange={(e) => setSelectedDate(e.target.value)}
  className="w-full md:w-1/4"
/>

            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as 'all' | 'active' | 'inactive')}
            >
              <SelectTrigger className="w-full md:w-1/4">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="inactive">Inactifs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Résultat des événements */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  url={event.url}
                  type={event.type}
                  description={event.description}
                //   highlights={event.highlights}
                //   schedule={event.schedule}
                //   isActive={event.isActive}
                  isActive={isEventCurrentlyActive(event)}
                />
              ))
            ) : (
              <div className="text-center col-span-full py-12">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">Aucun événement trouvé</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Essayez d'ajuster votre recherche ou vos filtres.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-12">
            {events.links.map((link, idx) => (
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


    {/* Call to Action */}
    <CallToActionWithButton
        title="Besoin de plus d'inspirations ?"
        description="Explorez notre collection complète d'articles pour enrichir votre projet."
        buttonText="Voir tous les articles"
        buttonLink="/blogs"
        bgColorClass="bg-dark-gk"
        textColorClass="text-white"
        buttonVariant="outline"
      />
        </AppMenuTemplate>


  );
}
