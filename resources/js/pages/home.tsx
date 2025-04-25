import AppLayoutTemplate from '@/layouts/app/app-menu-layout';
import { type BreadcrumbItem } from '@/types';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

import { Button } from "@/components/ui/button";
import Hero from '@/components/hero';
import SectionHeading from '@/components/section-heading';
import GalleryItem from '@/components/gallery-item';
import ServiceCard from '@/components/service-card';
import TestimonialCard from '@/components/testimonial-card';


interface ServiceType {
  id: number;
  title: string;
  description: string;
  image: string;
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


interface TestimonialType {
    id: number;
    content: string;
    author: string;
    role: string;
    avatar: string;
  }


  interface Paginated<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
  }

interface HomePageProps {
    items: {
      data: GalleryItemType[];
    };
    services: {
      data: ServiceType[];
    };
    testimonials: Paginated<TestimonialType>;
    [key: string]: unknown; // 👈 ajoute ceci
  }




const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Home() {
    const { items, services, testimonials } = usePage<HomePageProps>().props;

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

       {/* About Section */}
       <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
            <SectionHeading
            title="À propos de nous"
            subtitle="Bienvenue chez Guil'O Services"
            centered
          />
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Depuis notre création, Guil'O Services s'est imposé comme une référence dans l'organisation d'événements. Notre passion pour l'excellence et notre souci du détail font de chaque projet une expérience unique.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Notre équipe créative et dévouée travaille sans relâche pour transformer vos envies en réalités exceptionnelles, qu'il s'agisse d'un mariage élégant, d'une fête d'anniversaire inoubliable ou d'une cérémonie solennelle.
              </p>
              <p className="font-medium mb-6">
                Nos valeurs : <span>Excellence, Créativité, Personnalisation</span>

              </p>
            </div>
            {services?.data?.length > 0 && (
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative rounded-xl border p-6">


                    {/* Images de services */}
                    <div className="grid grid-cols-2 gap-4 mt-12">
                    <div className="space-y-4">
                        {services.data
                        .filter((_, index) => index % 2 === 0)
                        .map((service, index) => (
                            <img
                            key={service.id}
                            src={service.image} // ou service.image_url selon ton API
                            alt={service.title}
                            className={`rounded-lg w-full object-cover shadow-lg ${
                                index % 2 === 0 ? 'h-48 translate-y-8' : 'h-64'
                            }`}
                            />
                        ))}
                    </div>
                    <div className="space-y-4">
                        {services.data
                        .filter((_, index) => index % 2 !== 0)
                        .map((service, index) => (
                            <img
                            key={service.id}
                            src={service.image}
                            alt={service.title}
                            className={`rounded-lg w-full object-cover shadow-lg ${
                                index % 2 === 0 ? 'h-64' : 'h-48 translate-y-4'
                            }`}
                            />
                        ))}
                    </div>
                    </div>


                </div>
                )}

          </div>
        </div>
      </section>


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



        {/* Testimonials Section */}

        {testimonials?.data?.length > 0 && (
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative rounded-xl border p-6 bg-secondary/40">
          <SectionHeading
            title="Ce que nos clients disent"
            subtitle="Des témoignages authentiques de clients satisfaits de nos services."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {testimonials.data.map((testimonial, index) => (
            <TestimonialCard
                key={index}
                content={testimonial.content}
                author={testimonial.author}
                role={testimonial.role}
                avatarSrc={
                typeof testimonial.avatar === 'string'
                    ? `/storage/${testimonial.avatar}`
                    : undefined
                }
            />
            ))}
          </div>
          <div className="text-center mt-12">
          {testimonials.links.map((link, idx) => (
            <Button
            key={idx}
            variant={link.active ? 'default' : 'outline'}
            disabled={!link.url}
            dangerouslySetInnerHTML={{ __html: link.label }}
            onClick={() => router.visit(link.url!, { preserveScroll: true })}
            />
        ))}
        </div>
        </div>)}




      </div>
    </AppLayoutTemplate>
  );
}
