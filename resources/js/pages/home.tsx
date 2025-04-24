import AppLayoutTemplate from '@/layouts/app/app-menu-layout';
import { type BreadcrumbItem } from '@/types';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

import { Button } from "@/components/ui/button";
import Hero from '@/components/hero';
import SectionHeading from '@/components/section-heading';
import GalleryItem from '@/components/gallery-item';
import ServiceCard from '@/components/service-card';


interface ServiceType {
  id: number;
  title: string;
  description: string;
}

interface GalleryItemType {
    id: number;
    title: string;
    url: string;
    type: 'image' | 'video'; // 👈 ajoute cette ligne
    category: {
      name: string;
    };
  }

interface HomePageProps {
    items: {
      data: GalleryItemType[];
    };
    services: {
      data: ServiceType[];
    };
    [key: string]: unknown; // 👈 ajoute ceci
  }


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Home() {
    const { items, services } = usePage<HomePageProps>().props;

  const { ref: servicesRef, inView: servicesInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { ref: galleryRef, inView: galleryInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (servicesInView) {
      const elements = document.querySelectorAll('.service-item');
      elements.forEach((el, i) => {
        setTimeout(() => {
          el.classList.remove('opacity-0', 'translate-y-4');
          el.classList.add('opacity-100', 'translate-y-0');
        }, i * 150);
      });
    }
  }, [servicesInView]);

  useEffect(() => {
    if (galleryInView) {
      const elements = document.querySelectorAll('.gallery-item');
      elements.forEach((el, i) => {
        setTimeout(() => {
          el.classList.remove('opacity-0', 'translate-y-4');
          el.classList.add('opacity-100', 'translate-y-0');
        }, i * 150);
      });
    }
  }, [galleryInView]);

  return (
    <AppLayoutTemplate breadcrumbs={breadcrumbs}>
      <Head title="Accueil" />

      <Hero
        title="Créez des moments inoubliables"
        description="Nous concevons des événements personnalisés qui reflètent votre style et votre vision. Pour chaque occasion importante de votre vie, nous créons des expériences uniques."
      />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        {/* Section Services */}
        {services?.data?.length > 0 && (
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative rounded-xl border p-6">
          <SectionHeading
            title="Nos Services"
            subtitle="Des prestations personnalisées pour vos événements"
            centered
          />
          <div ref={servicesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {services.data.map((service) => (
              <div
                key={service.id}
                className="service-item opacity-0 translate-y-4 transition-all duration-700 ease-out"
              >
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  className="h-full"
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild>
              <Link href="/services" className="inline-flex items-center button-orange">
                Voir tous nos services <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>  )}

        {/* Section Galerie dynamique */}
        {items?.data?.length > 0 && (
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative rounded-xl border p-6 bg-secondary/40">
          <SectionHeading
            title="Notre Galerie"
            subtitle="Aperçu de nos créations et réalisations"
            centered
          />
          <div ref={galleryRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {items.data.map((item) => (
              <div
                key={item.id}
                className="gallery-item opacity-0 translate-y-4 transition-all duration-700 ease-out"
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
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/galerie" className="inline-flex items-center">
                Explorer la galerie <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>)}
      </div>
    </AppLayoutTemplate>
  );
}
