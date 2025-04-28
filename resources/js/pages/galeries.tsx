import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Head, usePage } from '@inertiajs/react';

// import SectionHeading from '@/components/section-heading';
import GalleryItem from '@/components/gallery-item';
import AppMenuTemplate from '@/layouts/app/app-menu-layout';

interface Gallery {
    id: number;
    title: string;
    url: string;
    type: 'image' | 'video';
    category: {
      id: number;
      name: string;
    };
  }


interface PageProps {
  galeries: Gallery[];
  [key: string]: unknown;
}

// Normalisation pour ignorer accents/casse
function normalizeString(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export default function GalleryPage() {
  const { galeries } = usePage<PageProps>().props;
  const [filter, setFilter] = useState('all');
  const { ref } = useInView({ threshold: 0.1, triggerOnce: false });

  const categoryMap = galeries.reduce((acc, g) => {
    if (g.category?.name) {
      const normalized = normalizeString(g.category.name);
      acc[normalized] = g.category.name;
    }
    return acc;
  }, {} as Record<string, string>);

  const categories = ['all', ...Object.keys(categoryMap)];

  const filteredItems = galeries.filter(item => {
    if (filter === 'all') return true;
    return normalizeString(item.category.name) === filter;
  });

  return (
    <AppMenuTemplate>
      <Head title="Galerie" />

        {/* Hero Section */}
        <section className="py-20 md:py-28 text-white">
        <div className="bg-orange-gk container mt-3 p-6">
          <div className="max-w-2xl animate-slide-in">
            <h1 className="text-playfair text-[60px] leading-tight mb-6">Notre Galerie</h1>
            <p className="text-white/90 text-[20px] mb-8">
            Découvrez nos créations et réalisations
            </p>
          </div>
        </div>
      </section>


      <div className="container py-12 md:py-20">


        {/* Filtres */}
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
              {category === 'all'
                ? 'Tous'
                : categoryMap[category]?.charAt(0).toUpperCase() + categoryMap[category]?.slice(1)}
            </button>
          ))}
        </div>

        {/* Galeries */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="animate-on-scroll transition-all duration-700 ease-out opacity-100 translate-y-0"
            >
             <GalleryItem
                type={item.type}
                image={item.url}
                title={item.title}
                category={item.category?.name}
                className="h-full"
                />

            </div>
          ))}
        </div>

        {/* Aucun résultat */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Aucun élément trouvé pour cette catégorie.</p>
            <button
              onClick={() => setFilter('all')}
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
