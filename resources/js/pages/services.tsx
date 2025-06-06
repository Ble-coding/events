import AppMenuLayout from '@/layouts/app/app-menu-layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { type BreadcrumbItem } from '@/types';
// import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/components/section-heading';
import CallToActionWithButton from '@/components/call-to-action';
import { ChevronRight } from 'lucide-react';

interface ServiceType {
  id: number;
  title: string;
  description: string;
  image: string;
  type_id?: number;
  type?: {
    name: string;
  };
  features?: string[]; // ✅ Ajouté ici
}

interface PageProps {
  services: {
    data: ServiceType[];
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  };
  allserviceItems: ServiceType[];
  [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Accueil',
    href: '/',
  },
  {
    title: 'Services',
    href: '/services',
  },
];



export default function ServicesPage() {
  const { services, allserviceItems } = usePage<PageProps>().props;
  const [search, setSearch] = useState('');


  const hasSearch = search.trim().length > 0;

  const filteredServices = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = allserviceItems ?? services.data;

    if (!term) return services.data;

    return list.filter(service =>
      service.title.toLowerCase().includes(term) ||
      service.description.toLowerCase().includes(term)
    );
  }, [search, services.data, allserviceItems]);




  const handlePageChange = (url: string | null) => {
    if (url) router.visit(url, { preserveScroll: true });
  };

  return (
    <AppMenuLayout breadcrumbs={breadcrumbs}>
      <Head title="Nos Services" />

      <section className="py-20 md:py-28 text-white">
        <div className="bg-orange-gk container mt-3 p-6">
          <div className="max-w-2xl animate-slide-in">
            <h1 className="text-playfair text-[60px] leading-tight mb-6">Nos Services</h1>
            <p className="text-white-90 text-[20px] mb-8">
              Découvrez notre gamme complète de prestations pour vos événements.
              Chaque service est conçu pour répondre à vos besoins spécifiques avec élégance et professionnalisme.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-white  ">
        <div className="container">
          <SectionHeading
            subtitle="Ce que nous proposons"
            title="Des prestations sur mesure"
            description="Chez Guil'O Services, nous mettons notre expertise à votre service pour créer des événements qui vous ressemblent."
          />

          <div className="my-6 text-end">
            <input
              type="text"
              placeholder="Rechercher un service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded px-4 py-2
              text-black dark:text-black
              dark:border-gray-100 dark:bg-white dark:placeholder:text-gray-500
              w-full max-w-md"
            />
          </div>

          <div className="space-y-16">
          {(hasSearch ? filteredServices : services.data).length === 0 ? (
  <p className="text-center text-gray-500 dark:text-gray-500 mt-10">Aucun résultat trouvé.</p>
) : (hasSearch ? filteredServices : services.data).map((service, index) => (
              <div key={service.id} className="grid md:grid-cols-2 gap-8 items-center">
                <div className={`rounded-lg overflow-hidden shadow-lg ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-auto animate-pulse-soft"
                  />
                </div>
                <div className="space-y-4 animate-slide-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="text-2xl font-medium text-primary">{service.title}</h3>
                  <p className="text-gray-500 dark:text-gray-500">{service.description}</p>
                  {service.features && service.features.length > 0 && (
  <ul className="list-none mt-4 space-y-2">
    {service.features.map((feature, idx) => (
      <li key={idx} className="flex items-start text-gray-500 dark:text-gray-500 text-sm">
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
        <span className="text-gray-500 dark:text-gray-500">{feature}</span>
      </li>
    ))}
  </ul>
)}

                  <Button  className='bg-white dark:bg-white
            dark:border-gray-100 text-black dark:text-black
            dark:hover:bg-gray-100/15' asChild variant="outline">
                    <Link href="/contact">Demander plus d'informations
                    <ChevronRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {!hasSearch && (
  <div className="flex justify-center gap-2 mt-12">
    {services.links.map((link, idx) => (
      <Button className='bg-gray-100 dark:bg-gray-100
      text-black dark:text-black
     border-gray-150 dark:border-gray-50
     hover:bg-black hover:text-white
      dark:hover:bg-black dark:hover:text-white'
        key={idx}
        variant={link.active ? 'default' : 'outline'}
        disabled={!link.url}
        dangerouslySetInnerHTML={{ __html: link.label }}
        onClick={() => handlePageChange(link.url)}
      />
    ))}
  </div>
)}

        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-50">
        <div className="container">
          <SectionHeading
            subtitle="Notre processus"
            title="Comment nous travaillons"
            description="Un processus simple et efficace pour créer l'événement parfait."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {["Consultation", "Planification", "Réalisation"].map((title, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-4">
                  {index + 1}
                </div>
                <h4 className="text-xl text-black dark:text-black font-semibold mb-3">{title}</h4>
                <p className="text-gray-500 dark:text-gray-500">
                  {index === 0 && 'Nous commençons par comprendre vos besoins et vos envies pour votre événement.'}
                  {index === 1 && 'Nous élaborons un plan détaillé et un devis personnalisé pour votre projet.'}
                  {index === 2 && 'Nous prenons en charge l\'organisation et la mise en place de votre événement avec soin.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CallToActionWithButton
        title="Prêt à créer un événement inoubliable ?"
        description="Contactez-nous dès aujourd'hui pour discuter de votre projet et commencer à créer des souvenirs exceptionnels."
        buttonText="Demander un devis gratuit"
        buttonLink="/contact"
        bgColorClass="bg-dark-gk"  // Utilisez la couleur de fond que vous souhaitez
        textColorClass="text-white"
        buttonVariant="outline"  // Vous pouvez changer le style du bouton ici
      />
    </AppMenuLayout>
  );
}
