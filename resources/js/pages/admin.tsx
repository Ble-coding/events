import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import SectionHeading from '@/components/section-heading';
import GalleryItem from '@/components/gallery-item';
import AppMenuTemplate from '@/layouts/app/app-menu-layout';
import { Head } from '@inertiajs/react';

const galleryItems = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=2070',
    title: 'Mariage en plein air',
    category: 'Mariage',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=2073',
    title: 'Baby shower pastel',
    category: 'Événement privé',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=80&w=2070',
    title: 'Baptême élégant',
    category: 'Cérémonie',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2069',
    title: 'Décoration de table',
    category: 'Mariage',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1470162656305-6f429ba817bf?auto=format&fit=crop&q=80&w=2070',
    title: 'Coffret gourmand',
    category: 'Coffret cadeau',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1519741347686-c1e331c5ffee?auto=format&fit=crop&q=80&w=2070',
    title: 'Accompagnement bébé',
    category: 'Événement privé',
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&q=80&w=2071',
    title: 'Dîner romantique',
    category: 'Événement privé',
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&q=80&w=2070',
    title: 'Cérémonie rustique',
    category: 'Cérémonie',
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1613277367862-9de617e2be9f?auto=format&fit=crop&q=80&w=2070',
    title: 'Coffret self-care',
    category: 'Coffret cadeau',
  },
];

export default function Admin() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const categories = ['all', ...new Set(galleryItems.map(item => item.category))];

  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = filter === 'all' || item.category === filter;
    const matchesSearch = !searchTerm ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    if (inView) {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el, i) => {
        setTimeout(() => {
          el.classList.remove('opacity-0', 'translate-y-4');
          el.classList.add('opacity-100', 'translate-y-0');
        }, i * 100);
      });
    }
  }, [inView]);

  return (
    <AppMenuTemplate>
      <Head title="Galerie" />
      <div className="container py-12 md:py-20">
        <SectionHeading
          title="Notre Galerie"
          subtitle="Découvrez nos créations et réalisations"
          centered
        />

        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                filter === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {category === 'all' ? 'Tous' : category}
            </button>
          ))}
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 ease-out"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <GalleryItem
                image={item.image}
                title={item.title}
                category={item.category}
                className="h-full"
              />
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Aucun élément trouvé pour les critères sélectionnés.</p>
            <button
              onClick={() => {
                setFilter('all');
                setSearchTerm('');
              }}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </AppMenuTemplate>
  );
}
